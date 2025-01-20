const DEFAULT_FONT_SIZE = 14; // Default font size if not set in localStorage
const FONT_STEP = 4;
const MIN_FONT_SIZE = 8;

let currentFontSize;
let zoomLevel;

let editor;

// Functions for zoom controls
export function initializeZoomLevel(_editor) {
  editor = _editor;
  
  const savedFontSize = parseInt(localStorage.getItem("zoomLevel")) || DEFAULT_FONT_SIZE;
  currentFontSize = savedFontSize;
  
  editor.updateOptions({ fontSize: currentFontSize });
  updateZoomLevelDisplay();
}

// Update the zoom level display
function updateZoomLevelDisplay() {
  const percentage = Math.round((currentFontSize / DEFAULT_FONT_SIZE) * 100 / 25) * 25;
  if (zoomLevel) {
    zoomLevel.textContent = `${percentage}%`;
  }
}

// Save the zoom level in localStorage
export function rememberZoomLevel() {
  localStorage.setItem("zoomLevel", currentFontSize.toString());
}

// Change the font size by the given step
export function changeFontSize(amount) {
  const newFontSize = currentFontSize + amount;

  if (newFontSize >= MIN_FONT_SIZE) {
    currentFontSize = newFontSize;
    editor.updateOptions({ fontSize: currentFontSize });

    updateZoomLevelDisplay();
    rememberZoomLevel();
  }
}

// Set up zoom controls
document.addEventListener("DOMContentLoaded", () => {
  zoomLevel = document.getElementById("zoomLevel");

  const zoomInButton = document.getElementById("zoomIn");
  const zoomOutButton = document.getElementById("zoomOut");

  zoomInButton.addEventListener("click", () => changeFontSize(FONT_STEP));
  zoomOutButton.addEventListener("click", () => changeFontSize(-FONT_STEP));
});
