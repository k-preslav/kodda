import { addSnippet } from "./apiHelper";

document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("nameInput");
  const typeDropdown = document.getElementById("typeDropdown");
  const descriptionInput = document.getElementById("descriptionInput");
  
  const codeInput = document.getElementById("codeInput");
  
  const saveSnipButton = document.getElementById("saveSnippetButton");
  const messageLabel = document.getElementById("messageLabel");
  
  saveSnipButton.addEventListener("click", () => {
    messageLabel.textContent = "";
    let userId = localStorage.getItem("userId");

    if (userId) {
      const title = nameInput.value;
      const description = descriptionInput.value;
      const code = codeInput.value;
      const language = typeDropdown.value;
      
      addSnippet(userId, title, description, code, language).then((data) => {
        if (data.snippetExists) {
          messageLabel.textContent = "This snippet is already added to your account.";
        }
        else {
          clearInputs()
        }
      });
    } else {
      console.log("User is not logged in.");
      window.location.href = "../index.html";
    }
  });
});

function clearInputs() {
  nameInput.value = '';
  typeDropdown.value = typeDropdown.options[0].value;
  descriptionInput.value = '';
  codeInput.value = '';
}