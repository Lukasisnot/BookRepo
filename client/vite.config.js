// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import flowbiteReact from "flowbite-react/plugin/vite";

// No Tailwind-specific import here for v3

export default defineConfig({
  plugins: [// No tailwindcss() plugin here for v3
  react(), flowbiteReact()],
});