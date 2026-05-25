import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TooltipProvider } from '@/components/ui/tooltip'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import MainLayout from './app/MainLayout.tsx';
import LandingPage from './modules/landing/pages/LandingPage'
import ServicesPage from './modules/landing/pages/ServicesPage'
import AboutPage from './modules/landing/pages/AboutPage'
import JobsPage from './modules/landing/pages/JobsPage'
import EmployeePortalPage from './modules/portal/pages/EmployeePortalPage'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="jobs" element={<JobsPage />} />
          </Route>
          <Route path="/employee-portal" element={<EmployeePortalPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter> 
    </TooltipProvider>
  </StrictMode>,
)

