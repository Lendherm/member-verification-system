// src/routes/route.js

const routes = {
  '/login.html': '/src/login.html',
  '/register.html': '/src/register.html',
  '/index.html': '/src/home.html',
  '/': '/src/home.html'
};

export function setupRouter() {
  window.addEventListener('popstate', () => {
    loadRoute(window.location.pathname);
  });

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && link.href.startsWith(window.location.origin)) {
      e.preventDefault();
      const path = new URL(link.href).pathname;
      window.history.pushState({}, '', path);
      loadRoute(path);
    }
  });

  loadRoute(window.location.pathname);
}

async function loadRoute(path) {
  const route = routes[path] || routes['/'];

  try {
    const response = await fetch(route);
    if (!response.ok) throw new Error('Página no encontrada');

    const html = await response.text();
    const parser = new DOMParser();
    const newDoc = parser.parseFromString(html, 'text/html');

    // ⚠️ Preservar los scripts principales (como main.js)
    const currentScripts = Array.from(document.querySelectorAll('script[src]'))
      .map(script => ({ src: script.src, type: script.type }));

    // Reemplazar el body completo
    document.body.innerHTML = newDoc.body.innerHTML;

    // Volver a inyectar los scripts principales
    currentScripts.forEach(({ src, type }) => {
      const newScript = document.createElement('script');
      newScript.src = src;
      newScript.type = type || 'module';
      document.body.appendChild(newScript);
    });

    // Cargar módulos dinámicos según la ruta
    if (path.includes('register.html')) {
      import('../services/register-map.js')
        .then(() => console.log('register-map.js cargado'))
        .catch(err => console.error('Error cargando mapa:', err));
    }

    if (path === '/' || path === '/index.html') {
      import('../scripts/discover.js')
        .then(module => {
          if (typeof module.initDiscoverPage === 'function') {
            setTimeout(() => module.initDiscoverPage(), 100);
          }
        })
        .catch(err => console.error('Error cargando discover.js:', err));
    }

  } catch (error) {
    console.error('Error cargando ruta:', error);
    window.location.href = '/index.html';
  }
}
