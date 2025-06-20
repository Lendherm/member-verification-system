let currentIndex = 0; // Índice actual del carrusel

export function initDiscoverPage() {
  mostrarMensajeVisita();
  cargarGaleria();
  cargarCarrusel();
  ajustarDisenoPantalla();
  window.addEventListener('resize', ajustarDisenoPantalla);
}

// Mostrar mensaje sobre la última visita
function mostrarMensajeVisita() {
  const lastVisit = localStorage.getItem('lastVisit');
  const currentVisit = Date.now();
  const messageElement = document.querySelector('.visit-message');

  if (!messageElement) return;

  if (!lastVisit) {
    messageElement.textContent = "Welcome! Let us know if you have any questions.";
  } else {
    const daysBetween = Math.floor((currentVisit - lastVisit) / (1000 * 60 * 60 * 24));
    messageElement.textContent = daysBetween < 1
      ? "Back so soon! Awesome!"
      : `You last visited ${daysBetween} ${daysBetween === 1 ? 'day' : 'days'} ago.`;
  }

  localStorage.setItem('lastVisit', currentVisit);
}

// Cargar galería con imágenes
function cargarGaleria() {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  const listaPalabras = [
    "Directory", "Capacitación", "Sistema de Información", "Servicio Legal",
    "Agenda Empresarial", "Servicios Turísticos", "Comercio Internacional",
    "Revista Digital", "Clima"
  ];

  listaPalabras.forEach((palabra, index) => {
    const imgContainer = document.createElement("div");
    imgContainer.classList.add("img-container");

    const img = document.createElement("img");
    img.src = palabra === "Directory" ? "/images/directory.webp" : `https://picsum.photos/800/550?random=${index + 1}`;
    img.alt = `Imagen ${index + 1}`;

    const text = document.createElement("p");
    text.textContent = palabra;
    text.classList.add("gallery-text");

    imgContainer.appendChild(img);
    imgContainer.appendChild(text);
    gallery.appendChild(imgContainer);

    if (palabra === "Directory") {
      imgContainer.classList.add("highlighted-button", "directory-trigger");
      imgContainer.addEventListener("click", (e) => {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent('openDirectory'));
      });
    }
  });
}

// Cargar carrusel
function cargarCarrusel() {
  const carouselImages = document.getElementById("carousel-images");
  if (!carouselImages) return;

  const totalImages = 10;
  const usedIds = new Set();

  for (let i = 0; i < totalImages; i++) {
    let randomId;
    do {
      randomId = Math.floor(Math.random() * 1000);
    } while (usedIds.has(randomId));
    usedIds.add(randomId);

    const img = document.createElement("img");
    img.setAttribute("data-src", `https://picsum.photos/800/550?random=${randomId}&t=${Date.now()}`);
    img.classList.add("carousel-image", "lazy");
    img.alt = `Carrusel Imagen Aleatoria ${i + 1}`;
    carouselImages.appendChild(img);
  }

  lazyLoad();

  document.getElementById("prev")?.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      actualizarCarrusel();
    }
  });

  document.getElementById("next")?.addEventListener("click", () => {
    if (currentIndex < totalImages - 1) {
      currentIndex++;
      actualizarCarrusel();
    }
  });

  actualizarCarrusel();
}

// Actualiza posición del carrusel
function actualizarCarrusel() {
  const carouselImages = document.getElementById("carousel-images");
  const images = carouselImages.querySelectorAll(".carousel-image");
  const width = images[0]?.clientWidth || 800;
  const offset = currentIndex * width;

  carouselImages.style.transform = `translateX(-${offset}px)`;
  carouselImages.style.transition = "transform 0.5s ease-in-out";
}

// Lazy loading de imágenes
function lazyLoad() {
  const lazyImages = document.querySelectorAll(".lazy");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");

        img.onload = () => {
          console.log(`Imagen cargada: ${img.alt}`);
        };

        obs.unobserve(img);
      }
    });
  }, {
    rootMargin: "100px",
    threshold: 0.1,
  });

  lazyImages.forEach(img => observer.observe(img));
}

// Adaptar diseño según tamaño de pantalla
function ajustarDisenoPantalla() {
  const sideMenu = document.getElementById('side-menu');
  const overlay = document.getElementById('overlay');
  if (window.innerWidth > 768 && sideMenu && overlay) {
    sideMenu.classList.remove('open');
    overlay.classList.remove('active');
  }
}