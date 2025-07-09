import {React, useEffect} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/auth/AuthPage';
import Dashboard from './pages/Home';
import AdminDashboard from './components/Admin/Dashboard';
import AdminLayout from './components/Admin/AdminLayout';
import UserManagement from './components/Admin/UserManagement';
import ResponsableLayout from './components/Responsable/ResponsableLayout';
import ResponsableDashboard from './components/Responsable/Dashboard';
import SallesManagement from './components/Responsable/sallesManagement';
import SalleManagement from './components/Admin/SalleManagement';
import ReservationsManagement from './components/Responsable/ReservationsManagement';
import CollaborateurDashboard from './components/Collaborateur/CollaborateurDashboard';
import NotFound from './pages/NotFound';
import CollaborateurLayout from './components/Collaborateur/CollaborateurLayout';
import MesReservations from './components/Collaborateur/mesreservation';
import SallesDisponibles from './components/Collaborateur/sallesdispo';
import DetailsSalle from './components/Collaborateur/detailsSalle';
import DetailSalle from './components/Admin/details_salles';
import ReservationAdmin from './components/Admin/reservationAdmin';
import DisponibiliteManagement from './components/Responsable/DisponibiliteManagement';
import NotificationSidebar from './pages/NotificationSidebar';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import Chat from './pages/chat';
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
  useEffect(() => {
    console.log('Pusher Key:', process.env.REACT_APP_PUSHER_APP_KEY); // Ajoutez cette ligne
    
    window.Pusher = require('pusher-js');
    window.Echo = new Echo({
        broadcaster: 'pusher',
        key: process.env.REACT_APP_PUSHER_APP_KEY, 
        // Utilisez la variable d'environnement
        cluster: 'ap3',
        wsHost: process.env.REACT_APP_PUSHER_HOST || window.location.hostname,
        wsPort: process.env.REACT_APP_PUSHER_PORT || 6001,
        forceTLS: false,
        disableStats: true,
        enabledTransports: ['ws', 'wss'],
        authEndpoint: process.env.REACT_APP_API_URL + `/broadcasting/auth`,
        auth: {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                'Accept': 'application/json',
            }
        }
    });
  
    return () => {
      if (window.Echo) {
        window.Echo.disconnect();
      }
    };
  }, []);
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
              path="/admin" 
              element={<AdminLayout />}
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="salles" element={<SalleManagement />} />
              <Route path="salles/:id" element={<DetailSalle />} />
              <Route path="reservations" element={<ReservationAdmin />} />
              <Route path="chat" element={<Chat />} />
            </Route>

            {/* Protected Responsable Routes */}
            <Route 
              path="/responsable" 
              element={<ResponsableLayout />}
            >
              <Route index element={<ResponsableDashboard />} />
              <Route path="Msalles" element={<SallesManagement />} />
              <Route path="reservations" element={<ReservationsManagement />} />
              <Route path="disponibilite" element={<DisponibiliteManagement />} />
              <Route path="chat" element={<Chat />} />
            </Route>

            {/* Protected Collaborateur Routes */}
            <Route path="/collaborateur" element={<CollaborateurLayout />}>
              <Route index element={<CollaborateurDashboard />} />
              <Route path="mesreservations" element={<MesReservations />} />
              <Route path="sallesdisponibles" element={<SallesDisponibles />} />
              <Route path="detailsSalle/:id" element={<DetailsSalle />} />
              <Route path="chat" element={<Chat />} />
            </Route>

          
            
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;