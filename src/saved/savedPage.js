import { localStorageHasUserId } from "../accountManager";
import { fetchSnippets } from "../apiHelper";

let loadingText, noSnippets;

document.addEventListener("DOMContentLoaded", () => {
  loadingText = document.getElementById("loadingText");
  noSnippets = document.getElementById("noSnippets");

  displaySnippets();
});

function displaySnippets() {
  const userId = localStorageHasUserId();
  
  if (userId) {
    fetchSnippets(userId).then((snippets) => {
      if (snippets.length === 0) {
        noSnippets.style.visibility = "visible";
        loadingText.style.visibility = "hidden";
      } else {
        loadingText.style.visibility = "visible";
  
        snippets.forEach((snip, index) => {
          createSnippetPreview(snip.title, snip.description, snip._id, (previewElement) => {
            setTimeout(() => showSnippet(previewElement), index * 45 + 300);
          });
        });
      }
    });
  } else noSnippets.style.visibility = "visible";
}

function createSnippetPreview(title, description, id, callback) {
  const previewElement = document.createElement("saved-code-preview");

  const titleSlot = document.createElement("span");
  titleSlot.setAttribute("slot", "title");
  titleSlot.textContent = title;

  const descriptionSlot = document.createElement("span");
  descriptionSlot.setAttribute("slot", "description");
  descriptionSlot.textContent = description;

  const idSlot = document.createElement("span");
  idSlot.setAttribute("slot", "id");
  idSlot.textContent = id;

  previewElement.appendChild(titleSlot);
  previewElement.appendChild(descriptionSlot);
  previewElement.appendChild(idSlot);

  previewElement.addEventListener("click", () => onSnippetClick(previewElement));

  const galleryContainer = document.querySelector(".saved-gallery");
  galleryContainer.appendChild(previewElement);

  callback(previewElement);
}


function showSnippet(snip) {
  loadingText.style.visibility = "hidden";

  snip.style.visibility = "visible";
  snip.style.animation = "fadeInSlideUp 0.65s ease-out forwards";

  setTimeout(() => {
    snip.style.animation = "";
  }, 650)
}

function onSnippetClick(snippet) {
  const id = snippet.querySelector('[slot="id"]').textContent;
  window.location.href = `../../pages/edit.html?id=${id}`;
}
