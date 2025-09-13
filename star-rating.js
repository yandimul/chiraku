// GANTI KONFIGURASI FIREBASE DENGAN MILIKMU
const firebaseConfig = {
  apiKey: "AIzaSyBmDLyL3J2bD05r8hF5OsU5b3W7H0ARfuM",
  authDomain: "star-rating-dfba8.firebaseapp.com",
  databaseURL: "https://star-rating-dfba8-default-rtdb.firebaseio.com/",
  projectId: "star-rating-dfba8",
  storageBucket: "star-rating-dfba8.firebasestorage.app",
  messagingSenderId: "198027457313",
  appId: "1:198027457313:web:9c073a303357d392784460",
};

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing star rating...");

  // Pastikan Firebase sudah diinisialisasi sebelumnya

  const containers = document.querySelectorAll(".star-review-container");
  console.log("Found containers:", containers.length);

  containers.forEach(container => {
    const postId = container.getAttribute("data-post-id");
    console.log("Container postId:", postId);

    if (!postId) {
      console.warn("postId missing, skipping container");
      return;
    }

    const stars = container.querySelectorAll(".star");
    const ratingDisplay = container.querySelector(".rating-value");

    if (stars.length === 0 || !ratingDisplay) {
      console.warn("stars or rating display missing, skipping this container");
      return;
    }

    let userRated = false;

    // Ambil data votes
    firebase.database().ref("ratings/" + postId + "/votes").on("value", snapshot => {
      const votesObj = snapshot.val() || {};
      const votesArr = Object.values(votesObj);
      const count = votesArr.length;
      const sum = votesArr.reduce((acc, val) => acc + val, 0);
      const avg = count > 0 ? (sum / count).toFixed(1) : "0";
      ratingDisplay.textContent = `${avg} (${count} vote${count > 1 ? 's' : ''})`;
      highlight(Math.round(avg));
    });

    stars.forEach(star => {
      const val = parseInt(star.getAttribute("data-value"));
      star.addEventListener("mouseover", function() {
        if (!userRated) highlight(val);
      });
      star.addEventListener("mouseout", function() {
        if (!userRated) highlight(0);
      });
      star.addEventListener("click", function() {
        console.log("Star clicked:", val);
        if (userRated) {
          console.log("Already voted");
          return;
        }
        userRated = true;
        highlight(val);
        firebase.database().ref("ratings/" + postId + "/votes").push().set(val)
          .then(() => console.log("Vote saved:", val))
          .catch(err => console.error("Error saving vote:", err));
      });
    });

    function highlight(rating) {
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
