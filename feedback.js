document.addEventListener("DOMContentLoaded", () => {
  const feedbackBtn = document.getElementById("submitFeedback");
  const feedbackInput = document.getElementById("userFeedback");
  const feedbackMsg = document.getElementById("feedbackMessage");
  const feedbackContainer = document.querySelector(".feedback-container");
  const starElements = document.querySelectorAll("#starRating span");
  const sortSelect = document.getElementById("sortFeedback");

  let selectedStars = 0;
  let storedFeedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

  // ⭐ Star rating click
  starElements.forEach(star => {
    star.addEventListener("click", () => {
      selectedStars = parseInt(star.dataset.star);
      updateStars(selectedStars);
    });
  });

  function updateStars(count) {
    starElements.forEach(star => {
      star.classList.toggle("active", parseInt(star.dataset.star) <= count);
    });
  }

  // Default sample reviews
  const defaultReviews = [
    { name: "Aman Kumar", text: "ShopEase has the best deals! Fast delivery and great support.", stars: 5 },
    { name: "Sneha Verma", text: "Loved the electronics section! Smooth checkout and great support.", stars: 4 },
    { name: "Rahul Singh", text: "Amazing fashion collection! Great prices and quality.", stars: 5 },
    { name: "Priya Mehta", text: "Delivery was a bit slow, but overall nice experience.", stars: 3 }
  ];

 function displayFeedbacks(sortOrder = "high") {
  feedbackContainer.innerHTML = "";

  let allFeedbacks = [...defaultReviews, ...storedFeedbacks];

  // Sort based on selected option
  if (sortOrder === "high") {
    allFeedbacks.sort((a, b) => b.stars - a.stars);
  } else {
    allFeedbacks.sort((a, b) => a.stars - b.stars);
  }

  // Show feedbacks with delay animation
  allFeedbacks.forEach((feedback, index) => {
    const card = document.createElement("div");
    card.classList.add("feedback-card");
    card.style.animationDelay = `${index * 0.15}s`; // staggered effect

    card.innerHTML = `
      <p>"${feedback.text}"</p>
      <h4>— ${feedback.name || "Anonymous"}</h4>
      <div class="stars">${"⭐".repeat(feedback.stars || 5)}</div>
    `;
    feedbackContainer.appendChild(card);
  });
}


  // Sort dropdown event
  if (sortSelect) {
    sortSelect.addEventListener("change", e => {
      displayFeedbacks(e.target.value);
    });
  }

  // Submit feedback
  if (feedbackBtn) {
    feedbackBtn.addEventListener("click", () => {
      const text = feedbackInput.value.trim();
      if (!text) return alert("Please write your feedback!");
      if (selectedStars === 0) return alert("Please select a star rating!");

      const name = prompt("Enter your name (optional):") || "Anonymous";
      const newFeedback = { name, text, stars: selectedStars };

      storedFeedbacks.push(newFeedback);
      localStorage.setItem("feedbacks", JSON.stringify(storedFeedbacks));

      feedbackInput.value = "";
      selectedStars = 0;
      updateStars(0);
      feedbackMsg.classList.remove("hidden");

      setTimeout(() => feedbackMsg.classList.add("hidden"), 3000);

      displayFeedbacks(sortSelect.value);
    });
  }
});
