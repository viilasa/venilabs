import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ContactDialogProvider } from './context/ContactDialogContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ContactDialogProvider>
          <App />
        </ContactDialogProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
