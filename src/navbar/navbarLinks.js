document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".navBarRight a");
  const currentPage = window.location.pathname;
  
  navLinks.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
    else link.classList.add("inactive");
  });
});
