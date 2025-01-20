import { localStorageHasUserId } from "./accountManager";
import { getTitleAndDescription } from "./apiHelper";
import { detectLanguage } from "./languageDetect";
import { wrapWordsWithSpans } from "./spanHelper";
import { initializeZoomLevel } from "./zoomHelper";

document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("nameInput");
  const descriptionInput = document.getElementById("descriptionInput");
  const typeDropdown = document.getElementById("typeDropdown");
  const languageTypeCodeBar = document.getElementById("languageType");
  const saveSnipButton = document.getElementById("saveSnippetButton");

  let editor;

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
    });

    setupEditorEvents();
    initializeZoomLevel(editor);
    clearInputs();
  });

  // Set up editor events
  function setupEditorEvents() {
    let changeTimeout;

    editor.getModel().onDidChangeContent(() => {
      const text = editor.getValue();
      wrapWordsWithSpans("", nameInput);
      wrapWordsWithSpans("", descriptionInput);

      clearTimeout(changeTimeout);
      changeTimeout = setTimeout(() => {
        if (text) {
          if (localStorageHasUserId()) {
            wrapWordsWithSpans("Generating...", descriptionInput);

            getTitleAndDescription(text).then((data) => {
              wrapWordsWithSpans(data.title, nameInput);
              wrapWordsWithSpans(data.description, descriptionInput);
            });
          } else {
            console.log("User is not logged in.");
            wrapWordsWithSpans('To generate a description you must Log In.', descriptionInput);
          }
        }
      }, 1650);

      const language = detectLanguage(text);
      typeDropdown.value = language;
      typeDropdown.dispatchEvent(new Event('change'));
    });
  }

  // Handle save snippet event
  saveSnipButton.addEventListener("click", () => {
    if (localStorageHasUserId()) {
      const title = nameInput.value;
      const description = descriptionInput.value;
      const code = editor.getValue();
      const language = typeDropdown.value;

      addSnippet(localStorageHasUserId(), title, description, code, language)
        .then((data) => {
          if (data.snippetExists) {
            console.log(data.snippetExists);
          } else if (data.fieldsReguired) {
            console.log(data.fieldsReguired);
          } else {
            clearInputs();
          }
        })
        .catch((err) => {
          console.error("Error saving snippet:", err);
        });
    } else {
      console.log("User is not logged in.");
      window.location.href = "../index.html";
    }
  });

  // Update language type on dropdown change
  typeDropdown.addEventListener("change", (event) => {
    const option = event.target.value;

    languageTypeCodeBar.textContent = option;
    monaco.editor.setModelLanguage(editor.getModel(), option);
  });

  // Clear input fields
  function clearInputs() {
    wrapWordsWithSpans("", nameInput);
    wrapWordsWithSpans("", descriptionInput);

    typeDropdown.value = typeDropdown.options[0].value;
    editor.setValue('');
  }
});