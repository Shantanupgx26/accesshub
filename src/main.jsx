import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './AccessHub'  // ← change to this

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
