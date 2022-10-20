import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { EwokProvider } from './context/EwokContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <EwokProvider>
      <App />
    </EwokProvider>
  </React.StrictMode>
)
