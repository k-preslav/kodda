import { getUsername, sendResetPasswordLink, updateUsername } from "../apiHelper";

document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("usernameInput");
  const saveButton = document.getElementById("saveButton");
  const saveIcon = document.getElementById("saveIcon");
  const logOutButton = document.getElementById("logOutButton");
  const changePasswordButton = document.getElementById("changePasswordButton");

  getUsername().then((data) => {
    usernameInput.value = data.username;
  });

  saveButton.addEventListener("click", () => {
    updateUsername(usernameInput.value).then((data) => {
      if (data.success) {
        saveIcon.classList.add("fa-check");
        setTimeout(() => {
          saveIcon.classList.remove("fa-check");
        }, 1000);
      } else {
        alert(data.message);
      }
    });
  });

  logOutButton.addEventListener("click", () => {
    logOutButton.disabled = true;

    localStorage.removeItem("token");
    window.location.href = "../index.html";
  });

  changePasswordButton.addEventListener("click", () => {
    changePasswordButton.disabled = true;
    changePasswordButton.textContent = "Requesting...";

    sendResetPasswordLink(usernameInput.value.toLowerCase()).then((data) => {
      if (data.success) {
        localStorage.setItem('username', usernameInput.value.toLowerCase());

        sessionStorage.setItem('messagePageMsg', "Please check your email for a reset password link");
        window.location.href = "../pages/message.html";
      }
      else {
        sessionStorage.setItem('messagePageMsg', data.message);
        window.location.href = "../pages/message.html";
      }
    });
  });
});
