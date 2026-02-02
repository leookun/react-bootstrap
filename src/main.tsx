import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './style/tailwind.css'

const rootElement = document.querySelector('#root')!

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
