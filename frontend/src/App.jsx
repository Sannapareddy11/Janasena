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
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <Router>
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
