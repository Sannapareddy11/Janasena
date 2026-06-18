import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PageLayout from './layouts/PageLayout';
import Home from './pages/Home';
import NewsDetails from './pages/NewsDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AddEditNews from './pages/AddEditNews';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Contact from './pages/Contact';
import DataDeletionRequest from './pages/DataDeletionRequest';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PageLayout>
              <Home />
            </PageLayout>
          }
        />
        <Route
          path="/news/:slug"
          element={
            <PageLayout>
              <NewsDetails />
            </PageLayout>
          }
        />
        <Route
          path="/login"
          element={
            <PageLayout>
              <Login />
            </PageLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <PageLayout>
              <Signup />
            </PageLayout>
          }
        />
        <Route
          path="/admin/login"
          element={
            <PageLayout>
              <AdminLogin />
            </PageLayout>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <PageLayout>
              <PrivacyPolicy />
            </PageLayout>
          }
        />
        <Route
          path="/terms"
          element={
            <PageLayout>
              <TermsAndConditions />
            </PageLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PageLayout>
              <Contact />
            </PageLayout>
          }
        />
        <Route
          path="/delete-account"
          element={
            <PageLayout>
              <DataDeletionRequest />
            </PageLayout>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <PageLayout>
                <AdminDashboard />
              </PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/news/new"
          element={
            <ProtectedRoute>
              <PageLayout>
                <AddEditNews />
              </PageLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/news/edit/:id"
          element={
            <ProtectedRoute>
              <PageLayout>
                <AddEditNews />
              </PageLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
