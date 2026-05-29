import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/modules/auth/context/AuthContext.js'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </TooltipProvider>
  </StrictMode>,
)
