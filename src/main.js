import { autoLoginUser } from "./apiHelper";

document.addEventListener("DOMContentLoaded", async () => {
  const isLoggedIn = await autoLoginUser();

  if (isLoggedIn === false) {
    if (localStorage.getItem('token')) {
      window.location.href = "./pages/register/register.html";
    } else {
      window.location.href = "./pages/landing.html";
    }
  } else if (isLoggedIn === "error") {
    console.log("FAILED TO LOAD KODDA");
  } else {
    console.log("Redirecting to new");
    window.location.href = "./pages/new.html";
  }
});