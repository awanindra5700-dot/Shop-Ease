document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userGreeting = document.getElementById("userGreeting");

  const user = JSON.parse(localStorage.getItem("user"));

  if (user) showUserGreeting(user.name);

  loginBtn.addEventListener("click", () => {
    window.location.href = "login.html";
  });

  signupBtn.addEventListener("click", () => {
    window.location.href = "signup.html";
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");
    userGreeting.textContent = "";
    loginBtn.style.display = "inline-block";
    signupBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  });

  function showUserGreeting(name) {
    userGreeting.textContent = `👋 Welcome, ${name}`;
    loginBtn.style.display = "none";
    signupBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  }
});
