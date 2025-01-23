import { loginUser, loginUserById, registerUser } from "./apiHelper.js";

document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("usernameInput");
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");
  
  const registerButton = document.getElementById("registerButton");
  const loginButton = document.getElementById("loginButton");
  
  const messageLabel = document.getElementById("messageLabel");
  
  registerButton?.addEventListener("click", register);
  loginButton?.addEventListener("click", login);
  
  function register() {
    registerUser(usernameInput.value, emailInput.value, passwordInput.value).then((data) => {
      if (data.userId) {
        localStorage.setItem('userId', data.userId);
        messageLabel.textContent = "User registered successfully!";

        window.location.href = "../index.html";
      }
      else if (data.userExists) {
        messageLabel.textContent = "A user with this email already exists.";
      }
      else if (data.fieldsReguired) {
        messageLabel.textContent = "All fields are required.";
      } else {
        messageLabel.textContent = "An unexpected error occurred. Please try again.";
      }
    });
  }
  
  function login() {
    loginUser(usernameInput.value, emailInput.value, passwordInput.value).then((data) => {
      if (data.userId) {
        localStorage.setItem('userId', data.userId);
        messageLabel.textContent = "User logged in successfully!";

        window.location.href = "../index.html";
      }
      else if (data.notFound) {
        messageLabel.textContent = data.notFound;
      }
      else if (data.invalidCredentials) {
        messageLabel.textContent = data.invalidCredentials;
      }
      else if (data.fieldsReguired) {
        messageLabel.textContent = "All fields are required.";
      } else {
        messageLabel.textContent = "An unexpected error occurred. Please try again.";
      }
    });
  }
});

export async function autoLogin() {
  const userId = localStorage.getItem('userId');

  if (userId) {
    try {
      const data = await loginUserById(userId);
      if (data.userId) {
        return true;
      } else {
        localStorage.removeItem('userId');
        return false;
      }
    } catch (error) {
      console.error("Error:", error.message);
      return false;
    }
  }

  return false;
}

export function getUserIdFromLocalStorage() {
  let userId = localStorage.getItem("userId");

  if (userId) {
    return userId;
  }
  
  return false;
}