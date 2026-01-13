import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  try {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Render Error:", error);
    container.innerHTML = `<div style="padding: 20px; color: red;">Failed to render app. Check console.</div>`;
  }
} else {
  console.error("Critical Error: Root container not found in DOM.");
}