document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".product-container");
    const searchInput = document.getElementById("searchInput");

    
    // Create dropdown controls dynamically
    const filterSection = document.createElement("div");
    filterSection.classList.add("filters");
    filterSection.innerHTML = `
        <select id="categoryFilter">
            <option value="all">All Categories</option>
            <option value="men's clothing">Men's Clothing</option>
            <option value="women's clothing">Women's Clothing</option>
            <option value="electronics">Electronics</option>
            <option value="jewelery">Jewelry</option>
        </select>

        <select id="sortSelect">
            <option value="default">Sort by</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
        </select>
    `;
    container.parentNode.insertBefore(filterSection, container);

    const categoryFilter = document.getElementById("categoryFilter");
    const sortSelect = document.getElementById("sortSelect");

    let allProducts = [];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Add cart count in navbar
    const navbar = document.querySelector(".navbar");
    const cartDisplay = document.createElement("div");
    cartDisplay.classList.add("cart-count");
    cartDisplay.innerHTML = `🛒 Cart: <span id="cartCount">${cart.length}</span>`;
    navbar.appendChild(cartDisplay);

    // Show loading text
    container.innerHTML = "<p>Loading products...</p>";

    fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(data => {
        // Add your custom products here
        const extraProducts = [
            {
                id: 101,
                title: "Wireless Gaming Mouse",
                price: 19.99,
                image: "https://m.media-amazon.com/images/I/61LtuGzXeaL._AC_SL1500_.jpg",
                category: "electronics"
            },
            {
                id: 102,
                title: "Smart Fitness Watch",
                price: 29.99,
                image: "https://m.media-amazon.com/images/I/61epn29QGNL._AC_SL1500_.jpg",
                category: "electronics"
            },
            {
                id: 103,
                title: "Classic Men's Jacket",
                price: 45.99,
                image: "https://m.media-amazon.com/images/I/71aE8XQxS1L._AC_UY879_.jpg",
                category: "mens clothing"
            },
            {
                id: 104,
                title: "Stylish Women's Handbag",
                price: 34.99,
                image: "https://m.media-amazon.com/images/I/71Zz3Fj6JRL._AC_UY695_.jpg",
                category: "womens clothing"
            },
            {
                id: 105,
                title: "Ceramic Kitchen Dinner Set",
                price: 59.99,
                image: "https://m.media-amazon.com/images/I/71c6bA5RzML._AC_SL1500_.jpg",
                category: "home"
            }
        ];

        // Merge API products + extra products
        allProducts = [...data, ...extraProducts];
        displayProducts(allProducts);
    })

        .catch(error => {
            container.innerHTML = "<p>Failed to load products.</p>";
            console.error(error);
        });

    // Display product cards
    function displayProducts(products) {
        container.innerHTML = "";

        if (products.length === 0) {
            container.innerHTML = "<p>No products found!</p>";
            return;
        }

        products.forEach(product => {
            const card = document.createElement("div");
            card.classList.add("product-card");
            card.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>$${product.price}</p>
                <button data-id="${product.id}">Add to Cart</button>
            `;
            container.appendChild(card);
        });

        // Add event listeners to buttons
        document.querySelectorAll(".product-card button").forEach(btn => {
            btn.addEventListener("click", e => {
                const id = e.target.dataset.id;
                addToCart(id);
            });
        });
    }

    // Add product to cart
    function addToCart(id) {
        const product = allProducts.find(p => p.id == id);
        if (!product) return;

        const exists = cart.find(item => item.id == product.id);
        if (exists) {
    showCartPopup("⚠️ Product already in cart!", false);
} else {
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showCartPopup("✅ Product added to cart!", true);
}
}
// ✅ Popup notification when adding to cart
function showCartPopup(message, success = true) {
  let popup = document.getElementById("cartPopup");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "cartPopup";
    popup.className = "cart-popup";
    document.body.appendChild(popup);
  }

  popup.textContent = message;
  popup.style.backgroundColor = success ? "#4caf50" : "#e74c3c"; // green or red
  popup.classList.add("show");

  // Hide popup after 2 seconds
  setTimeout(() => {
    popup.classList.remove("show");
  }, 2000);
}

    // Update cart count
    function updateCartCount() {
        document.getElementById("cartCount").textContent = cart.length;
    }

    // Apply all filters (search + category + sort)
    searchInput.addEventListener("input", applyFilters);
    categoryFilter.addEventListener("change", applyFilters);
    sortSelect.addEventListener("change", applyFilters);

    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        const sortOption = sortSelect.value;

        let filtered = allProducts.filter(p =>
            p.title.toLowerCase().includes(searchTerm)
        );

        if (category !== "all") {
            filtered = filtered.filter(p => p.category === category);
        }

        if (sortOption === "low") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortOption === "high") {
            filtered.sort((a, b) => b.price - a.price);
        }

        displayProducts(filtered);
    }
});


const navDots = document.getElementById("navDots");
const navDropdown = document.getElementById("navDropdown");

navDots.addEventListener("click", (e) => {
  e.stopPropagation();
  navDropdown.classList.toggle("hidden");
});

// Hide menu when clicking outside
document.addEventListener("click", (e) => {
  if (!navDropdown.contains(e.target) && !navDots.contains(e.target)) {
    navDropdown.classList.add("hidden");
  }
});

// Optional: Dark mode toggle inside menu
const toggleDarkMode = document.getElementById("toggleDarkMode");
if (toggleDarkMode) {
  toggleDarkMode.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
}

