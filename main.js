/* ===================================================
   MAIN.JS - TORREBLU (VERSIÓN INTEGRAL v1.6)
   Incluye: Footer, Nav, Carrusel Fetch y Visor PDF
=================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // 1. FOOTER - ACTUALIZACIÓN DE AÑO AUTOMÁTICA
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
                    track.innerHTML = "";
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

        const items = Array.from(track.children);
        if (items.length === 0) return;

        const getScrollStep = () => {
            const firstItem = track.querySelector(".carousel-item");
            return firstItem ? firstItem.offsetWidth + 25 : 325;
        };

        // 🔁 CLONAR PRIMEROS Y ÚLTIMOS ELEMENTOS PARA EFECTO INFINITO
        const firstClones = items.map(item => item.cloneNode(true));
        const lastClones = items.map(item => item.cloneNode(true));

        firstClones.forEach(clone => track.appendChild(clone));
        lastClones.reverse().forEach(clone => track.insertBefore(clone, track.firstChild));

        // Ajustar posición inicial
        const initialOffset = items.length * getScrollStep();
        track.scrollLeft = initialOffset;

        let autoPlayInterval;

        const moveNext = () => {
            track.scrollBy({ left: getScrollStep(), behavior: "smooth" });
        };

        const movePrev = () => {
            track.scrollBy({ left: -getScrollStep(), behavior: "smooth" });
        };

        const checkInfiniteScroll = () => {
            const totalWidth = getScrollStep() * items.length;

            if (track.scrollLeft <= 0) {
                track.scrollLeft = totalWidth;
            }

            if (track.scrollLeft >= totalWidth * 2) {
                track.scrollLeft = totalWidth;
            }
        };

        const startAutoPlay = () => {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(moveNext, 3000);
        };

        const stopAutoPlay = () => clearInterval(autoPlayInterval);

        nextBtn.addEventListener("click", () => {
            stopAutoPlay();
            moveNext();
            setTimeout(checkInfiniteScroll, 400);
            startAutoPlay();
        });

        prevBtn.addEventListener("click", () => {
            stopAutoPlay();
            movePrev();
            setTimeout(checkInfiniteScroll, 400);
            startAutoPlay();
        });

        track.addEventListener("scroll", () => {
            checkInfiniteScroll();
        });

        track.addEventListener("mouseenter", stopAutoPlay);
        track.addEventListener("mouseleave", startAutoPlay);

        startAutoPlay();
    }

    // 4. LÓGICA DE RECURSOS (VISOR DE PDF)
    const visorPDF = document.getElementById('visorPDF');
    const pdfTitle = document.getElementById('pdf-name');
    const btnViews = document.querySelectorAll('.btn-view');

    if (visorPDF && btnViews.length > 0) {
        btnViews.forEach(btn => {
            btn.addEventListener('click', function() {
                const url = this.getAttribute('data-pdf');
                if (!url) return;

                visorPDF.style.opacity = '0.3';
                
                setTimeout(() => {
                    visorPDF.src = url;

                    if (pdfTitle) {
                        pdfTitle.textContent = url.split('/').pop().replace(/%20/g, ' ');
                    }

                    visorPDF.style.opacity = '1';
                    
                    const pdfSection = document.querySelector('.pdf-section');
                    if (pdfSection) {
                        pdfSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 250);
            });
        });
    }
});
