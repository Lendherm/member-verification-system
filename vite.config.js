import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, './src'), // Punto de entrada del proyecto
  publicDir: path.resolve(__dirname, 'public'), // Archivos estáticos

  build: {
    outDir: path.resolve(__dirname, 'dist'), // Carpeta de salida final
    emptyOutDir: true, // Limpiar dist al compilar
    rollupOptions: {
      input: {
        // Entradas múltiples para páginas individuales
        index: path.resolve(__dirname, 'src/index.html'),  // Página base (estructura principal SPA)
        home: path.resolve(__dirname, 'src/home.html'),    // Contenido dinámico para index
        login: path.resolve(__dirname, 'src/login.html'),
        register: path.resolve(__dirname, 'src/register.html')
      }
    }
  },

  server: {
    port: 5173,     // Puerto local
    open: true,     // Abrir navegador al iniciar
    strictPort: true
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // Para importar más limpio: import x from '@/scripts/x.js'
    }
  },

  css: {
    preprocessorOptions: {
      scss: {
        // Si vas a usar SCSS en el futuro
        additionalData: `@import "bootstrap-icons/font/bootstrap-icons.css";`
      }
    }
  }
});
