import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initTheme } from './utils/theme';
import './index.css'
import App from './App.tsx'

initTheme();

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    // gagal daftar SW tidak boleh menjatuhkan app
    navigator.serviceWorker.register('/sw.js').catch(() => { });
  });
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
