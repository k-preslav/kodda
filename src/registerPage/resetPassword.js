import { resetPassword } from "../apiHelper";

document.addEventListener('DOMContentLoaded', () => {
    const changePasswordButton = document.getElementById('changePasswordButton');
    const buttonText = document.getElementById('buttonText');
    const newPasswordInput = document.getElementById('newPasswordInput');
    const confirmPasswordInput = document.getElementById('confirmPasswordInput');
    const messageLabel = document.getElementById('messageLabel');
    const successIcon = document.getElementById('successIcon');

    changePasswordButton.addEventListener('click', () => {
      changePasswordButton.disabled = true;
      
      if (newPasswordInput.value !== confirmPasswordInput.value) {
        messageLabel.textContent = "Passwords do not match";
        messageLabel.style.display = "block";
        
        changePasswordButton.disabled = false;
        return;
      }
      
      resetPassword(newPasswordInput.value).then((data) => {
        buttonText.textContent = "";
        successIcon.style.display = "inline";

        if (data.success) {
          window.location.href = "../index.html";
        }
        else {
          messageLabel.textContent = data.message;
          messageLabel.style.display = "block";
        }
      });
    });
});