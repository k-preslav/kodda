import { autoLoginUser, fetchSnippets, getSnippetById } from "../apiHelper.js";
import { searchSnippets } from "./search.js";

let galleryContainer;
let loadingText, noAccountSnippets, noSearchSnippets;
let searchInput, searchButton;

document.addEventListener("DOMContentLoaded", () => {
  galleryContainer = document.querySelector(".saved-gallery");

  loadingText = document.getElementById("loadingText");
  noAccountSnippets = document.getElementById("noAccountSnippets");
  noSearchSnippets = document.getElementById("noSearchSnippets");

  searchButton = document.getElementById("searchButton");
  searchInput = document.getElementById("searchInput");
  searchInput.focus();

  autoLoginUser().then((res) => {
    if (!localStorage.getItem('token') || res === false) {
      window.location.href = "../index.html";
    }
  });

  displaySnippets();

  searchButton.addEventListener("click", () => {
    search();
  });
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      search();
    }
  });
});

function clearGallery() {
  galleryContainer.innerHTML = '';
}

function search() {
  if (searchInput.value !== '') {
    searchSnippets(searchInput.value).then((snippets) => {
      if (snippets.length > 0) {
        noSearchSnippets.style.visibility = "hidden";
        displaySnippets(snippets);
      } else {
        noSearchSnippets.style.visibility = "visible";
        clearGallery();
      }
    });
  } else {
    noSearchSnippets.style.visibility = "hidden";
    displaySnippets();
  }
}

function displaySnippets(snippets) {
  clearGallery();
  
  loadingText.style.visibility = "visible";
  noAccountSnippets.style.visibility = "hidden";

  if (!snippets) {
    fetchSnippets().then((snippets) => {
      if (snippets.length === 0) {
        noAccountSnippets.style.visibility = "visible";
        loadingText.style.visibility = "hidden";
      }

      createSnippets(snippets, 300);
    });
  } else {
    createSnippets(snippets, 300);
  }
}

function createSnippets(snippets) {
  let snipElements = []

  snippets.forEach((snip) => {
    snipElements.push(createSnippetPreview(snip.title, snip.description, snip._id));
  });

  snipElements.forEach((element, index) => {
    setTimeout(() => {
      showSnippet(element)
    }, index * 40 + 600);
  });
}
function createSnippetPreview(title, description, id) {
  const previewElement = document.createElement("saved-code-preview");

  // Create slots for title, description, and ID
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

  galleryContainer.appendChild(previewElement);
  const copyButton = previewElement.shadowRoot.querySelector("#copyButton");
  if (copyButton) {
    copyButton.addEventListener("click", (event) => {
      event.stopPropagation();
  
      const snippetIdSlot = previewElement.querySelector('span[slot="id"]');
      const snippetId = snippetIdSlot ? snippetIdSlot.textContent : null;
  
      if (snippetId) {
        getSnippetById(snippetId)
          .then((data) => {
            const code = data.code;
            if (code) {
              navigator.clipboard.writeText(code).then(() => {
                const icon = copyButton.querySelector("i");
                if (icon) {
                  icon.classList.remove("fa-copy");
                  icon.classList.add("fa-check");
                }
  
                setTimeout(() => {
                  if (icon) {
                    icon.classList.remove("fa-check");
                    icon.classList.add("fa-copy");
                  }
                }, 1000);
              });
            }
          })
          .catch((error) => {
            console.error("Error fetching snippet:", error);
          });
      }
    });
  }  

  return previewElement;
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