import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/app/MainLayout.js';
import LandingPage from '@/modules/landing/pages/LandingPage';
import AboutPage from '@/modules/landing/pages/AboutPage';
import ServicesPage from '@/modules/landing/pages/ServicesPage';
import RequireAuth from '@/modules/auth/components/RequireAuth.js';
import AdminApp from '@/modules/admin/AdminApp.js';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public site routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/jobs" element={<div className="pt-20 text-center">Trabaja con nosotros</div>} />
        </Route>

        {/* Protected admin panel — shows login inline if unauthenticated */}
        <Route
          path="/admin-dashboard"
          element={
            <RequireAuth>
              <AdminApp />
            </RequireAuth>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
