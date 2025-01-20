import { localStorageHasUserId } from "../accountManager";
import { fetchSnippets } from "../apiHelper";

document.addEventListener("DOMContentLoaded", () => {
  displaySnippets();
});

function displaySnippets() {
  const userId = localStorageHasUserId();
  
  if (userId) {
    fetchSnippets(userId).then((snippets) => {
      if (snippets.length === 0) {
        document.getElementById("noSnippets").style.visibility = "visible";
        return;
      }

      snippets.forEach((snip, index) => {
        createSnippetPreview(snip.title, snip.description, (previewElement) => {
          setTimeout(() => showSnippet(previewElement), index * 45);
        });
      });
    });
  }
}

function createSnippetPreview(title, description, callback) {
  const previewElement = document.createElement("saved-code-preview");

  previewElement.style.visibility = "hidden";

  const titleSlot = document.createElement("span");
  titleSlot.setAttribute("slot", "title");
  titleSlot.textContent = title;

  const descriptionSlot = document.createElement("span");
  descriptionSlot.setAttribute("slot", "description");
  descriptionSlot.textContent = description;

  previewElement.appendChild(titleSlot);
  previewElement.appendChild(descriptionSlot);

  const galleryContainer = document.querySelector(".saved-gallery");
  galleryContainer.appendChild(previewElement);

  callback(previewElement);
}

function showSnippet(snip) {
  snip.style.visibility = "visible";
  snip.style.animation = "fadeInSlideUp 0.65s ease-out forwards";

  setTimeout(() => {
    snip.style.animation = "";
  }, 650)
}
