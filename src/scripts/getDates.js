// getDates.js
// Esperar a que el DOM se haya cargado completamente
document.addEventListener("DOMContentLoaded", function() {
    // Obtener el año actual y mostrarlo en el pie de página
    const currentYear = new Date().getFullYear();
    document.getElementById("currentYear").textContent = currentYear;

    // Obtener la fecha de la última modificación y mostrarla en el pie de página
    const lastModifiedDate = document.lastModified;
    document.getElementById("lastModified").textContent = `Last modification: ${lastModifiedDate}`;

    // Mostrar u ocultar el menú al hacer clic en el botón hamburguesa
    document.getElementById("menu-toggle").addEventListener("click", function() {
        const nav = document.querySelector('nav ul');
        nav.classList.toggle("show");  // Alternar la clase 'show' que muestra el menú
    });
});
