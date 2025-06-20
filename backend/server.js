const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Configuración de middlewares
app.use(cors());
app.use(bodyParser.json());

// CORS headers para desarrollo
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Ruta del archivo donde se almacenan los usuarios
const USERS_FILE = path.join(__dirname, 'users.json');

// Crear archivo si no existe
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, '[]', 'utf8');
}

// API: Registro
app.post('/api/register', (req, res) => {
  const newUser = req.body;

  fs.readFile(USERS_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading users file' });
    }

    const users = JSON.parse(data);

    // Verificar si ya existe ese email
    if (users.some(user => user.email === newUser.email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    users.push(newUser);

    fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error saving user' });
      }

      res.json({ message: 'User registered successfully' });
    });
  });
});

// API: Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  fs.readFile(USERS_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading users file' });
    }

    const users = JSON.parse(data);
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      user: {
        name: user.name,
        email: user.email
      }
    });
  });
});

// Servir archivos estáticos desde /dist (SPA en producción)
app.use(express.static(path.join(__dirname, '../dist')));

// SPA: devolver index.html para cualquier ruta desconocida
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`✅ Backend escuchando en: http://localhost:${port}`);
});
