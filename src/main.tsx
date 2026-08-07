import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initTheme } from './utils/theme';
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

initTheme();

const updateSW = registerSW({
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return;
    setInterval(() => void registration.update(), 60 * 60 * 1000);
  },
  onNeedRefresh() {
    if (window.confirm('Versi baru Salve tersedia. Muat ulang sekarang?')) {
      void updateSW(true);
    }
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
