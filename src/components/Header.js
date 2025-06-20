export default function createHeader() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
  
  return `
    <header class="site-header">
      <div class="container">
        <div class="menu-icon" id="menu-toggle">
          <span class="menu-icon-symbol">&#9776;</span>
          <span class="menu-icon-text">Menú</span>
        </div>
        <div class="anniversary">
          <div class="anniversary-title">Cumplimos</div>
          <div class="anniversary-year">150 años</div>
          <div class="anniversary-text">de unir, servir y representar</div>
        </div>
        <div class="logo">
          <img src="/images/lanetalogo.webp" alt="Logo Cámara de Comercio">
        </div>
        <div class="auth-buttons">
          ${currentUser ? `
            <span class="welcome">¡Hola, ${currentUser.name}!</span>
            <a href="#" class="auth-button logout-button">Cerrar sesión</a>
          ` : `
            <a href="/register.html" class="auth-button register-button">Registrarse</a>
            <a href="/login.html" class="auth-button login-button">Iniciar sesión</a>
          `}
        </div>
      </div>
    </header>
  `;
}