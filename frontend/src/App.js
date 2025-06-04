import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import AuthPage from './components/auth/AuthPage';
import Dashboard from './pages/Home';
import AdminDashboard from './components/Admin/Dashboard';
import AdminLayout from './components/Admin/AdminLayout';
import UserManagement from './components/Admin/UserManagement';
import ResponsableLayout from './components/Responsable/ResponsableLayout';
import ResponsableDashboard from './components/Responsable/Dashboard';
import SallesManagement from './components/Responsable/sallesManagement';
import ReservationsManagement from './components/Responsable/ReservationsManagement';
import CollaborateurDashboard from './components/Collaborateur/Dashboard';
import Salles from './pages/Salles';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={<AuthPage />} />
            {/* Dashboard */}
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={<AdminLayout />}
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              {/* Add more admin routes as needed */}
            </Route>

            {/* Protected Responsable Routes */}
            <Route 
              path="/responsable" 
              element={<ResponsableLayout />}
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<ResponsableDashboard />} />
              <Route path="salles" element={<SallesManagement />} />
              <Route path="reservations" element={<ReservationsManagement />} />
            </Route>

            {/* Protected Collaborateur Routes */}
            <Route 
              path="/collaborateur" 
              element={<Layout>
                    <CollaborateurDashboard />
                  </Layout>
              } 
            />

            {/* Public Routes */}
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/salles" element={<Layout><Salles /></Layout>} />
            
            {/* 404 Not Found */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;