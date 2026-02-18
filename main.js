/* ===================================================
   MAIN.JS - SCRIPT GENERAL DEL SITIO
=================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const yearElem = document.getElementById("year");
    if (yearElem) {
        yearElem.textContent = new Date().getFullYear();
    }

    let currentPage = location.pathname.split("/").pop();
    if (!currentPage || currentPage === "/") {
        currentPage = "index.html";
    }

    const links = document.querySelectorAll(".topnav a");
    links.forEach(link => {
        const href = link.getAttribute("href");
        if (href === currentPage) {
            link.classList.add("active");
        }
    });

    const hamburger = document.getElementById("nav-toggle");
    const navMenu = document.querySelector(".topnav ul");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", (event) => {
            event.preventDefault();
            navMenu.classList.toggle("active");
        });
    }

    /* ==============================
       CARRUSEL PRODUCTOS
    ============================== */

    const track = document.getElementById("carousel-track");
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");

    if (track && prevBtn && nextBtn) {

        let scrollAmount = 0;
        const scrollStep = 320;

        nextBtn.addEventListener("click", () => {
            track.scrollBy({ left: scrollStep, behavior: "smooth" });
        });

        prevBtn.addEventListener("click", () => {
            track.scrollBy({ left: -scrollStep, behavior: "smooth" });
        });
    }

});
