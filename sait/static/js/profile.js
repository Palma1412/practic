document.querySelectorAll("textarea").forEach((textarea) => {
  textarea.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });
});

const modal = document.getElementById("modal");
const openModalBtn = document.getElementById("openModalBtn");

openModalBtn?.addEventListener("click", () => {
  modal.style.display = "flex";
});

document.getElementById("closeModalBtn")?.addEventListener("click", () => {
  modal.style.animation = "fadeOut 0.3s ease-out";
  setTimeout(() => {
    modal.style.display = "none";
    modal.style.animation = "fadeIn 0.3s ease-out";
  }, 300);
});

let userData;

try {
  userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData) throw new Error("Данные пользователя не найдены");
  console.log(userData.surname);
} catch (error) {
  console.error("Ошибка загрузки данных:", error);
  window.location.href = "signup.html";
}

if (userData) {
  document.getElementById(
    "userName"
  ).textContent = `${userData.surname} ${userData.name} ${userData.patronymic}`;
  document.getElementById("userYear").textContent = `${userData.year} лет`;
}

const postButton = document.getElementById("modal-exist");
const postsContainer = document.getElementById("posts");

function displayPosts(postsArray) {
  postsContainer.innerHTML = "";
  postsArray?.forEach((post) => {
    postsContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="username-post">
        <h4>${post.author}:</h4>
        <p class="username-comment-p">${post.content}</p>
        <input class="username-post-input" type="text" placeholder="Комментарий ...">
      </div>`
    );
  });
}

postButton?.addEventListener("click", async () => {
  try {
    const textarea = document.getElementById("textareaData");
    const textareaData = textarea.value.trim();

    if (!textareaData) {
      alert("Пост не может быть пустым!");
      return;
    }

    const newPostData = {
      user_id: userData.id,
      content: textareaData,
    };

    const createPostResponse = await fetch("http://127.0.0.1:5000/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPostData),
    });

    if (!createPostResponse.ok) throw new Error("Ошибка создания поста");

    const createPostResult = await createPostResponse.json();

    await loadPosts();

    textarea.value = "";
    modal.style.display = "none";
  } catch (error) {
    console.error("Ошибка:", error);
    alert(`Ошибка: ${error.message}`);
  }
});

async function loadPosts() {
  try {
    const response = await fetch(`http://127.0.0.1:5000/users/${userData.id}/posts`);
    if (!response.ok) throw new Error("Ошибка загрузки постов");

    const data = await response.json();
    displayPosts(data.posts || []);
  } catch (error) {
    console.error("Ошибка:", error);
    postsContainer.innerHTML = "<p>Не удалось загрузить посты</p>";
  }
}

if (userData?.id) {
  loadPosts();
} else {
  console.error("ID пользователя не найден");
}

const modalHeader = document.getElementById("header-modal");
const modalYes = document.getElementById("header-modal-yes");
const modalNo = document.getElementById("header-modal-no");

document.getElementById("header-button").addEventListener("click", () => {
  modalHeader.style.display = "flex";
});

modalNo.addEventListener("click", () => {
  modalHeader.style.animation = "fadeOut 0.3s ease-out";
  setTimeout(() => {
    modalHeader.style.display = "none";
    modalHeader.style.animation = "fadeIn 0.3s ease-out";
  }, 300);
});

modalYes.addEventListener("click", () => {
  setTimeout(() => {
    window.location.href = "signup.html";
    localStorage.clear();
  }, 300);
});
