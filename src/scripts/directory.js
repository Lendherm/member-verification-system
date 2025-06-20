// Objeto global para manejar el directorio de miembros
const DirectoryManager = {
    directoryContainer: null,
    overlay: null,
    isInitialized: false,

    // Inicializar el directorio
    init: function() {
        if (this.isInitialized) return;

        // Crear contenedor principal
        this.directoryContainer = document.createElement("div");
        this.directoryContainer.id = "directory-modal-container";
        document.body.appendChild(this.directoryContainer);

        // Crear overlay
        this.overlay = document.createElement("div");
        this.overlay.className = "directory-overlay";
        document.body.appendChild(this.overlay);

        // Contenido del directorio
        this.directoryContainer.innerHTML = `
            <div class="directory-wrapper">
                <div class="directory-header">
                    <h2 class="directory-title">Directorio de Miembros</h2>
                    <button class="directory-close-button" id="directory-close-btn">×</button>
                </div>
                <div class="directory-controls">
                    <button id="grid-view" class="view-button">Vista Cuadrícula</button>
                    <button id="list-view" class="view-button">Vista Lista</button>
                </div>
                <div id="members-container" class="members-container">
                    <!-- Los miembros se cargarán aquí -->
                </div>
            </div>
        `;

        // Configurar eventos
        this.setupEvents();
        this.isInitialized = true;
    },

    // Configurar eventos del directorio
    setupEvents: function() {
        const closeButton = this.directoryContainer.querySelector('#directory-close-btn');
        const gridViewBtn = this.directoryContainer.querySelector('#grid-view');
        const listViewBtn = this.directoryContainer.querySelector('#list-view');

        // Eventos para cerrar el directorio
        closeButton.addEventListener("click", () => this.hideDirectory());
        this.overlay.addEventListener("click", () => this.hideDirectory());

        // Eventos para cambiar vista
        gridViewBtn.addEventListener("click", () => this.displayMembersInGrid());
        listViewBtn.addEventListener("click", () => this.displayMembersInList());

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && this.directoryContainer.classList.contains("active")) {
                this.hideDirectory();
            }
        });
    },

    // Mostrar directorio
    showDirectory: function() {
        if (!this.isInitialized) this.init();
        
        this.directoryContainer.classList.add("active");
        this.overlay.classList.add("active");
        document.body.style.overflow = "hidden";
        
        // Cargar miembros si no están cargados
        if (!this.membersLoaded) {
            this.loadMembers();
        }
    },

    // Ocultar directorio
    hideDirectory: function() {
        this.directoryContainer.classList.remove("active");
        this.overlay.classList.remove("active");
        document.body.style.overflow = "";
    },

    // Cargar miembros desde JSON
    loadMembers: function() {
        fetch('./data/members.json')
            .then(response => response.json())
            .then(data => {
                this.members = data;
                this.membersLoaded = true;
                this.displayMembersInGrid();
            })
            .catch(error => {
                console.error("Error cargando miembros:", error);
            });
    },

    // Función que retorna un logo aleatorio
    getRandomLogo: function() {
        const logos = [
            "https://dummyimage.com/150x150/000/fff.png&text=Logo+1",
            "https://dummyimage.com/150x150/007bff/fff.png&text=Logo+2",
            "https://dummyimage.com/150x150/28a745/fff.png&text=Logo+3",
            "https://dummyimage.com/150x150/dc3545/fff.png&text=Logo+4"
        ];
        return logos[Math.floor(Math.random() * logos.length)];
    },

    // Mostrar miembros en cuadrícula
 // En la función displayMembersInGrid()
displayMembersInGrid: function() {
    const container = document.getElementById("members-container");
    let html = '<div class="af-memberships">'; // Usa la misma clase que el formulario
    
    this.members.forEach(member => {
        html += `
            <div class="af-card"> <!-- Usa la misma clase de card -->
                <img src="${this.getRandomLogo()}" class="member-logo" alt="${member.name}">
                <h3 class="af-card-title">${member.name}</h3> <!-- Clase igual al formulario -->
                <p class="af-card-subtitle">${member.membership_level}</p>
                
                <div class="af-benefits-list"> <!-- Lista de beneficios con mismo estilo -->
                    <p class="af-benefit-item">${member.address}</p>
                    <p class="af-benefit-item">Tel: ${member.phone}</p>
                    <p class="af-benefit-item">${member.extra_info || ''}</p>
                </div>
                
                <div class="af-buttons-container"> <!-- Contenedor de botones igual -->
                    <a href="${member.website}" target="_blank" class="af-secondary-btn">Visitar Web</a>
                    <button class="af-primary-btn">Contactar</button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
},

    // Mostrar miembros en lista
    displayMembersInList: function() {
        const container = document.getElementById("members-container");
        let html = '<div class="members-list">';
        
        this.members.forEach(member => {
            html += `
                <div class="member-item">
                    <div class="member-info">
                        <h3>${member.name}</h3>
                        <p><strong>Dirección:</strong> ${member.address}</p>
                        <p><strong>Teléfono:</strong> ${member.phone}</p>
                        <p><strong>Sitio web:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
                        <p><strong>Nivel de membresía:</strong> ${member.membership_level}</p>
                        <p>${member.extra_info || ''}</p>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function() {
    // Escuchar evento para abrir el directorio desde discover.js
    document.addEventListener('openDirectory', function() {
        DirectoryManager.showDirectory();
    });
});