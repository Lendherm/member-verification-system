// src/scripts/header.js
import createHeader from '../components/Header.js';
import { initCalendarAndChart } from './calendar-grafic-menu.js';
import { initWeather } from './weather.js';

export function renderHeader() {
  const mainHeader = document.getElementById('main-header');
  if (!mainHeader) {
    console.error('Elemento #main-header no encontrado');
    return;
  }

  // Insertar header
  mainHeader.innerHTML = createHeader();

  // Crear menú lateral y overlay
  createSideMenu();

  // Inicializar menú lateral y botones de autenticación
  initMenu();
  initAuthButtons();
}

// Función para construir el menú lateral y overlay
function createSideMenu() {
  if (document.getElementById('side-menu')) return;

  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.id = 'overlay';
  document.body.appendChild(overlay);

  const sideMenu = document.createElement('div');
  sideMenu.className = 'side-menu';
  sideMenu.id = 'side-menu';
  sideMenu.innerHTML = getSideMenuContent();
  document.body.appendChild(sideMenu);
}

// Contenido del menú lateral
function getSideMenuContent() {
  return `
    <nav>
      <h2>Menú Principal</h2>
      <ul>
        <li><a href="index.html"><i class="bi bi-arrow-right"></i> Inicio</a></li>
        <li><a href="#"><i class="bi bi-arrow-right"></i> Servicios</a></li>
        <li><a href="#"><i class="bi bi-arrow-right"></i> Representatividad</a></li>
        <li><a href="#"><i class="bi bi-arrow-right"></i> Eventos</a></li>
        <li><a href="#"><i class="bi bi-arrow-right"></i> ¿Quiénes Somos?</a></li>
        <li><a href="#"><i class="bi bi-arrow-right"></i> Directorio de Consejo</a></li>
        <li><a href="#"><i class="bi bi-arrow-right"></i> Prensa</a></li>
        <li><a href="#"><i class="bi bi-arrow-right"></i> Blog</a></li>
        <li><a href="#"><i class="bi bi-arrow-right"></i> Contacto</a></li>
      </ul>

      <div class="contact-info">
        <p><i class="bi bi-geo-alt"></i> Paseo de la Reforma 42 Colonia Centro, Alcaldía Cuauhtémoc, C.P. 06040, Ciudad de México. |
          <a href="#" style="color: white; text-decoration: underline;">¿Cómo llegar?</a>
        </p>
        <p><i class="bi bi-envelope"></i> primercontacto@ccmexico.com.mx</p>
        <p><i class="bi bi-whatsapp"></i> +52 55 7196 6356</p>
        <p><i class="bi bi-telephone"></i> 55 36-85-22-69</p>
      </div>

      <div class="sidebar-content">
        <h3>Información Importante</h3>
        <p class="visit-message"></p>

        <h4>Datos Estadísticos</h4>
        <p>Visita nuestro calendario de eventos para más información.</p>

        <h4>Calendario</h4>
        <div id="custom-calendar" class="custom-calendar"></div>

        <h4>Estadísticas</h4>
        <div class="statistics">
          <p><strong>Total de Eventos:</strong> 25</p>
          <p><strong>Miembros Registrados:</strong> 500</p>
          <p><strong>Visitas Mensuales:</strong> 1,200</p>
        </div>

        <h4>Gráfica Estadística</h4>
        <div id="custom-chart" class="custom-chart">
          <div class="chart-title">Estadísticas de la Cámara</div>
          <div class="chart-container" id="chart-container"></div>
        </div>

        <h4>Weather Information</h4>
        <p id="location">Loading location...</p>
        <p id="temperature">Loading temperature...</p>
        <p id="weather-description">Loading weather description...</p>
        <figure>
          <img id="weather-icon" src="#" alt="Weather Icon">
          <figcaption id="weather-caption"></figcaption>
        </figure>
      </div>

      <ul class="social-icons">
        <li><a href="#" class="bi bi-facebook"></a></li>
        <li><a href="#" class="bi bi-instagram"></a></li>
        <li><a href="#" class="bi bi-twitter"></a></li>
        <li><a href="#" class="bi bi-youtube"></a></li>
        <li><a href="#" class="bi bi-linkedin"></a></li>
      </ul>
    </nav>
  `;
}

// Función para inicializar comportamiento del menú
export function initMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const sideMenu = document.getElementById('side-menu');
  const overlay = document.getElementById('overlay');

  if (!menuToggle || !sideMenu || !overlay) {
    console.error('Elementos del menú no encontrados');
    return;
  }

  menuToggle.addEventListener('click', () => {
    const menuIsOpening = !sideMenu.classList.contains('open');

    sideMenu.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.style.overflow = sideMenu.classList.contains('open') ? 'hidden' : '';

    if (menuIsOpening) {
      setTimeout(() => {
        try {
          if (typeof initCalendarAndChart === 'function') initCalendarAndChart();
          if (typeof initWeather === 'function') initWeather();
        } catch (error) {
          console.error('Error inicializando componentes:', error);
        }
      }, 300);
    }
  });

  overlay.addEventListener('click', () => {
    sideMenu.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  });

  document.querySelectorAll('.side-menu a').forEach(link => {
    link.addEventListener('click', () => {
      sideMenu.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sideMenu.classList.contains('open')) {
      sideMenu.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Nueva función para inicializar botones de autenticación
function initAuthButtons() {
  const logoutButtons = document.querySelectorAll('.logout-button');
  if (logoutButtons.length > 0) {
    import('./auth.js')
      .then(module => {
        module.initLogout();
      })
      .catch(error => {
        console.error('Error cargando módulo de autenticación:', error);
      });
  }
}
