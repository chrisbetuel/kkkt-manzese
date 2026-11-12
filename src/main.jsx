import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ContentProvider } from './content.jsx'
import { AuthProvider, LangProvider, ThemeProvider } from './lib/prefs.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LangProvider>
        <ThemeProvider>
          <AuthProvider>
            <ContentProvider>
              <App />
            </ContentProvider>
          </AuthProvider>
        </ThemeProvider>
      </LangProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

// PWA: service worker (production pekee) — huhifadhi maudhui ya umma tu, si taarifa za akaunti
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
