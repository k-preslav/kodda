import { getUserIdFromLocalStorage } from "../registerPage/registerPage.js";
import { addSnippet, getCodeProperties } from "../apiHelper.js";
import { getWordsFromSpans, wrapWordsWithSpans } from "../editor/spanHelper.js";
import { initializeZoomLevel } from "../editor/zoomHelper.js";

document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("nameInput");
  const descriptionInput = document.getElementById("descriptionInput");
  const typeDropdown = document.getElementById("typeDropdown");
  const languageTypeCodeBar = document.getElementById("languageType");
  const saveSnipButton = document.getElementById("saveSnippetButton");
  
  const propertiesPanel = document.getElementById("propertiesPanel");

  const pinButtons = document.querySelectorAll(".pinButton");
  const pinButtonName = document.getElementById("pinNameButton");
  const pinButtonDesc = document.getElementById("pinDescriptionButton");

  let editor;

  let propertiesReady = false;
  let propertiesReadyPromiseResolve;
  let propertiesReadyPromise = new Promise((resolve) => {
    propertiesReadyPromiseResolve = resolve;
  });

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
      contextmenu: false
    });

    setupEditorEvents();
    initializeZoomLevel(editor);
    reset();

    if (!getUserIdFromLocalStorage()) {
      saveSnipButton.textContent = "Log In";
    }
  });

  // Set up editor events
  function setupEditorEvents() {
    let changeTimeout;

    editor.getModel().onDidChangeContent(() => {
      const text = editor.getValue();
      reset();

      languageTypeCodeBar.textContent = "other";

      if (text == '') {
          saveSnipButton.disabled = true;
          reset(true);
      }

      clearTimeout(changeTimeout);
      changeTimeout = setTimeout(() => {
        if (text) {
          if (getUserIdFromLocalStorage()) {
            if (!isPinned(pinButtonDesc))
              wrapWordsWithSpans("Generating...", descriptionInput);            
            languageTypeCodeBar.textContent = "...";

            propertiesPanel.style.animation = "glowingShadow 1.65s infinite ease-in-out";
            propertiesPanel.style.opacity = 1;

            disablePinnedButtons();

            getCodeProperties(text).then((data) => {
              enablePinnedButtons();

              if (!isPinned(pinButtonName))
                wrapWordsWithSpans(data.title, nameInput);

              if (!isPinned(pinButtonDesc))
                wrapWordsWithSpans(data.description, descriptionInput);
              
              typeDropdown.value = data.language;
              languageTypeCodeBar.textContent = data.language;
              monaco.editor.setModelLanguage(editor.getModel(), data.language);

              // Wait for the description animation to finish
              setTimeout(() => {
                propertiesReady = true;
                propertiesReadyPromiseResolve();

                // Stop the glow animation
                propertiesPanel.style.animation = "none";
              }, data.description.split(' ').length * 15 + 750);
            });
          } else {
            console.log("User is not logged in.");
            wrapWordsWithSpans('To generate a description you must Log In.', descriptionInput);
          }
        }
      }, 1650);
    });
  }

  // Handle save snippet event
  saveSnipButton.addEventListener("click", async () => {
    saveSnipButton.disabled = true;
    disablePinnedButtons();

    const code = editor.getValue();

    if (getUserIdFromLocalStorage()) {
      if (!propertiesReady && code !== '') {
        saveSnipButton.textContent = "Saving...";

        propertiesPanel.style.animation = "glowingShadow 1.65s infinite ease-in-out";
        propertiesPanel.style.opacity = 1;

        console.log("Waiting for properties to finish generating...");
        
        await propertiesReadyPromise;
        console.log("Properties ready!");
      }

      const title = getWordsFromSpans(nameInput);
      const description = getWordsFromSpans(descriptionInput);
      const language = typeDropdown.value;

      console.log(description);

      addSnippet(getUserIdFromLocalStorage(), title, description, code, language)
        .then((data) => {
          if (data.snippetExists) {
            alert(data.snippetExists);
            saveSnipButton.textContent = "Save Snippet";
            saveSnipButton.disabled = false;
          } else if (data.fieldsReguired) {
            alert(data.fieldsReguired);
            enablePinnedButtons();
            saveSnipButton.textContent = "Save Snippet";
            saveSnipButton.disabled = false;
          } else {
            reset(true);
            editor.setValue('');
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

  pinButtons.forEach(pinButn => {
    pinButn.addEventListener("click", () => {
      pinButn.classList.toggle('on');
    });
  });

  // Update language type on dropdown change
  typeDropdown.addEventListener("change", (event) => {
    const option = event.target.value;

    languageTypeCodeBar.textContent = option;
    monaco.editor.setModelLanguage(editor.getModel(), option);
  });

  // Clear input fields
  function reset(fullReset=false) {  
    if (fullReset)
    {
      unpin(pinButtonName);
      unpin(pinButtonDesc);
    }
    
    if (!isPinned(pinButtonName))
      wrapWordsWithSpans("", nameInput);
    
    if (!isPinned(pinButtonDesc))
      wrapWordsWithSpans("", descriptionInput);

    disablePinnedButtons();

    typeDropdown.value = "other";

    saveSnipButton.textContent = "Save Snippet";
    saveSnipButton.disabled = false;

    propertiesReady = false;
    propertiesReadyPromiseResolve = null;
    propertiesReadyPromise = new Promise((resolve) => {
      propertiesReadyPromiseResolve = resolve;
    });
  }

  // Pin when manually inputing name or description
  nameInput.addEventListener("input", () => {
    pin(pinButtonName);
    saveSnipButton.disabled = false;
  });
  descriptionInput.addEventListener("input", () => {
    pin(pinButtonDesc);
    saveSnipButton.disabled = false;
  });
  
  function disablePinnedButtons() {
    pinButtons.forEach((button) => {
      button.disabled = true;
    });
  }
  function enablePinnedButtons() {
    pinButtons.forEach((button) => {
      button.disabled = false;
    });
  }

  function isPinned(button) {
    if (button.classList.contains("on")) 
      return true;

    return false;
  }
  function pin(button) {
    button.classList.add("on")
  }
  function unpin(button) {
    button.classList.remove("on")
  }
});
