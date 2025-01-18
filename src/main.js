import { autoLogin } from "./accountManager";

document.addEventListener("DOMContentLoaded", async () => {
  const isLoggedIn = await autoLogin();

  if (isLoggedIn === false) {
    console.log("No user found. Redirecting to sign");
    window.location.href = "./pages/sign.html";
  } else {
    console.log("Redirecting to new");
    window.location.href = "./pages/new.html";
  }
});