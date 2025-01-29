import { setupFooterLinks } from "../elements/footer/footerLinks";

document.addEventListener("DOMContentLoaded", () => {
  const moreText = document.getElementById("moreText");
  const moreLink = document.getElementById("moreLink");

  const getStartedButton = document.getElementById("getStartedButton");

  moreText.style.maxHeight = "0";
  moreText.style.overflow = "hidden";
  moreText.style.opacity = "0";
  moreText.style.transition = "max-height 0.35s ease-out, opacity 0.35s ease-out";

  moreLink.addEventListener("click", (event) => {
    event.preventDefault();

    if (moreText.style.maxHeight === "0px" || moreText.style.maxHeight === "") {
      moreText.style.maxHeight = moreText.scrollHeight + "px";
      moreText.style.opacity = "1";
      moreLink.textContent = "▲ collapse";
    } else {
      moreText.style.maxHeight = "0";
      moreText.style.opacity = "0";
      moreLink.textContent = "learn more";
    }
  });

  getStartedButton.addEventListener("click", () => {
    window.location.href = "/pages/register.html";
  });

  setupFooterLinks();
});