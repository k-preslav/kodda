import { addSnippet } from "./apiHelper";

document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("nameInput");
  const typeDropdown = document.getElementById("typeDropdown");
  const descriptionInput = document.getElementById("descriptionInput");
  
  const codeInput = document.getElementById("codeInput");
  
  const saveSnipButton = document.getElementById("saveSnippetButton");
  
  saveSnipButton.addEventListener("click", () => {
    let userId = localStorage.getItem("userId");

    if (userId) {
      const title = nameInput.value;
      const description = descriptionInput.value;
      const code = codeInput.value;
      const language = typeDropdown.value;
      
      addSnippet(userId, title, description, code, language);
    } else {
      console.log("User is not logged in.");
    }
  });
});