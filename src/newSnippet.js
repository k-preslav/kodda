import { localStorageHasUserId } from "./accountManager";
import { addSnippet, generateDescription } from "./apiHelper";
import { detectLanguage } from "./languageDetect";

document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("nameInput");
  const typeDropdown = document.getElementById("typeDropdown");
  const descriptionInput = document.getElementById("descriptionInput");
  const saveSnipButton = document.getElementById("saveSnippetButton");
  const languageTypeCodeBar = document.getElementById("languageType");

  // Create the editor
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
      fontSize: 14,
      minimap: { enabled: false },
    });

    let changeTimeout;

    editor.getModel().onDidChangeContent(() => {
      const text = editor.getValue();
      descriptionInput.value = '';
      
      clearTimeout(changeTimeout);
      changeTimeout = setTimeout(() => {
        if (text) {
          if (localStorageHasUserId()) {
            descriptionInput.value = 'Generating...';

            // Generate description
            generateDescription(text).then((data) => {
              descriptionInput.value = data.description;
            });
          }
          else {
            console.log("User is not logged in.");
            descriptionInput.value = 'To generate a description you must Log In.';
          }
        }
      }, 1000);

      const language = detectLanguage(text);

      typeDropdown.value = language;
      typeDropdown.dispatchEvent(new Event('change'));
    });
  });

  // Check if user is logged in
  if (!localStorageHasUserId()) {
    saveSnipButton.textContent = "Log In";
  }

  // Save Snippet Event
  saveSnipButton.addEventListener("click", () => {
    if (localStorageHasUserId()) {
      const title = nameInput.value;
      const description = descriptionInput.value;
      const code = editor.getValue();
      const language = typeDropdown.value;

      addSnippet(userId, title, description, code, language)
        .then((data) => {
          if (data.snippetExists) {
            // TODO: Add a message that the snippet exists
            console.log(data.snippetExists);
          } else if (data.fieldsReguired) {
            // TODO: Add a message that the inputs are empty
            console.log(data.fieldsReguired);
          }else {
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

  // On language type selected
  typeDropdown.addEventListener("change", (event) => {
    const option = event.target.value;

    languageTypeCodeBar.textContent = option;
    monaco.editor.setModelLanguage(editor.getModel(), option);
  });
  

  function clearInputs() {
    nameInput.value = '';
    typeDropdown.value = typeDropdown.options[0].value;
    descriptionInput.value = '';
    editor.setValue('');
  }
});