document.addEventListener("DOMContentLoaded", () => {
  const ordersContainer = document.querySelector(".orders-container");

  // Fetch orders from localStorage
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  // If no orders exist
  if (orders.length === 0) {
    ordersContainer.innerHTML = `
      <div class="empty-orders">
        <img src="https://cdn-icons-png.flaticon.com/512/4076/4076504.png" alt="No Orders" width="180">
        <h3>No Orders Yet 🛍️</h3>
        <p>Looks like you haven’t placed any orders yet.</p>
        <a href="basic_structure.html" class="shop-now-btn">Shop Now</a>
      </div>
    `;
    return;
  }

  // Display each order
  ordersContainer.innerHTML = "";
  orders.forEach(order => {
    const orderCard = document.createElement("div");
    orderCard.classList.add("order-card");
    orderCard.innerHTML = `
      <img src="${order.image}" alt="${order.name}">
      <div class="order-details">
        <h3>${order.name}</h3>
        <p><strong>Price:</strong> $${order.price}</p>
        <p><strong>Date:</strong> ${order.date}</p>
        <p><strong>Status:</strong> ${order.status}</p>
      </div>
    `;
    ordersContainer.appendChild(orderCard);
  });
});
