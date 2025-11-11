document.getElementById("signupForm").addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  if (!name || !email || !password) {
    alert("Please fill all fields!");
    return;
  }

  const user = { name, email, password };
  localStorage.setItem("userData", JSON.stringify(user));

  alert("✅ Signup successful! You can now log in.");
  window.location.href = "login.html";
});
