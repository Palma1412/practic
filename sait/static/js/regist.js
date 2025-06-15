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
    const usersResponse = await fetch(
      "https://0f10fe1d0db3cc98.mokky.dev/users"
    );
    if (!usersResponse.ok) throw new Error("Ошибка при проверке пользователей");

    const allUsers = await usersResponse.json();
    const userExists = allUsers.some((user) => user.login === loginRegister);

    if (userExists) {
      errorElement.textContent = "Пользователь с таким логином уже существует!";
      errorElement.style.color = "red";
      return;
    }

    const response = await fetch("https://0f10fe1d0db3cc98.mokky.dev/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Ошибка HTTP: ${response.status}`);
    }

    const responseData = await response.json();

    errorElement.textContent = "Вы успешно зарегистрировались!";
    errorElement.style.color = "green";
    // localStorage.setItem("userData", JSON.stringify(userToStore));
    window.location.href = "signup.html";
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
