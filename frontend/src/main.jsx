import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './app/globals.css';

// Centralized API URL Routing Interceptor for Production (Render)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
if (API_URL !== 'http://localhost:5000') {
  const originalFetch = window.fetch;
  window.fetch = async function (input, init) {
    if (typeof input === 'string' && input.startsWith('http://localhost:5000')) {
      input = input.replace('http://localhost:5000', API_URL);
    } else if (input instanceof URL && input.href.startsWith('http://localhost:5000')) {
      input = new URL(input.href.replace('http://localhost:5000', API_URL));
    } else if (input && typeof input === 'object' && input.url && input.url.startsWith('http://localhost:5000')) {
      const newUrl = input.url.replace('http://localhost:5000', API_URL);
      input = new Request(newUrl, input);
    }
    return originalFetch(input, init);
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
