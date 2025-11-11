document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const savedUser = JSON.parse(localStorage.getItem("userData"));

  if (savedUser && savedUser.email === email && savedUser.password === password) {
    localStorage.setItem("user", JSON.stringify({ name: savedUser.name, email }));
    alert("✅ Login successful!");
    window.location.href = "basic_structure.html";
  } else {
    alert("❌ Invalid email or password!");
  }
});
