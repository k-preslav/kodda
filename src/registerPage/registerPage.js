import { isUserVerified, loginUser, registerUser, sendResetPasswordLink, sendVerificationCode } from "../apiHelper.js";
import { setupFooterLinks } from "../elements/footer/footerLinks.js";

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
  const forgotPassword = document.getElementById("changePasswordText");

  const signTitle = document.getElementById("signTitle");
  const loadingSpinner = document.getElementById("loadingSpinner");
  
  setupFooterLinks();

  // Check if token exists
  if (localStorage.getItem('token')) {
    toggleRegisterType(); // Make it switch to log in
  }

  registerButton?.addEventListener("click", () => {
    registerButton.disabled = true;

    if (registerType === "sign-up") register();
    else if (registerType === "log-in") login();
  });

  registerSwitch?.addEventListener("click", () => {
    toggleRegisterType();
  });

  emailInput.addEventListener("blur", () => {
    const email = emailInput.value.trim();
    if (email && !isValidEmail(email)) {
      messageLabel.textContent = "Please enter a valid email address.";
      messageLabel.style.display = "block";
    } else {
      messageLabel.style.display = "none";
    }
  });

  forgotPassword.addEventListener("click", () => { 
    sendResetPasswordLink().then((data) => {
      if (data.success) {
        sessionStorage.setItem('messagePageMsg', "Please check your email for a reset password link");
        window.location.href = "../pages/message.html";
      }
      else {
        sessionStorage.setItem('messagePageMsg', data.message);
        window.location.href = "../pages/message.html";
      }
    });
  });

  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

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
        emailInput.style.display = "none";
      } else {
        registerType = "sign-up";
        buttonText.textContent = "Sign Up";
        signTitle.textContent = "Create a new account";
        registerSwitch.textContent = "Already have an account?";
        emailInput.style.display = "block";
      }
      
      inputsContainer.classList.remove("fade-out");
      inputsContainer.classList.add("fade-in");
      inputsContainer.style.animation = "slideIn 0.3s forwards";
      
      setTimeout(() => {
        inputsContainer.style.animation = "";
      }, 300);

      messageLabel.style.display = "none";
      
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

  function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }


  function register() {
    showLoading();
    
    if (emailInput.value && !isValidEmail(emailInput.value)) {
      messageLabel.textContent = "Please enter a valid email address.";
      messageLabel.style.display = "block";
      
      // Reset button state
      hideLoading();
      buttonText.style.display = "inline";
      successIcon.style.display = "none";
      registerButton.disabled = false;

      return;
    } else {
      messageLabel.style.display = "none";
    }

    registerUser(usernameInput.value.toLowerCase(), emailInput.value.toLowerCase(), passwordInput.value).then((data) => {
      hideLoading();
      messageLabel.style.display = "block";
      forgotPassword.style.display = "none";

      if (data.userId) {
        showLoading();
        
        messageLabel.style.display = "none";
        buttonText.style.display = "none"; 
        successIcon.style.display = "none";

        sendVerificationCode().then((data) => {
          hideLoading();
          successIcon.style.display = "inline";

          if (data.success) {
            setTimeout(() => {
              window.location.href = "../pages/register/verify.html";
            }, 300);
          } else {
            messageLabel.textContent = "An unexpected error occurred. Please try again.";
            messageLabel.style.display = "block";
            verifyButton.disabled = true;

            buttonText.style.display = "inline";
            buttonText.textContent = "Verify";
          }
        });
      }
      else if (data.userExists) {
        buttonText.style.display = "inline"; 
        successIcon.style.display = "none";
        
        messageLabel.style.display = "block";
        messageLabel.textContent = data.userExists;
      }
      else if (data.fieldsRequired) {
        buttonText.style.display = "inline";
        successIcon.style.display = "none";
        
        messageLabel.style.display = "block";
        messageLabel.textContent = data.fieldsRequired;
      } else {
        buttonText.style.display = "inline";
        successIcon.style.display = "none";
        
        messageLabel.style.display = "block";
        messageLabel.textContent = "An unexpected error occurred. Please try again.";
      }

      registerButton.disabled = false;
    });
  }
  
  function login() {
    showLoading();

    forgotPassword.style.display = "none";

    if (emailInput.value && !isValidEmail(emailInput.value)) {
      messageLabel.textContent = "Please enter a valid email address.";
      messageLabel.style.display = "block";
      
      // Reset button state
      hideLoading();
      buttonText.style.display = "inline";
      successIcon.style.display = "none";
      registerButton.disabled = false;

      successIcon.style.display = "none";
      return;
    } else {
      messageLabel.style.display = "none";
    }

    loginUser(usernameInput.value.toLowerCase(), passwordInput.value).then((data) => {
      hideLoading();
      messageLabel.style.display = "block";
      
      if (data.userId) {
        showLoading();
        isUserVerified().then((verified) => {
          hideLoading();

          if (verified.verified) {
            messageLabel.style.display = "none";
            buttonText.style.display = "none";
            successIcon.style.display = "inline";

            setTimeout(() => {
              window.location.href = "../index.html";
            }, 600);
          }
          else {
            messageLabel.textContent = "Please verify your account.";
            messageLabel.style.display = "block";

            showLoading();
            registerButton.disabled = true;

            sendVerificationCode().then((data) => {
              hideLoading();
              successIcon.style.display = "inline";
              
              if (data.success) {
                setTimeout(() => {
                  window.location.href = "../pages/register/verify.html";
                }, 100);
              }
            });
          }
        });
      }
      else if (data.notFound) {
        buttonText.style.display = "inline";
        successIcon.style.display = "none";
        
        messageLabel.textContent = data.notFound;
      }
      else if (data.invalidCredentials) {
        buttonText.style.display = "inline";
        successIcon.style.display = "none";
        
        messageLabel.textContent = "The password is incorrect.";
        forgotPassword.style.display = "block";
      }
      else if (data.fieldsRequired) {
        buttonText.style.display = "inline";
        successIcon.style.display = "none";
        
        messageLabel.textContent = data.fieldsRequired;
      } 
      else if (data.blocked) {
        buttonText.style.display = "inline";
        successIcon.style.display = "none";
        
        messageLabel.textContent = data.blocked;
      }
      else {
        buttonText.style.display = "inline";
        successIcon.style.display = "none";
        
        messageLabel.textContent = "An unexpected error occurred. Please try again.";
      }
      
      registerButton.disabled = false;
    });
  }
});