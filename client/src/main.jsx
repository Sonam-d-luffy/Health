import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import { CurrentUserProvider } from './Context/CurrentUserContext.jsx'

createRoot(document.getElementById('root')).render(
  <CurrentUserProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </CurrentUserProvider>
)
