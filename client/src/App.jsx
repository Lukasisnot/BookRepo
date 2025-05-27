import React from 'react';
import AppRoutes from './pages/AppRoutes'; // Or your specific path to AppRoutes.jsx
import './index.css'; // Ensure your global styles (Tailwind, Flowbite) are imported

// Optional: Custom Flowbite theme
const customTheme = {
  // darkThemeToggle: {}, // Example for dark mode
  // You can customize other Flowbite components here
};

function App() {
  return (
    <AppRoutes />
  );
}

export default App;