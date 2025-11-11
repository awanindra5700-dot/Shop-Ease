// 🚨 Security check — don't allow non-admins to execute this JS
if (localStorage.getItem("isAdmin") !== "true") {
  console.warn("Access denied: Not an admin.");
  throw new Error("Unauthorized access to admin.js");
}


document.addEventListener("DOMContentLoaded", () => {
  const adminLogin = document.getElementById("adminLogin");
  const adminPanel = document.getElementById("adminPanel");
  const loginBtn = document.getElementById("adminLoginBtn");
  const logoutBtn = document.getElementById("adminLogout");

  // ✅ Always hide both first, then show correct one
  adminLogin.classList.add("hidden");
  adminPanel.classList.add("hidden");

  // Admin credentials
  const ADMIN_EMAIL = "admin@shopease.com";
  const ADMIN_PASS = "admin123";

  // ✅ Show correct section based on login state
  if (localStorage.getItem("isAdmin") === "true") {
    showAdminPanel();
  } else {
    adminLogin.classList.remove("hidden");
  }


  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value.trim();

    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
  localStorage.setItem("isAdmin", "true");
  showLoginPopup(); // ✅ Show success popup
  setTimeout(() => {
    showAdminPanel(); // Load admin panel after popup
  }, 2000);
}
 else {
  const failedPopup = document.getElementById("loginFailedPopup");
  failedPopup.classList.remove("hidden");

  const closeFailedPopup = document.getElementById("closeFailedPopup");
  closeFailedPopup.addEventListener("click", () => {
    failedPopup.classList.add("hidden");
  });
}


  });

 // ✅ Logout functionality (with proper timing)
logoutBtn.addEventListener("click", () => {
  const logoutPopup = document.getElementById("logoutConfirmPopup");
  logoutPopup.classList.remove("hidden");

  const cancelLogout = document.getElementById("cancelLogout");
  const confirmLogout = document.getElementById("confirmLogout");

  // Cancel logout — close popup slowly
  cancelLogout.onclick = () => {
    logoutPopup.classList.add("hidden");
  };

  // Confirm logout — show success popup and wait
  confirmLogout.onclick = () => {
    logoutPopup.classList.add("hidden");

    // Remove admin login session
    localStorage.removeItem("isAdmin");
    sessionStorage.clear();
    // Show "Logged out successfully" popup
    const logoutSuccess = document.getElementById("logoutPopup");
    logoutSuccess.classList.remove("hidden");

    // Keep it visible for 3 seconds before reload
    setTimeout(() => {
      logoutSuccess.classList.add("hidden");
      location.reload();
    }, 3000);
  };
});





  function showAdminPanel() {
    adminLogin.classList.add("hidden");
    adminPanel.classList.remove("hidden");
    loadDashboard();
  }

  function loadDashboard() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    // Stats
    document.getElementById("totalUsers").textContent = users.length;
    document.getElementById("totalOrders").textContent = orders.length;

    const totalRevenue = orders.reduce((sum, o) => sum + (o.price || 0), 0);
    document.getElementById("totalRevenue").textContent = `$${totalRevenue.toFixed(2)}`;

    const ordersTable = document.getElementById("ordersTable");
    ordersTable.innerHTML = "";

    if (orders.length === 0) {
      ordersTable.innerHTML = `<tr><td colspan="4">No orders found.</td></tr>`;
      return;
    }

    orders.forEach(order => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${order.name}</td>
        <td>$${order.price}</td>
        <td>${order.date}</td>
        <td>${order.status || "Completed"}</td>
      `;
      ordersTable.appendChild(row);
    });

    // Create charts
    generateCharts(orders);
  }

  function generateCharts(orders) {
    if (!orders.length) return;

    // 🟦 Revenue Over Time
    const monthlyRevenue = {};
    orders.forEach(o => {
      const month = new Date(o.date).toLocaleString("default", { month: "short" });
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (o.price || 0);
    });

    const ctx1 = document.getElementById("revenueChart").getContext("2d");
    new Chart(ctx1, {
      type: "line",
      data: {
        labels: Object.keys(monthlyRevenue),
        datasets: [{
          label: "Monthly Revenue ($)",
          data: Object.values(monthlyRevenue),
          borderColor: "rgba(75, 192, 192, 1)",
          fill: true,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "top" } }
      }
    });

    // 🟩 Orders by Category
    const categoryCount = {};
    orders.forEach(o => {
      const cat = o.category || "Other";
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    const ctx2 = document.getElementById("categoryChart").getContext("2d");
    new Chart(ctx2, {
      type: "doughnut",
      data: {
        labels: Object.keys(categoryCount),
        datasets: [{
          data: Object.values(categoryCount),
          backgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "bottom" } }
      }
    });
  }
});
function showLoginPopup() {
  const popup = document.getElementById("loginSuccessPopup");
  const closeBtn = document.getElementById("closePopupBtn");

  popup.classList.remove("hidden");

  // Close popup manually
  closeBtn.addEventListener("click", () => {
    popup.classList.add("hidden");
  });

  // Auto close after 3 seconds
  setTimeout(() => {
    popup.classList.add("hidden");
  }, 3000);
}
// 🕒 Auto Logout After 10 Minutes of Inactivity + 9-Minute Warning Popup

let logoutTimer, warningTimer;

function resetLogoutTimer() {
  clearTimeout(logoutTimer);
  clearTimeout(warningTimer);

  document.getElementById("sessionWarningPopup").classList.add("hidden");

  // Show warning after 9 minutes
  warningTimer = setTimeout(() => {
    document.getElementById("sessionWarningPopup").classList.remove("hidden");
  }, 540000); // 9 minutes

  // Auto logout after 10 minutes
  logoutTimer = setTimeout(() => {
    if (localStorage.getItem("isAdmin") === "true") {
      localStorage.removeItem("isAdmin");
      alert("⚠️ Session expired due to inactivity. Please log in again.");
      window.location.reload();
    }
  }, 600000); // 10 minutes
}

// Stay logged in button
document.getElementById("stayLoggedInBtn").addEventListener("click", () => {
  document.getElementById("sessionWarningPopup").classList.add("hidden");
  resetLogoutTimer();
});

// Reset timer on any user activity
["click", "mousemove", "keypress", "scroll", "touchstart"].forEach(event => {
  document.addEventListener(event, resetLogoutTimer);
});

// Start timer
resetLogoutTimer();
