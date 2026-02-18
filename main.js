/* ===================================================
   MAIN.JS - TORREBLU (VERSIÓN INTEGRAL v1.6)
   Incluye: Footer, Nav, Carrusel Fetch y Visor PDF
=================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // 1. FOOTER - ACTUALIZACIÓN DE AÑO AUTOMÁTICA
    // Busca el id="year" y coloca el año actual (ej. 2026)
    const yearElem = document.getElementById("year");
    if (yearElem) {
        yearElem.textContent = new Date().getFullYear();
    }

    // 2. NAVEGACIÓN - DETECCIÓN DE PÁGINA ACTIVA Y MENÚ MÓVIL
    const currentPath = location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".topnav ul li a");
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute("href");
        if (linkHref === currentPath) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    const hamburger = document.getElementById("nav-toggle");
    const navMenu = document.querySelector(".topnav ul");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", (e) => {
            e.preventDefault();
            navMenu.classList.toggle("active");
            // Cambia el icono de hamburguesa por una X al abrir
            hamburger.textContent = navMenu.classList.contains("active") ? "✕" : "☰";
        });
    }

    // 3. CARRUSEL DINÁMICO (FETCH DESDE PRODUCTOS.HTML)
    const track = document.getElementById("carousel-track");
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");

    if (track) {
        fetch("productos.html")
            .then(res => {
                if (!res.ok) throw new Error("No se pudo cargar productos.html");
                return res.text();
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const productos = doc.querySelectorAll(".card.producto");

                if (productos.length > 0) {
                    track.innerHTML = ""; // Limpiar contenido previo
                    productos.forEach(prod => {
                        const imgOriginal = prod.querySelector("img");
                        if (imgOriginal) {
                            const item = document.createElement("div");
                            item.className = "carousel-item";
                            const img = document.createElement("img");
                            img.src = imgOriginal.src;
                            img.alt = imgOriginal.alt || "Producto TorreBlu";
                            item.appendChild(img);
                            track.appendChild(item);
                        }
                    });
                    initCarouselLogic();
                }
            })
            .catch(err => console.error("Error en carrusel dinámico:", err));
    }

    function initCarouselLogic() {
        if (!track || !prevBtn || !nextBtn) return;

        const getScrollStep = () => {
            const firstItem = track.querySelector(".carousel-item");
            return firstItem ? firstItem.offsetWidth + 25 : 325; // Ancho + gap
        };

        let autoPlayInterval;

        const moveNext = () => {
            if (track.scrollLeft + track.offsetWidth >= track.scrollWidth - 10) {
                track.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                track.scrollBy({ left: getScrollStep(), behavior: "smooth" });
            }
        };

        const startAutoPlay = () => {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(moveNext, 4000);
        };

        const stopAutoPlay = () => clearInterval(autoPlayInterval);

        nextBtn.addEventListener("click", () => {
            stopAutoPlay();
            moveNext();
            startAutoPlay();
        });

        prevBtn.addEventListener("click", () => {
            stopAutoPlay();
            track.scrollBy({ left: -getScrollStep(), behavior: "smooth" });
            startAutoPlay();
        });

        track.addEventListener("mouseenter", stopAutoPlay);
        track.addEventListener("mouseleave", startAutoPlay);

        startAutoPlay();
    }

    // 4. LÓGICA DE RECURSOS (VISOR DE PDF)
    // Escucha clics en botones con clase .btn-view y lee el atributo data-pdf
    const visorPDF = document.getElementById('visorPDF');
    const pdfTitle = document.getElementById('pdf-name');
    const btnViews = document.querySelectorAll('.btn-view');

    if (visorPDF && btnViews.length > 0) {
        btnViews.forEach(btn => {
            btn.addEventListener('click', function() {
                const url = this.getAttribute('data-pdf');
                if (!url) return;

                // Efecto visual de transición
                visorPDF.style.opacity = '0.3';
                
                setTimeout(() => {
                    visorPDF.src = url;
                    // Actualiza el título en la barra del visor
                    if (pdfTitle) {
                        pdfTitle.textContent = url.split('/').pop().replace(/%20/g, ' ');
                    }
                    visorPDF.style.opacity = '1';
                    
                    // Scroll automático hacia el visor para mejor experiencia
                    const pdfSection = document.querySelector('.pdf-section');
                    if (pdfSection) {
                        pdfSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 250);
            });
        });
    }
});
