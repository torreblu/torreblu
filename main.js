/* ===================================================
   MAIN.JS - SCRIPT GENERAL DEL SITIO
=================================================== */

/* ===================================================
   Inicialización al cargar el DOM:
   - Año dinámico en el footer
   - Marca la página activa en el menú
   - Menú hamburguesa en móvil
   - (Opcional) comportamiento extra en Recursos
=================================================== */

document.addEventListener("DOMContentLoaded", () => {
    /* Footer: año dinámico */
    const yearElem = document.getElementById("year");
    if (yearElem) {
        yearElem.textContent = new Date().getFullYear();
    }

    /* Navbar: marcar automáticamente la página activa */
    let currentPage = location.pathname.split("/").pop();

    // Si se accede a la raíz (ej. https://www.torreblu.com/)
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

    /* Menú hamburguesa en móvil */
    const hamburger = document.getElementById("nav-toggle");
    const navMenu = document.querySelector(".topnav ul");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", (event) => {
            event.preventDefault();
            navMenu.classList.toggle("active");
        });
    }

    /* ===================================================
       Página RECURSOS: asegurar que el primer PDF
       de la lista se cargue por defecto en el visor
       (siempre que exista la estructura esperada)
    ==================================================== */
    if (document.body.classList.contains("recursos-page")) {
        const firstViewButton = document.querySelector(".card-buttons button.btn-service");
        if (firstViewButton) {
            // Intenta leer el PDF desde el onclick="loadPDF('ruta')"
            const onclickAttr = firstViewButton.getAttribute("onclick");
            const match = onclickAttr && onclickAttr.match(/loadPDF\\('([^']+)'\\)/);
            if (match && match[1]) {
                loadPDF(match[1]);
            }
        }
    }
});

/* ===================================================
   Función: Cargar PDFs dinámicamente
   Uso: página "Recursos"
   - pdfPath: ruta del PDF a mostrar en el visor
   - Requiere un elemento <iframe class="pdf-viewer">
=================================================== */
function loadPDF(pdfPath) {
    const viewer = document.querySelector(".pdf-viewer");
    if (viewer) {
        viewer.src = pdfPath;
    }
}

/* ===================================================
   Función: Abrir WhatsApp en nueva pestaña
   Uso opcional (por si se llama desde botones)
=================================================== */
function openWhatsApp(number, message) {
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
}

/* ===================================================
   Espacio para futuras funciones generales
=================================================== */
// function miNuevaFuncion() {
//     // Lógica adicional
// }
