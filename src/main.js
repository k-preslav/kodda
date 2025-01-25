import { autoLogin } from "./registerPage/registerPage";

document.addEventListener("DOMContentLoaded", async () => {
  const isLoggedIn = await autoLogin();

  if (isLoggedIn === false) {
    console.log("No user found. Redirecting to sign");
    window.location.href = "./pages/register.html";
  } else if (isLoggedIn === "error") {
    console.log("FAILED TO LOAD KODDA");
  } else {
    console.log("Redirecting to new");
    window.location.href = "./pages/new.html";
  }
});