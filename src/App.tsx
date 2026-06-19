import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '@/app/MainLayout.js';
import { ScrollToTop } from '@/components/ScrollToTop.js';
import AdminApp from '@/modules/admin/AdminApp.js';
import RequireAuth from '@/modules/auth/components/RequireAuth.js';
import LoginPage from '@/modules/auth/pages/LoginPage.js';
import AboutPage from '@/modules/landing/pages/AboutPage';
import JobDetailPage from '@/modules/landing/pages/JobDetailPage';
import JobsPage from '@/modules/landing/pages/JobsPage';
import LandingPage from '@/modules/landing/pages/LandingPage';
import ServicesPage from '@/modules/landing/pages/ServicesPage';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin/*"
          element={
            <RequireAuth>
              <AdminApp />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
