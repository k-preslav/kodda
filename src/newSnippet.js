import { addSnippet, generateDescription } from "./apiHelper";
import { detectLanguage } from "./languageDetect";

document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("nameInput");
  const typeDropdown = document.getElementById("typeDropdown");
  const descriptionInput = document.getElementById("descriptionInput");
  const saveSnipButton = document.getElementById("saveSnippetButton");
  const messageLabel = document.getElementById("messageLabel");
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
          descriptionInput.value = 'Generating...';
          
          // Generate description
          generateDescription(text).then((data) => {
            descriptionInput.value = data.description;
          });
        }
      }, 1000);

      const language = detectLanguage(text);
  
      languageTypeCodeBar.textContent = language;
      typeDropdown.value = language;
      monaco.editor.setModelLanguage(editor.getModel(), language);
    });
  });

  // Save Snippet Event
  saveSnipButton.addEventListener("click", () => {
    messageLabel.textContent = "";
    let userId = localStorage.getItem("userId");

    if (userId) {
      const title = nameInput.value;
      const description = descriptionInput.value;
      const code = editor.getValue(); // Get code from Monaco
      const language = typeDropdown.value;

      addSnippet(userId, title, description, code, language)
        .then((data) => {
          if (data.snippetExists) {
            messageLabel.textContent = "This snippet is already added to your account.";
          } else {
            clearInputs();
            messageLabel.textContent = "Snippet saved successfully!";
          }
        })
        .catch((err) => {
          console.error("Error saving snippet:", err);
          messageLabel.textContent = "An error occurred while saving the snippet.";
        });
    } else {
      console.log("User is not logged in.");
      window.location.href = "../index.html";
    }
  });

  function clearInputs() {
    nameInput.value = '';
    typeDropdown.value = typeDropdown.options[0].value;
    descriptionInput.value = '';
    editor.setValue('');
  }
});
