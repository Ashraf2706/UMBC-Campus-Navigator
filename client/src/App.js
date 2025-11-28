import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/UI/Navbar';
import HomePage from './components/Home/HomePage';
import MapPage from './components/Map/MapPage';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import ProtectedRoute from './components/Admin/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes with Navbar */}
          <Route path="/" element={
            <>
              <Navbar />
              <HomePage />
            </>
          } />
          
          <Route path="/map" element={
            <>
              <Navbar />
              <MapPage />
            </>
          } />

          {/* Admin Routes (No Navbar) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;