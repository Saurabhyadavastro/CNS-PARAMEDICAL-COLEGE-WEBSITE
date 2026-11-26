import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { EnquiryModalProvider } from './context/EnquiryModalContext';
import { EnquiryModal } from './components/common/EnquiryModal';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Courses } from './pages/Courses';
import { CourseDetail } from './pages/CourseDetail';
import { Faculty } from './pages/Faculty';
import { Gallery } from './pages/Gallery';
import { Notices } from './pages/Notices';
import { Contact } from './pages/Contact';

// Admin System Imports
import { AdminAuthProvider } from './admin/AdminAuthContext';
import { ProtectedRoute } from './admin/ProtectedRoute';
import { AdminLayout } from './admin/AdminLayout';
import { AdminLogin } from './admin/pages/AdminLogin';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { AdminStaff } from './admin/pages/AdminStaff';
import { AdminNotices } from './admin/pages/AdminNotices';
import { AdminEnquiries } from './admin/pages/AdminEnquiries';

// Automatically scroll to top on route navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

// Public Layout Wrapper
const PublicLayoutWrapper: React.FC = () => (
  <Layout>
    <Outlet />
  </Layout>
);

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AdminAuthProvider>
        <EnquiryModalProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              {/* Public Website Routes (Wrapped with Public Header & Footer) */}
              <Route element={<PublicLayoutWrapper />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/anm" element={<CourseDetail courseIdOverride="anm" />} />
                <Route path="/courses/gnm" element={<CourseDetail courseIdOverride="gnm" />} />
                <Route path="/courses/bsc-nursing" element={<CourseDetail courseIdOverride="bsc-nursing" />} />
                <Route path="/faculty" element={<Faculty />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/notices" element={<Notices />} />
                <Route path="/contact" element={<Contact />} />
              </Route>

              {/* Admin Area Authentication */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin Console Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="enquiries" element={<AdminEnquiries />} />
                <Route path="staff" element={<AdminStaff />} />
                <Route path="notices" element={<AdminNotices />} />
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<PublicLayoutWrapper />}>
                <Route path="*" element={<Home />} />
              </Route>
            </Routes>

            {/* Global Accessible Admission Enquiry Modal */}
            <EnquiryModal />
          </Router>
        </EnquiryModalProvider>
      </AdminAuthProvider>
    </ToastProvider>
  );
};

export default App;
