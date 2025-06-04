// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user,loading } = useAuth();
  if (loading) {
    return <div>Chargement...</div>;
  }

  console.log("user connecté est:",user);
  if (!user) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
    return <Navigate to="/auth" replace />;
  }
  if (user.role !== 'admin' && user.role !== 'responsable' && user.role !== 'collaborateur') return <Navigate to="/unauthorized" />;


  if (!allowedRoles.includes(user.role)) {
    // Rediriger vers une page d'accès refusé si le rôle n'est pas autorisé
    return <Navigate to="*" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
