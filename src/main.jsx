import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Register PWA Service Worker immediately on startup
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(
    (reg) => console.log('OrderConfirm ServiceWorker active: ', reg.scope),
    (err) => console.warn('OrderConfirm ServiceWorker error: ', err)
  );
}
