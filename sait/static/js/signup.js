document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const login = document.getElementById("login").value;
  const errorElement = document.getElementById("error");
  const loginButton = document.getElementById("loginButton");

  loginButton.disabled = true;
  loginButton.textContent = "Отправка...";
  errorElement.textContent = "";

  try {
    const response = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login }),
    });

    const userData = await response.json();

    if (!response.ok) {
      throw new Error(userData.error || "Ошибка входа");
    }

    localStorage.setItem("userData", JSON.stringify(userData.user));

    errorElement.style.color = "green";
    errorElement.textContent = "Вы успешно вошли!";
    setTimeout(() => {
      window.location.href = userData.redirect || "profile.html";
    }, 150);

  } catch (err) {
    errorElement.textContent = "Ошибка сервера: " + err.message + ". Попробуйте войти позже";
    errorElement.style.color = "red";
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Login";
  }
});
