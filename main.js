/* ===================================================
   MAIN.JS - TORREBLU (VERSIÓN MEJORADA)
=================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // 1. FOOTER - AÑO ACTUAL
    const yearElem = document.getElementById("year");
    if (yearElem) yearElem.textContent = new Date().getFullYear();

    // 2. MENÚ ACTIVO Y HAMBURGUESA
    let currentPage = location.pathname.split("/").pop() || "index.html";
    const links = document.querySelectorAll(".topnav a");
    
    links.forEach(link => {
        if (link.getAttribute("href") === currentPage) link.classList.add("active");
    });

    const hamburger = document.getElementById("nav-toggle");
    const navMenu = document.querySelector(".topnav ul");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", (e) => {
            e.preventDefault();
            navMenu.classList.toggle("active");
        });
    }

    // 3. LOGICA DEL CARRUSEL DINÁMICO
    const track = document.getElementById("carousel-track");
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");

    if (track) {
        // Cargar productos desde productos.html
        fetch("productos.html")
            .then(res => res.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const productos = doc.querySelectorAll(".card.producto");

                track.innerHTML = ""; // Limpiar

                productos.forEach(prod => {
                    const imgOriginal = prod.querySelector("img");
                    if (imgOriginal) {
                        const item = document.createElement("div");
                        item.className = "carousel-item";
                        const img = document.createElement("img");
                        img.src = imgOriginal.src;
                        img.alt = imgOriginal.alt;
                        item.appendChild(img);
                        track.appendChild(item);
                    }
                });

                // Una vez cargados, activar Autoplay
                initCarouselLogic();
            })
            .catch(err => console.error("Error al cargar carrusel:", err));
    }

    function initCarouselLogic() {
        if (!track || !prevBtn || !nextBtn) return;

        const scrollStep = 325; // Ancho item + gap
        let autoPlayInterval;

        // Función para mover al siguiente
        const moveNext = () => {
            if (track.scrollLeft + track.offsetWidth >= track.scrollWidth - 10) {
                track.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                track.scrollBy({ left: scrollStep, behavior: "smooth" });
            }
        };

        // Iniciar Autoplay
        const startAutoPlay = () => {
            autoPlayInterval = setInterval(moveNext, 4000);
        };

        const stopAutoPlay = () => clearInterval(autoPlayInterval);

        // Eventos de botones
        nextBtn.addEventListener("click", () => {
            stopAutoPlay();
            moveNext();
            startAutoPlay(); // Reiniciar el timer
        });

        prevBtn.addEventListener("click", () => {
            stopAutoPlay();
            track.scrollBy({ left: -scrollStep, behavior: "smooth" });
            startAutoPlay();
        });

        // Pausar al pasar el ratón
        track.addEventListener("mouseenter", stopAutoPlay);
        track.addEventListener("mouseleave", startAutoPlay);

        startAutoPlay();
    }
});
