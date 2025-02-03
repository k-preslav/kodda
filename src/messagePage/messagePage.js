document.addEventListener('DOMContentLoaded', () => {
  const messageText = document.getElementById('messageText');
  messageText.textContent = sessionStorage.getItem('messagePageMsg');
});
