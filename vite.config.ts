import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') }
  },
  server: {
    port: 5176,
    proxy: {
      // всё, что начинается с /auth, уходит на реальный бэкенд
      '/auth': {
        target: 'http://rest-test.machineheads.ru',
        changeOrigin: true,
      },
      '/profile': {
        target: 'http://rest-test.machineheads.ru',
        changeOrigin: true,
      },
      '/manage': {
        target: 'http://rest-test.machineheads.ru',
        changeOrigin: true,
      },
    },
  },
});
