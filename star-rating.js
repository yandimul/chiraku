// GANTI KONFIGURASI FIREBASE DENGAN MILIKMU
const firebaseConfig = {
  apiKey: "AIzaSyBmDLyL3J2bD05r8hF5OsU5b3W7H0ARfuM",
  authDomain: "star-rating-dfba8.firebaseapp.com",
  databaseURL: "https://star-rating-dfba8-default-rtdb.firebaseio.com/",
  projectId: "star-rating-dfba8",
  storageBucket: "star-rating-dfba8.firebasestorage.app",
  messagingSenderId: "198027457313",
  appId: "1:198027457313:web:9c073a303357d392784460",
  measurementId: "G-ZGMZ3Z1TEW"
};

document.addEventListener("DOMContentLoaded", function () {
  const containers = document.querySelectorAll(".star-review-container");
  console.log('Found star-review containers:', containers.length);

  containers.forEach(container => {
    const stars = container.querySelectorAll(".star");
    const ratingDisplay = container.querySelector(".rating-value");
    const postId = container.getAttribute("data-post-id");
    console.log('Init rating for postId =', postId, 'with stars count =', stars.length);

    if (!postId || stars.length === 0 || !ratingDisplay) {
      console.warn('Skipping this container, missing data');
      return;
    }

    let userRated = false;

    db.ref("ratings/" + postId + "/votes").on("value", snapshot => {
      const votes = snapshot.val() || {};
      const arr = Object.values(votes);
      const count = arr.length;
      const average = count > 0
        ? (arr.reduce((a, b) => a + b, 0) / count).toFixed(1)
        : '0';
      ratingDisplay.textContent = `${average} (${count} vote${count > 1 ? 's' : ''})`;
      highlightStars(Math.round(average));
    });

    stars.forEach(star => {
      const val = parseInt(star.getAttribute("data-value"));
      star.addEventListener("mouseover", function () {
        if (!userRated) {
          highlightStars(val);
        }
      });
      star.addEventListener("mouseout", function () {
        if (!userRated) {
          highlightStars(0);
        }
      });
      star.addEventListener("click", function () {
        console.log('Click handler:', val, postId);
        if (userRated) {
          console.log('Already rated, ignoring.');
          return;
        }
        userRated = true;
        const selected = val;
        highlightStars(selected);
        // Simpan ke Firebase
        db.ref("ratings/" + postId + "/votes").push().set(selected)
          .then(()=> console.log('Saved rating', selected))
          .catch(err => console.error('Error saving rating:', err));
      });
    });

    function highlightStars(rating) {
      stars.forEach(star => {
        const val2 = parseInt(star.getAttribute("data-value"));
        if (val2 <= rating) {
          star.classList.add("selected");
        } else {
          star.classList.remove("selected");
        }
      });
    }
  });
});
