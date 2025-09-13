(function () {
  // Delay init sampai semua script termuat
  function initStarRating() {
    if (!window.firebase || !firebase.database) {
      console.warn('[StarRating] Firebase belum siap, retrying...');
      setTimeout(initStarRating, 500);
      return;
    }

    const containers = document.querySelectorAll('.star-review-container');
    if (!containers.length) {
      console.warn('[StarRating] Tidak ditemukan .star-review-container');
      return;
    }

    containers.forEach(container => {
      const postId = container.getAttribute('data-post-id');
      const stars = container.querySelectorAll('.star');
      const ratingDisplay = container.querySelector('.rating-value');

      if (!postId || !stars.length || !ratingDisplay) {
        console.warn('[StarRating] Element tidak lengkap untuk postId:', postId);
        return;
      }

      let userRated = localStorage.getItem('voted_' + postId) === 'true';

      // Ambil data rating dari Firebase
      firebase.database().ref('ratings/' + postId + '/votes').on('value', snapshot => {
        const votes = snapshot.val() || {};
        const voteValues = Object.values(votes);
        const total = voteValues.length;
        const average = total ? (voteValues.reduce((a, b) => a + b, 0) / total).toFixed(1) : '0.0';

        ratingDisplay.textContent = `${average} (${total} vote${total !== 1 ? 's' : ''})`;

        if (!userRated) highlightStars(Math.round(average));
      });

      // Tambahkan interaksi ke setiap bintang
      stars.forEach(star => {
        const val = parseInt(star.dataset.value);

        star.addEventListener('mouseover', () => {
          if (!userRated) highlightStars(val);
        });

        star.addEventListener('mouseout', () => {
          if (!userRated) highlightStars(0);
        });

        star.addEventListener('click', () => {
          if (userRated) return;

          userRated = true;
          localStorage.setItem('voted_' + postId, 'true');

          highlightStars(val);

          // Simpan vote ke Firebase
          firebase.database().ref('ratings/' + postId + '/votes').push().set(val)
            .then(() => console.log('[StarRating] Vote saved:', val))
            .catch(err => console.error('[StarRating] Error:', err));
        });
      });

      function highlightStars(rating) {
        stars.forEach(star => {
          const starVal = parseInt(star.dataset.value);
          star.classList.toggle('selected', starVal <= rating);
        });
      }
    });
  }

  // Mulai setelah DOM dan window load
  document.addEventListener('DOMContentLoaded', initStarRating);
  window.addEventListener('load', initStarRating);
})();
