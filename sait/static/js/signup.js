document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const login = document.getElementById("login").value;
  const errorElement = document.getElementById("error");
  const loginButton = document.getElementById("loginButton");

  loginButton.disabled = true;
  loginButton.textContent = "Отправка...";
  errorElement.textContent = "";

  try {
    const response = await fetch(
      `https://0f10fe1d0db3cc98.mokky.dev/users?login=${login}`
    );
    const userData = await response.json();
    console.log(userData);
    const userExists = userData.find((user) => user.login === login);

    if (userExists) {
      localStorage.setItem("userData", JSON.stringify(userExists));
      errorElement.style.color = "green";
      errorElement.textContent = "Вы успешно вошли!";
      setTimeout(() => {
        window.location.href = "profile.html";
      }, 150);
    } else {
      errorElement.textContent = "Пользователь не найден!";
    }
  } catch (err) {
    errorElement.textContent =
      "Ошибка сервера: " + err.message + "." + " Попробуйте войти позже";
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Login";
  }
});
