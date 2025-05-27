const flowbiteReact = require("flowbite-react/plugin/tailwindcss");

// tailwind.config.js (should be CommonJS by default from init)
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // For Flowbite React components
    "node_modules/flowbite-react/lib/esm/**/*.js",
    ".flowbite-react\\class-list.json"
  ],
  theme: {
    extend: {},
  },
  plugins: [// Flowbite plugin for v3
  require('flowbite/plugin'), flowbiteReact],
};