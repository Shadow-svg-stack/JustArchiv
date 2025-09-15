import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
if ("serviceworker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceworker
      .register("/sw.js")
      .then(() => console.log("✅ Service Worker enregistré"))
      .catch((err) => console.error("❌ Échec enregistrement SW:", err));
  });
}
