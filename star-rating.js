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

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

document.addEventListener("DOMContentLoaded", function () {
  const containers = document.querySelectorAll(".star-review-container");

  containers.forEach(container => {
    const stars = container.querySelectorAll(".star");
    const ratingDisplay = container.querySelector(".rating-value");
    const postId = container.getAttribute("data-post-id");
    let userRated = false;

    // Ambil semua votes dari Firebase
    db.ref("ratings/" + postId + "/votes").on("value", snapshot => {
      const votes = snapshot.val() || {};
      const totalVotes = Object.values(votes);
      const count = totalVotes.length;
      const average = count > 0
        ? (totalVotes.reduce((a, b) => a + b, 0) / count).toFixed(1)
        : 0;
      ratingDisplay.textContent = `${average} (${count} vote${count > 1 ? 's' : ''})`;
      highlightStars(Math.round(average));
    });

    // Event klik bintang
    stars.forEach(star => {
      star.addEventListener("mouseover", function () {
        if (!userRated) {
          highlightStars(parseInt(this.getAttribute("data-value")));
        }
      });

      star.addEventListener("mouseout", function () {
        if (!userRated) {
          highlightStars(0);
        }
      });

      star.addEventListener("click", function () {
        if (userRated) return;

        const selectedRating = parseInt(this.getAttribute("data-value"));
        const newVoteRef = db.ref("ratings/" + postId + "/votes").push();
        newVoteRef.set(selectedRating);
        userRated = true;
        highlightStars(selectedRating);
      });
    });

    function highlightStars(rating) {
      stars.forEach(star => {
        const val = parseInt(star.getAttribute("data-value"));
        star.classList.toggle("selected", val <= rating);
      });
    }
  });
});
