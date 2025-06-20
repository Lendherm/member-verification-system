// src/main.js

import { renderHeader } from './scripts/header.js';
import createFooter from './components/Footer.js';
import { initDiscoverPage } from './scripts/discover.js';
import { initAuth } from './scripts/auth.js';

import './styles/style.css';
import './styles/normalize.css';
import './styles/directory-modal.css';
import './styles/calendar-grafic-menu.css';
import './styles/header.css';
import './styles/auth.css';

function initApp() {
  renderHeader();
  document.getElementById('main-footer').innerHTML = createFooter();

  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const path = window.location.pathname;

  if (path.endsWith('index.html') || path === '/' || path.endsWith('/')) {
    initDiscoverPage();
  }

  if (path.includes('register.html')) {
    import('./services/register-map.js')
      .then(() => console.log('register-map.js cargado'))
      .catch(error => console.error('Error cargando mapa:', error));
  }

  initAuth();
}

document.addEventListener('DOMContentLoaded', initApp);
