document.getElementById("register").addEventListener("submit", async (e) => {
  e.preventDefault();

  const registerButton = document.getElementById("registerButton");
  const errorElement = document.getElementById("errorElement");
  const nameRegister = document.getElementById("name").value;
  const surnameRegister = document.getElementById("surname").value;
  const patronymicRegister = document.getElementById("patronymic").value;
  const yearRegister = document.getElementById("year").value;
  const loginRegister = document.getElementById("login").value;

  if (
    !nameRegister ||
    !surnameRegister ||
    !patronymicRegister ||
    !yearRegister ||
    !loginRegister
  ) {
    errorElement.textContent = "Все поля обязательны для заполнения!";
    errorElement.style.color = "red";
    return;
  }

  const data = {
    name: nameRegister,
    surname: surnameRegister,
    patronymic: patronymicRegister,
    year: Number(yearRegister),
    login: loginRegister,
    posts: []
  };

  registerButton.disabled = true;
  registerButton.textContent = "Отправка...";
  errorElement.textContent = "";

  try {
    const response = await fetch("http://127.0.0.1:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || `Ошибка HTTP: ${response.status}`);
    }

    errorElement.textContent = "Вы успешно зарегистрировались!";
    errorElement.style.color = "green";

    // Перенаправляем пользователя на страницу входа
    if (responseData.redirect) {
      window.location.href = responseData.redirect;
    } else {
      window.location.href = "/login";
    }
  } catch (error) {
    console.error("Ошибка:", error);
    errorElement.textContent =
      error.message || "Произошла ошибка при регистрации";
    errorElement.style.color = "red";
  } finally {
    registerButton.disabled = false;
    registerButton.textContent = "Зарегистрироваться";
  }
});
