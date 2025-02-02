import { verifyCode } from "../apiHelper";

document.addEventListener("DOMContentLoaded", () => {
  const codeInput = document.getElementById("codeInput");
  const verifyButton = document.getElementById("verifyButton");
  const messageLabel = document.getElementById("messageLabel");
  const buttonText = document.getElementById("buttonText");
  const successIcon = document.getElementById("successIcon");

  verifyButton.addEventListener("click", () => {

    const code = codeInput.value;

    verifyButton.disabled = true;
    buttonText.textContent = "Verifying...";

    verifyCode(code).then((data) => {
      if (data.verified) {
        messageLabel.style.display = "none";
        buttonText.style.display = "none";
        successIcon.style.display = "inline";

        setTimeout(() => {
          window.location.href = "../pages/new.html";
        }, 600);
      } else {
        messageLabel.textContent = "The code you entered is incorrect.";
        messageLabel.style.display = "block";

        verifyButton.disabled = false;
        buttonText.textContent = "Verify";

      }
    });
  });
});