import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '@/app/AdminLayout.js';
import MainLayout from '@/app/MainLayout.js';
import { ScrollToTop } from '@/components/ScrollToTop.js';
import { PermissionRoute } from '@/modules/admin/components/PermissionRoute.js';
import RequireAuth from '@/modules/auth/components/RequireAuth.js';
import LoginPage from '@/modules/auth/pages/LoginPage.js';
import { CmsPage } from '@/modules/cms/CmsAdminPage.js';
import AboutPage from '@/modules/landing/pages/AboutPage';
import JobDetailPage from '@/modules/landing/pages/JobDetailPage';
import JobsPage from '@/modules/landing/pages/JobsPage';
import LandingPage from '@/modules/landing/pages/LandingPage';
import PrivacyPage from '@/modules/landing/pages/PrivacyPage.js';
import ServicesPage from '@/modules/landing/pages/ServicesPage';
import TermsPage from '@/modules/landing/pages/TermsPage.js';

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
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="cms" replace />} />
          <Route
            path="cms"
            element={
              <PermissionRoute permission="content_blocks.read">
                <CmsPage />
              </PermissionRoute>
            }
          />
          <Route path="*" element={<div className="p-8">Sección no encontrada</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
