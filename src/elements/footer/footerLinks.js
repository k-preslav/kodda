export function setupFooterLinks() {
  const footerLinks = document.querySelectorAll("#footerRight a");
  
  footerLinks.forEach(link => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const platform = link.querySelector("i").classList[1]; // Get the icon class for the platform
  
      switch (platform) {
        case 'fa-envelope':
          const email = "Kodda<contact@kodda.app>";
          navigator.clipboard.writeText(email).then(() => {
            alert("Email copied to clipboard: " + email);
          }).catch(err => {
            console.error("Failed to copy email: ", err);
          });

          window.location.href = "mailto:" + email;
          break;
        case 'fa-dev':
          window.open("https://dev.to/k_preslav", "_blank");
          break;
        case 'fa-x-twitter':
          window.open("https://x.com/presku", "_blank");
          break;
        case 'fa-instagram':
          window.open("https://instagram.com/kodda.app", "_blank");
          break;
        default:
          break;
      }
    });
  });
}