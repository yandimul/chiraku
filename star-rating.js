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


// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

document.addEventListener("DOMContentLoaded", function () {
  const containers = document.querySelectorAll(".star-review-container");

  containers.forEach(container => {
    const stars = container.querySelectorAll(".star");
    const ratingDisplay = container.querySelector(".rating-value");
    const postId = container.getAttribute("data-post-id");
    let currentRating = 0;

    // Ambil rating dari Firebase saat halaman dimuat
    db.ref("ratings/" + postId).once("value")
      .then(snapshot => {
        if (snapshot.exists()) {
          currentRating = snapshot.val().rating;
          ratingDisplay.textContent = currentRating;
          highlightStars(currentRating);
        }
      });

    stars.forEach(star => {
      star.addEventListener("mouseover", function () {
        highlightStars(parseInt(this.getAttribute("data-value")));
      });

      star.addEventListener("mouseout", function () {
        highlightStars(currentRating);
      });

      star.addEventListener("click", function () {
        currentRating = parseInt(this.getAttribute("data-value"));
        ratingDisplay.textContent = currentRating;
        highlightStars(currentRating);
        db.ref("ratings/" + postId).set({ rating: currentRating });
      });
    });

    function highlightStars(rating) {
      stars.forEach(star => {
        const val = parseInt(star.getAttribute("data-value"));
        if (val <= rating) {
          star.classList.add("selected");
        } else {
          star.classList.remove("selected");
        }
      });
    }
  });
});
