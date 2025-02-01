import { autoLoginUser, deleteSnippet, getSnippetById, updateSnippet } from "../apiHelper.js";
import { getWordsFromSpans, wrapWordsWithSpans } from "../editor/spanHelper.js";
import { initializeZoomLevel } from "../editor/zoomHelper.js";

document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("nameInput");
  const descriptionInput = document.getElementById("descriptionInput");
  const typeDropdown = document.getElementById("typeDropdown");
  const languageTypeCodeBar = document.getElementById("languageType");

  const saveSnipButton = document.getElementById("saveSnippetButton");
  const deleteSnipButton = document.getElementById("deleteSnippetButton");

  const loadingText = document.getElementById("loadingText");

  let editor;
  let snipToEdit;

  saveSnipButton.disabled = false;
  saveSnipButton.textContent = "Update Snippet";

  require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.35.0/min/vs' } });

  require(['vs/editor/editor.main'], function () {
    monaco.editor.defineTheme('kodda-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '876886', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'BB80B3', fontStyle: 'bold' },
        { token: 'number', foreground: 'F7C16C' },
        { token: 'string', foreground: 'D19A66' },
        { token: 'operator', foreground: 'C1C1C1' },
        { token: 'variable', foreground: 'D1D1D1' },
        { token: 'function', foreground: 'BB80B3' },
      ],
      colors: {
        'editor.background': '#2D2D2D',
        'editor.foreground': '#dddddd',
        'editorCursor.foreground': '#D4A0FF',
        'editor.lineHighlightBackground': '#3A3A3A',
        'editor.selectionBackground': '#9000ff89',
        'editor.selectionHighlightBackground': '#9000ff3e',
        'editor.inactiveSelectionBackground': '#9000ff3e',
        'editorIndentGuide.background': '#3A3A3A',
        'editorLineNumber.foreground': '#A0A0A0',
      }
    });

    editor = monaco.editor.create(document.getElementById('editor'), {
      value: '',
      language: 'javascript',
      theme: 'kodda-theme',
      automaticLayout: true,
      quickSuggestions: false,
      fontFamily: `"Source Code Pro", monospace`,
      minimap: { enabled: false },
      smoothScrolling: true,
      renderValidationDecorations: "off",
      contextmenu: false,
    });

    autoLoginUser().then((res) => {
      if (!localStorage.getItem('token') || res === false) {
        window.location.href = "../index.html";
      }
    });

    setupEditorEvents();
    initializeZoomLevel(editor);

    getSnippetToEdit();
  });

  // Set up editor events
  function setupEditorEvents() {
    editor.getModel().onDidChangeContent(() => {
      const text = editor.getValue();

      saveSnipButton.disabled = false;
      saveSnipButton.textContent = "Update Snippet";

      if (text == '') {
          saveSnipButton.disabled = true;
      }
    });
  }

  function getSnippetToEdit() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    loadingText.style.visibility = "visible";
    
    getSnippetById(id).then((data) => {
      snipToEdit = data;
      displayDataFromSnippet();

      loadingText.style.visibility = "hidden";
    });
  }

  // Displays the data from the snippet to the code editor and properties panel
  function displayDataFromSnippet() {
    wrapWordsWithSpans(snipToEdit.title, nameInput);
    wrapWordsWithSpans(snipToEdit.description, descriptionInput);
    
    typeDropdown.value = snipToEdit.language;
    typeDropdown.dispatchEvent(new Event("change"));

    editor.setValue(snipToEdit.code);
  }

  // Handle save snippet event
  saveSnipButton.addEventListener("click", async () => {
    saveSnipButton.disabled = true;

    saveSnipButton.classList.add("loading");
    saveSnipButton.textContent = "Saving...";

    const title = getWordsFromSpans(nameInput);
    const description = getWordsFromSpans(descriptionInput);
    const code = editor.getValue();
    const language = typeDropdown.value;

    updateSnippet(snipToEdit._id, title, description, code, language)
      .then((data) => {
        if (data.snippetExists) {
          alert(data.snippetExists);
          saveSnipButton.textContent = "Update Snippet";
          saveSnipButton.disabled = false;
        } else if (data.fieldsReguired) {
          alert(data.fieldsReguired);
          saveSnipButton.textContent = "Update Snippet";
          saveSnipButton.disabled = false;
        } 
        else if (data.userDoesNotExist) {
          alert(data.userDoesNotExist);
          saveSnipButton.textContent = "Update Snippet";
          saveSnipButton.disabled = false;
        } else {
          saveSnipButton.textContent = "Updated.";
          saveSnipButton.classList.remove("loading");
          saveSnipButton.disabled = true;
        }
      })
      .catch((err) => {
        console.error("Error updating snippet:", err);
      });
  });

  // Handle deletion
  deleteSnipButton.addEventListener("click", async () => {
    try {
      const data = await deleteSnippet(snipToEdit._id);

      if (data && data.error) {
        console.error(data.error);
        return;
      }
  
      setTimeout(() => {
        window.location.href = "../../pages/saved.html";
      }, 150);
  
    } catch (err) {
      console.error("Error deleting snippet:", err);
    }
  });
  

  // Update language type on dropdown change
  typeDropdown.addEventListener("change", (event) => {
    const option = event.target.value;

    saveSnipButton.disabled = false;
    saveSnipButton.textContent = "Update Snippet";

    languageTypeCodeBar.textContent = option;
    monaco.editor.setModelLanguage(editor.getModel(), option);
  });
  nameInput.addEventListener("input", () => {
    saveSnipButton.disabled = false;
    saveSnipButton.textContent = "Update Snippet";
  });
  descriptionInput.addEventListener("input", () => {
    saveSnipButton.disabled = false;
    saveSnipButton.textContent = "Update Snippet";
  });
});