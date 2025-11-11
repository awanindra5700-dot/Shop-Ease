document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.querySelector(".cart-container");
  const totalPriceEl = document.querySelector(".total");
  const clearBtn = document.getElementById("clearCart");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const paymentPopup = document.getElementById("paymentPopup");
  const confirmPayment = document.getElementById("confirmPayment");
  const closePopup = document.getElementById("closePopup");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // 🧾 Display items
  function displayCart() {
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      totalPriceEl.textContent = "Total: $0.00";
      return;
    }

    let total = 0;
    cart.forEach((item, index) => {
      total += item.price;

      const card = document.createElement("div");
      card.classList.add("cart-item");
      card.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <div class="item-info">
          <h3>${item.title}</h3>
          <p>$${item.price.toFixed(2)}</p>
        </div>
        <button class="remove-btn" data-index="${index}">Remove</button>
      `;
      cartContainer.appendChild(card);
    });

    totalPriceEl.textContent = `Total: $${total.toFixed(2)}`;
  }

  // 🗑 Remove item
  cartContainer.addEventListener("click", e => {
    if (e.target.classList.contains("remove-btn")) {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      displayCart();
    }
  });

  // 🧹 Clear cart
  clearBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      cart = [];
      localStorage.removeItem("cart");
      displayCart();
    }
  });

  // 💳 Checkout popup
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    paymentPopup.style.display = "flex";
  });

  closePopup.addEventListener("click", () => {
    paymentPopup.style.animation = "fadeOut 0.3s forwards";
    setTimeout(() => {
      paymentPopup.style.display = "none";
      paymentPopup.style.animation = "fadeIn 0.4s forwards";
    }, 300);
  });

  // ✅ Fake Payment Process + Save to Orders
  confirmPayment.addEventListener("click", () => {
    const popupContent = document.querySelector(".popup-content");

    // Fake loading
    popupContent.innerHTML = `
      <div class="spinner"></div>
      <h3>Processing Payment...</h3>
      <p>Please wait while we confirm your transaction.</p>
    `;

    setTimeout(() => {
      // 🔥 Save purchase to "orders"
      const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
      const orderDate = new Date().toLocaleString();
      const batchId = "BATCH" + Date.now();

      const newOrders = cart.map(item => ({
  id: "ORD" + Math.floor(100000 + Math.random() * 900000),
  name: item.title, // 🟢 changed 'title' → 'name' for compatibility
  price: item.price,
  image: item.image,
  date: orderDate,
  batch: batchId,
  status: "✅ Confirmed",
  category: item.category || "General" // optional, helps admin chart
}));


      // Append to existing orders
      const allOrders = [...existingOrders, ...newOrders];
      localStorage.setItem("orders", JSON.stringify(allOrders));

      // 🎉 Success screen
      popupContent.innerHTML = `
        <div class="success-icon">✅</div>
        <h3>Payment Successful!</h3>
        <p>Your order has been placed successfully.</p>
        <button id="closeSuccess">View Orders</button>
      `;

      // Clear cart after payment
      localStorage.removeItem("cart");
      cart = [];
      displayCart();

      // Redirect to Orders
      document.getElementById("closeSuccess").addEventListener("click", () => {
        paymentPopup.style.animation = "fadeOut 0.3s forwards";
        setTimeout(() => {
          paymentPopup.style.display = "none";
          window.location.href = "orders.html";
        }, 300);
      });
    }, 2000);
  });

  // Initial load
  displayCart();
});
