import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css'; // Usando o CSS que já criamos
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);