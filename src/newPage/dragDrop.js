export function attachDragOver(editorContainer) {
  editorContainer.addEventListener('dragover', (event) => {
    event.preventDefault();
    editorContainer.style.border = '2px dashed #D4A0FF';
  });
}

export function attachDragLeave(editorContainer) {
  editorContainer.addEventListener('dragleave', () => {
    editorContainer.style.border = '';
  });
}

export function attachOnDrop(editorContainer, editor) {
  editorContainer.addEventListener('drop', (event) => {
    event.preventDefault();
    editorContainer.style.border = ''; // Reset visual feedback
  
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
  
      // Read file content
      reader.onload = (e) => {
        const content = e.target.result;
        editor.setValue(content);
      };
  
      reader.onerror = (err) => {
        console.error("Failed to read file:", err);
      };
  
      reader.readAsText(file);
    }
  });
} 
