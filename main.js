/* ===================================================
   MAIN.JS - SCRIPT GENERAL DEL SITIO TORREBLU
=================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // 1. ACTUALIZACIÓN DEL AÑO EN EL FOOTER
    const yearElem = document.getElementById("year");
    if (yearElem) {
        yearElem.textContent = new Date().getFullYear();
    }

    // 2. LÓGICA DE NAVEGACIÓN ACTIVA (Resaltar página actual)
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

    // 3. MENÚ HAMBURGUESA (Mobile)
    const hamburger = document.getElementById("nav-toggle");
    const navMenu = document.querySelector(".topnav ul");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", (event) => {
            event.preventDefault();
            navMenu.classList.toggle("active");
        });
    }

    // 4. CARRUSEL DINÁMICO: CARGA DE PRODUCTOS DESDE productos.html
    const track = document.getElementById("carousel-track");
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");

    if (track) {
        // Fetch para leer el archivo productos.html
        fetch("productos.html")
            .then(response => {
                if (!response.ok) throw new Error("No se pudo cargar productos.html");
                return response.text();
            })
            .then(htmlString => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlString, "text/html");
                // Buscamos todas las tarjetas de producto en el archivo externo
                const productosOriginales = doc.querySelectorAll(".card.producto");

                if (productosOriginales.length === 0) {
                    console.warn("No se encontraron productos con la clase .card.producto");
                    return;
                }

                // Limpiamos el track por si acaso
                track.innerHTML = "";

                // Creamos los items del carrusel (solo imagen)
                productosOriginales.forEach(prod => {
                    const imgOriginal = prod.querySelector("img");
                    
                    if (imgOriginal) {
                        const carouselItem = document.createElement("div");
                        carouselItem.className = "carousel-item";

                        const newImg = document.createElement("img");
                        newImg.src = imgOriginal.getAttribute("src");
                        newImg.alt = imgOriginal.getAttribute("alt") || "Producto TorreBlu";

                        carouselItem.appendChild(newImg);
                        track.appendChild(carouselItem);
                    }
                });
            })
            .catch(err => {
                console.error("Error al alimentar el carrusel:", err);
                track.innerHTML = "<p>Error al cargar productos destacados.</p>";
            });
    }

    // 5. CONTROLES DE DESPLAZAMIENTO DEL CARRUSEL
    if (track && prevBtn && nextBtn) {
        const scrollStep = 300; // Ajustado al min-width de carousel-item + margin

        nextBtn.addEventListener("click", () => {
            track.scrollBy({ left: scrollStep, behavior: "smooth" });
        });

        prevBtn.addEventListener("click", () => {
            track.scrollBy({ left: -scrollStep, behavior: "smooth" });
        });
    }

});
