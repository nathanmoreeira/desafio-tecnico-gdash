import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Usamos process.cwd() para garantir que pegamos a raiz correta do projeto
      "@": path.resolve(process.cwd(), "./src"),
    },
  },
})