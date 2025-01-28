import { loginUser, loginUserById, registerUser } from "../apiHelper.js";

document.addEventListener("DOMContentLoaded", () => {
  let registerType = "sign-up";

  const usernameInput = document.getElementById("usernameInput");
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");
  
  const registerButton = document.getElementById("registerButton");
  const buttonText = document.getElementById("buttonText");
  const successIcon = document.getElementById("successIcon");
  const registerSwitch = document.getElementById("registerSwitch");
  
  const messageLabel = document.getElementById("messageLabel");
  const signTitle = document.getElementById("signTitle");
  const loadingSpinner = document.getElementById("loadingSpinner");
  
  registerButton?.addEventListener("click", () => {
    if (registerType === "sign-up") register();
    else if (registerType === "log-in") login();

    registerButton.disabled = true;
  });

  registerSwitch?.addEventListener("click", () => {
    toggleRegisterType();
  });

  function toggleRegisterType() {
    const inputsContainer = document.getElementById("signInputs");

    usernameInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";
    
    inputsContainer.classList.add("fade-out");
    
    setTimeout(() => {
      if (registerType === "sign-up") {
        registerType = "log-in";
        buttonText.textContent = "Log In";
        signTitle.textContent = "Log in to your account";
        registerSwitch.textContent = "Don't have an account?";
        usernameInput.style.display = "none";
      } else {
        registerType = "sign-up";
        buttonText.textContent = "Sign Up";
        signTitle.textContent = "Create a new account";
        registerSwitch.textContent = "Already have an account?";
        usernameInput.style.display = "block";
      }
      
      inputsContainer.classList.remove("fade-out");
      inputsContainer.classList.add("fade-in");
      inputsContainer.style.animation = "slideIn 0.3s forwards";
      
      setTimeout(() => {
        inputsContainer.style.animation = "";
      }, 300);
      
      // Reset button state
      buttonText.style.display = "inline";
      successIcon.style.display = "none";
      registerButton.disabled = false;
    }, 300);
  }
  
  function showLoading() {
    buttonText.style.display = "none";
    successIcon.style.display = "none";
    loadingSpinner.style.display = "inline-block";
  }

  function hideLoading() {
    loadingSpinner.style.display = "none";
  }

  function register() {
    showLoading();
    registerUser(usernameInput.value, emailInput.value, passwordInput.value).then((data) => {
      hideLoading();
      messageLabel.style.display = "block";
      
      if (data.userId) {
        localStorage.setItem('userId', data.userId);
        messageLabel.style.display = "none";
        buttonText.style.display = "none"; 
        successIcon.style.display = "inline";

        setTimeout(() => {
          window.location.href = "../index.html";
        }, 600);
      }
      else if (data.userExists) {
        buttonText.style.display = "inline";
        messageLabel.textContent = "A user with this email already exists.";
      }
      else if (data.fieldsRequired) {
        buttonText.style.display = "inline";
        messageLabel.textContent = "All fields are required.";
      } else {
        buttonText.style.display = "inline";
        messageLabel.textContent = "An unexpected error occurred. Please try again.";
      }

      registerButton.disabled = false;

      setTimeout(() => {
        messageLabel.style.display = "none";
      }, 5000);
    });
  }
  
  function login() {
    showLoading();
    loginUser(emailInput.value, passwordInput.value).then((data) => {
      hideLoading();
      messageLabel.style.display = "block";
      
      if (data.userId) {
        localStorage.setItem('userId', data.userId);
        messageLabel.style.display = "none";
        buttonText.style.display = "none";
        successIcon.style.display = "inline";

        setTimeout(() => {
          window.location.href = "../index.html";
        }, 600);
      }
      else if (data.notFound) {
        messageLabel.textContent = data.notFound;
      }
      else if (data.invalidCredentials) {
        buttonText.style.display = "inline";
        messageLabel.textContent = data.invalidCredentials;
      }
      else if (data.fieldsRequired) {
        buttonText.style.display = "inline";
        messageLabel.textContent = "All fields are required.";
      } else {
        buttonText.style.display = "inline";
        messageLabel.textContent = "An unexpected error occurred. Please try again.";
      }
      
      registerButton.disabled = false;

      setTimeout(() => {
        messageLabel.style.display = "none";
      }, 5000);
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
      } 
      else {
        localStorage.removeItem('userId');
        return false; 
      } 
    } 
    catch (error) { 
      console.error("Error:", error.message); 
      return "error"; 
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
