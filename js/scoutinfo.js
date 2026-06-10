import { setupTeamSearch } from "./teamSearch.js";

const themeToggle = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark") ? "dark" : "light"
    );
});

console.log("ScoutBuddy loaded");

document.addEventListener("DOMContentLoaded", () => {
    setupTeamSearch();
   
});