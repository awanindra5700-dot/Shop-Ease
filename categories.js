

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".cat-btn");
  const container = document.querySelector(".category-products");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.category;

      // Highlight active button
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      fetchCategory(category);
    });
  });

  function fetchCategory(category) {
    container.innerHTML = "<p>Loading products...</p>";

    fetch(`https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`)
      .then(res => res.json())
      .then(data => {
        if (!data.length) {
          container.innerHTML = "<p>No products found in this category.</p>";
          return;
        }

        container.innerHTML = "";
        data.forEach(product => {
          const card = document.createElement("div");
          card.classList.add("product-card");
          card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="price">$${product.price}</p>
            <button data-id="${product.id}">Add to Cart</button>
          `;
          container.appendChild(card);
        });

        // Add to cart button event
        document.querySelectorAll(".product-card button").forEach(btn => {
          btn.addEventListener("click", e => {
            const id = e.target.dataset.id;
            addToCart(id, data);
          });
        });
      })
      .catch(err => {
        console.error(err);
        container.innerHTML = "<p>Failed to load products.</p>";
      });
  }

  function addToCart(id, data) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const product = data.find(p => p.id == id);

    if (!product) return;

    const exists = cart.find(item => item.id == product.id);
    if (exists) {
      showCartPopup("⚠️ Product already in cart!", false);
    } else {
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      showCartPopup("✅ Product added to cart!", true);
    }
  }

  // Popup
  function showCartPopup(message, success = true) {
    let popup = document.getElementById("cartPopup");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "cartPopup";
      popup.className = "cart-popup";
      document.body.appendChild(popup);
    }

    popup.textContent = message;
    popup.style.backgroundColor = success ? "#4caf50" : "#e74c3c";
    popup.classList.add("show");

    setTimeout(() => popup.classList.remove("show"), 2000);
  }
});
