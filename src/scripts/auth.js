// Usar ruta relativa en producción
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api' 
  : '/api';

export function initAuth() {
  // Formulario de registro
  const registerForm = document.getElementById('registration-form');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }

  // Formulario de login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Inicializar logout si existe el botón
  initLogout();
}

function handleRegister(e) {
  e.preventDefault();

  const user = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('address').value,
    password: document.getElementById('password').value,
    latitude: document.getElementById('latitude').value,
    longitude: document.getElementById('longitude').value,
    createdAt: new Date().toISOString(),
    verified: false
  };

  // Validación de contraseñas
  if (user.password !== document.getElementById('confirm-password').value) {
    showAlert('Las contraseñas no coinciden', 'error');
    return;
  }

  if (user.password.length < 6) {
    showAlert('La contraseña debe tener al menos 6 caracteres', 'error');
    return;
  }

  // Validación de coordenadas
  if (!user.latitude || !user.longitude) {
    showAlert('Por favor, selecciona tu ubicación exacta en el mapa', 'error');
    return;
  }

  // Enviar datos al servidor
  fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => { throw new Error(err.error); });
    }
    return response.json();
  })
  .then(data => {
    showAlert('Registro exitoso. Serás redirigido al login.', 'success');
    setTimeout(() => {
      window.location.href = '/views/auth/login.html'; // ✅ Ruta corregida
    }, 2000);
  })
  .catch(error => {
    console.error('Error:', error);
    showAlert(error.message || 'Error al registrar. Inténtalo de nuevo.', 'error');
  });
}

function handleLogin(e) {
  e.preventDefault();

  const credentials = {
    email: document.getElementById('login-email').value,
    password: document.getElementById('login-password').value
  };

  fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => { throw new Error(err.error); });
    }
    return response.json();
  })
  .then(data => {
    // Guardar sesión
    localStorage.setItem('currentUser', JSON.stringify({
      ...data.user,
      loggedIn: true
    }));

    showAlert('Inicio de sesión exitoso', 'success');
    setTimeout(() => {
      window.location.href = '/index.html'; // ✅ Ruta corregida
    }, 1500);
  })
  .catch(error => {
    console.error('Error:', error);
    showAlert(error.message || 'Error al iniciar sesión. Inténtalo de nuevo.', 'error');
  });
}

// Función para mostrar alertas
function showAlert(message, type) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `auth-alert ${type}`;
  alertDiv.textContent = message;

  const authCard = document.querySelector('.auth-card');
  if (authCard) {
    authCard.prepend(alertDiv);

    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }
}

// Función para cerrar sesión
export function initLogout() {
  const logoutButtons = document.querySelectorAll('.logout-button');

  logoutButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('currentUser');
      window.location.href = '/index.html'; // ✅ Ruta corregida
    });
  });
}
