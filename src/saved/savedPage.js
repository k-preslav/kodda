import { getUserIdFromLocalStorage } from "../accountManager";
import { fetchSnippets } from "../apiHelper";
import { searchSnippets } from "./search";

let galleryContainer;
let loadingText, noAccountSnippets, noSearchSnippets;
let searchInput, searchButton;

document.addEventListener("DOMContentLoaded", () => {
  galleryContainer = document.querySelector(".saved-gallery");

  loadingText = document.getElementById("loadingText");
  noAccountSnippets = document.getElementById("noAccountSnippets");
  noSearchSnippets = document.getElementById("noSearchSnippets");

  displaySnippets();

  searchInput = document.getElementById("searchInput");
  searchButton = document.getElementById("searchButton");

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

  const userId = getUserIdFromLocalStorage();
  
  if (userId) {
    if (!snippets) {
      fetchSnippets(userId).then((snippets) => {
        if (snippets.length === 0) {
          noAccountSnippets.style.visibility = "visible";
          loadingText.style.visibility = "hidden";
        } else {
          loadingText.style.visibility = "visible";
          noAccountSnippets.style.visibility = "hidden";
        }

        createSnippets(snippets, 300);
      });
    } else {
      createSnippets(snippets, 300);
    }
  } else {
    noAccountSnippets.style.visibility = "visible";
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