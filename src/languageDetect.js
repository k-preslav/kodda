export function detectLanguage(code) {
  if (code.includes('function') && (code.includes('var') || code.includes('let') || code.includes('const')) || code.includes('=>')) {
    return 'javascript';
  }
  else if (code.includes('<html>') || code.includes('</html>') || code.includes('<body>') || code.includes('<script>')) {
    return 'html';
  }
  else if (code.includes('def ') || code.includes('import ')) {
    return 'python';
  }
  else if (code.includes('void ') && (code.includes('public ') || code.includes('static '))) {
    return 'csharp';
  }
  else if (code.includes('void ') && code.includes("class ") && code.includes("#include")) {
    return 'cpp';
  }
  else if (code.includes('void ') && code.includes("#include ")) {
    return 'c';
  }
  else
    return 'other';
}