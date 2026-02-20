/* ===================================================
    MAIN.JS - TORREBLU (VERSIÓN MODULAR v1.7)
    Cambios: Carga de Header/Footer externos y DRY
=================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // --- FUNCIÓN PARA CARGAR COMPONENTES EXTERNOS (DRY) ---
    async function loadComponent(id, file) {
        const element = document.getElementById(id);
        if (!element) return;
        
        try {
            const response = await fetch(file);
            const html = await response.text();
            element.innerHTML = html;
            return true; // Indica que se cargó con éxito
        } catch (error) {
            console.error(`Error cargando ${file}:`, error);
            return false;
        }
    }

    // --- INICIALIZACIÓN DE COMPONENTES ---
    // Cargamos Header y Footer, luego ejecutamos la lógica que depende de ellos
    Promise.all([
        loadComponent("header-site", "header.html"),
        loadComponent("footer-site", "footer.html")
    ]).then(() => {
        initNavAndFooter(); // Ejecuta Nav y Footer solo cuando el HTML ya existe
    });

    function initNavAndFooter() {
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
    }

    // 3. CARRUSEL DINÁMICO (No depende de header/footer, corre de inmediato)
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
            .catch(err => console.error("Error carrusel:", err));
    }

    // ... lógica del carrusel se mantiene igual ...
    function initCarouselLogic() {
        if (!track || !prevBtn || !nextBtn) return;
        const items = Array.from(track.children);
        if (items.length === 0) return;

        const getScrollStep = () => {
            const firstItem = track.querySelector(".carousel-item");
            return firstItem ? firstItem.offsetWidth + 25 : 325;
        };

        const firstClones = items.map(item => item.cloneNode(true));
        const lastClones = items.map(item => item.cloneNode(true));
        firstClones.forEach(clone => track.appendChild(clone));
        lastClones.reverse().forEach(clone => track.insertBefore(clone, track.firstChild));
        track.scrollLeft = items.length * getScrollStep();

        let autoPlayInterval;
        const moveNext = () => track.scrollBy({ left: getScrollStep(), behavior: "smooth" });
        const startAutoPlay = () => { clearInterval(autoPlayInterval); autoPlayInterval = setInterval(moveNext, 3000); };
        const stopAutoPlay = () => clearInterval(autoPlayInterval);

        const checkInfiniteScroll = () => {
            const totalWidth = getScrollStep() * items.length;
            if (track.scrollLeft <= 0) track.scrollLeft = totalWidth;
            if (track.scrollLeft >= totalWidth * 2) track.scrollLeft = totalWidth;
        };

        nextBtn.addEventListener("click", () => { stopAutoPlay(); moveNext(); setTimeout(checkInfiniteScroll, 400); startAutoPlay(); });
        prevBtn.addEventListener("click", () => { stopAutoPlay(); track.scrollBy({ left: -getScrollStep(), behavior: "smooth" }); setTimeout(checkInfiniteScroll, 400); startAutoPlay(); });
        track.addEventListener("scroll", checkInfiniteScroll);
        track.addEventListener("mouseenter", stopAutoPlay);
        track.addEventListener("mouseleave", startAutoPlay);
        startAutoPlay();
    }

    // 4. LÓGICA DE RECURSOS (VISOR DE PDF)
    const btnViews = document.querySelectorAll('.btn-view');
    if (btnViews.length > 0) {
        btnViews.forEach(btn => {
            btn.addEventListener('click', function() {
                const visorPDF = document.getElementById('visorPDF');
                const pdfTitle = document.getElementById('pdf-name');
                const url = this.getAttribute('data-pdf');
                if (!url || !visorPDF) return;

                visorPDF.style.opacity = '0.3';
                setTimeout(() => {
                    visorPDF.src = url;
                    if (pdfTitle) pdfTitle.textContent = url.split('/').pop().replace(/%20/g, ' ');
                    visorPDF.style.opacity = '1';
                    const pdfSection = document.querySelector('.pdf-section');
                    if (pdfSection) pdfSection.scrollIntoView({ behavior: 'smooth' });
                }, 250);
            });
        });
    }
});





