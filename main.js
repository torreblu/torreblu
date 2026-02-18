/* ===================================================
   MAIN.JS - TORREBLU (VERSIÓN DEFINITIVA v1.5)
=================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // 1. FOOTER - AÑO ACTUAL AUTOMÁTICO
    const yearElem = document.getElementById("year");
    if (yearElem) {
        yearElem.textContent = new Date().getFullYear();
    }

    // 2. NAVEGACIÓN - MENÚ ACTIVO Y HAMBURGUESA
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
            // Cambiar el icono de hamburguesa a una X si está activo
            hamburger.textContent = navMenu.classList.contains("active") ? "✕" : "☰";
        });
    }

    // 3. LÓGICA DEL CARRUSEL DINÁMICO (FETCH DE PRODUCTOS)
    const track = document.getElementById("carousel-track");
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");

    if (track) {
        // Cargar productos desde productos.html
        fetch("productos.html")
            .then(res => {
                if (!res.ok) throw new Error("No se pudo cargar productos.html");
                return res.text();
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                // Buscamos los elementos con clase .card.producto
                const productos = doc.querySelectorAll(".card.producto");

                if (productos.length > 0) {
                    track.innerHTML = ""; // Limpiamos el track antes de inyectar

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

                    // Inicializamos la lógica de movimiento una vez inyectados los datos
                    initCarouselLogic();
                } else {
                    console.warn("No se encontraron elementos con la clase .card.producto en productos.html");
                }
            })
            .catch(err => {
                console.error("Error en el fetch del carrusel:", err);
            });
    }

    function initCarouselLogic() {
        if (!track || !prevBtn || !nextBtn) return;

        // Calculamos el desplazamiento basado en el ancho del primer item
        const getScrollStep = () => {
            const firstItem = track.querySelector(".carousel-item");
            return firstItem ? firstItem.offsetWidth + 25 : 325; // 25 es el gap del CSS
        };

        let autoPlayInterval;

        const moveNext = () => {
            const step = getScrollStep();
            // Si llegamos al final (con un margen de 10px), volvemos al inicio
            if (track.scrollLeft + track.offsetWidth >= track.scrollWidth - 10) {
                track.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                track.scrollBy({ left: step, behavior: "smooth" });
            }
        };

        const movePrev = () => {
            const step = getScrollStep();
            if (track.scrollLeft <= 0) {
                track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
            } else {
                track.scrollBy({ left: -step, behavior: "smooth" });
            }
        };

        // Autoplay cada 4 segundos
        const startAutoPlay = () => {
            stopAutoPlay(); // Limpiamos cualquier intervalo previo por seguridad
            autoPlayInterval = setInterval(moveNext, 4000);
        };

        const stopAutoPlay = () => clearInterval(autoPlayInterval);

        // Listeners de botones
        nextBtn.addEventListener("click", () => {
            stopAutoPlay();
            moveNext();
            startAutoPlay();
        });

        prevBtn.addEventListener("click", () => {
            stopAutoPlay();
            movePrev();
            startAutoPlay();
        });

        // Pausa al pasar el ratón por encima del carrusel
        track.addEventListener("mouseenter", stopAutoPlay);
        track.addEventListener("mouseleave", startAutoPlay);

        // Iniciar
        startAutoPlay();
    }
});
