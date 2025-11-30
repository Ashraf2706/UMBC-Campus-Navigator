import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/UI/Navbar';
import HomePage from './components/Home/HomePage';
import MapPage from './components/Map/MapPage';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import ProtectedRoute from './components/Admin/ProtectedRoute';

function App() {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setUserLocation({ lat: 39.2551, lng: -76.7130 });
        }
      );
    } else {
      setUserLocation({ lat: 39.2551, lng: -76.7130 });
    }
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Routes>
            <Route path="/" element={
              <>
                <Navbar userLocation={userLocation} />
                <HomePage />
              </>
            } />
            
            <Route path="/map" element={
              <>
                <Navbar userLocation={userLocation} />
                <MapPage userLocation={userLocation} />
              </>
            } />

            <Route path="/admin/login" element={<AdminLogin />} />
            
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;