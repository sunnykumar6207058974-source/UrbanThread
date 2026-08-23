import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'   // Fix #7 — React Router foundation
import ErrorBoundary from './components/ErrorBoundary' // Fix #5 — Error Boundary
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Fix #5: ErrorBoundary catches render crashes and shows a fallback UI */}
    <ErrorBoundary>
      {/* Fix #7: BrowserRouter provides routing context for future page additions */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
