export function detectLanguage(code) {
  code = code.trim().toLowerCase(); // Normalize input to make checks case insensitive

  // JavaScript
  if ((code.includes('function') || code.includes('=>')) && 
      (code.includes('var') || code.includes('let') || code.includes('const'))) {
    return 'javascript';
  }

  // HTML
  else if (code.includes('<html>') || code.includes('</html>') || 
           code.includes('<body>') || code.includes('<script>') || 
           code.includes('</script>') || code.includes('</body>')) {
    return 'html';
  }

  // Python
  else if (code.includes('def ') && code.includes(':')) {
    return 'python';
  }

  // C or C++
  else if (code.includes('#include') && ((code.includes('void ') || code.includes('int main()')))) {
    return 'cpp'; 
  }

  // C#
  else if ((code.includes('void ') || code.includes('public ') || 
            code.includes('static ') || code.includes('internal ') || 
            code.includes('private ') || code.includes('protected ')) &&
            code.includes('class ') && !code.includes('#include')) {
    return 'csharp';
  }

  // CSS
  else if (code.includes('{') && code.includes('}')) {
    if (code.includes('color') || code.includes('font') || code.includes('margin') || code.includes('padding')) {
      return 'css';
    }
  }

  // If none of the above match, return 'other'
  return 'other';
}
