import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import CollaborateurDashboard from './components/Collaborateur/CollaborateurDashboard';
import Salles from './pages/Salles';
import NotFound from './pages/NotFound';
import CollaborateurLayout from './components/Collaborateur/CollaborateurLayout';
import MesReservations from './components/Collaborateur/mesreservation';
import SallesDisponibles from './components/Collaborateur/sallesdispo';

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
          <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={<AuthPage />} />
            {/* Dashboard */}
            <Route path="/" element={<Dashboard />} />
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={<AdminLayout />}
            >
              <Route index element={<AdminDashboard />} />
              <Route 
                path="admin/users" 
                element={<UserManagement />} 
              />
              {/* Add more admin routes as needed */}
            </Route>

            {/* Protected Responsable Routes */}
            <Route 
              path="/responsable/dashboard" 
              element={<ResponsableLayout />}
            >
              <Route index element={<ResponsableDashboard />} />
              <Route path="salles" element={<SallesManagement />} />
              <Route path="reservations" element={<ReservationsManagement />} />
            </Route>

            {/* Protected Collaborateur Routes */}
            <Route path="/collaborateur" element={<CollaborateurLayout />}>
              <Route index element={<CollaborateurDashboard />} />
              <Route path="mesreservations" element={<MesReservations />} />
              <Route path="sallesdisponibles" element={<SallesDisponibles />} />
            </Route>

            {/* Public Routes */}
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/salles" element={<Layout><Salles /></Layout>} />
            
            {/* 404 Not Found */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;