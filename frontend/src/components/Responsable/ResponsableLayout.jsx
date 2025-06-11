import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  MeetingRoom as RoomIcon,
  CalendarToday as ReservationIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const ResponsableLayout = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Détecter la taille de l'écran
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleDrawerClose = () => {
    if (isMobile) {
      setOpen(false);
    }
  };

  const menuItems = [
    { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/responsable/dashboard' },
    { text: 'Gestion des salles', icon: <RoomIcon />, path: '/responsable/salles' },
    { text: 'Réservations', icon: <ReservationIcon />, path: '/responsable/reservations' },
  ];

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* AppBar/Header */}
      <header className="fixed top-0 left-0 right-0 bg-green-700 text-white shadow-lg z-50 h-16">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center">
            <button
              onClick={handleDrawerToggle}
              className={`p-2 rounded-md hover:bg-green-800 transition-colors mr-3 ${
                open && !isMobile ? 'hidden' : ''
              }`}
              aria-label="Toggle menu"
            >
              <MenuIcon />
            </button>
            <h1 className="text-xl font-semibold">Espace Responsable</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium hidden sm:block">
              {user?.name || 'Responsable'}
            </span>
            <button
              onClick={logout}
              className="p-2 rounded-md hover:bg-green-800 transition-colors"
              title="Déconnexion"
            >
              <LogoutIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Overlay pour mobile */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleDrawerClose}
        />
      )}

      {/* Sidebar/Drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-lg z-40 w-60 transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          ${!isMobile ? 'md:relative md:translate-x-0' : ''}
        `}
      >
        {/* Header du drawer */}
        <div className="flex items-center justify-between h-16 px-4 bg-green-50 border-b border-green-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center text-white font-bold">
              L
            </div>
            <span className="text-lg font-semibold text-green-800">LiqaaSpace</span>
          </div>
          <button
            onClick={handleDrawerClose}
            className="p-1 rounded-md hover:bg-green-100 transition-colors md:hidden"
          >
            <CloseIcon className="text-green-700" />
          </button>
        </div>

        {/* Menu items */}
        <nav className="mt-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.text}>
                  <Link
                    to={item.path}
                    onClick={handleDrawerClose}
                    className={`
                      flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-green-100 text-green-800 border-r-4 border-green-600 font-medium shadow-sm' 
                        : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                      }
                    `}
                  >
                    <span className={`text-xl ${isActive ? 'text-green-700' : 'text-stone-500'}`}>
                      {item.icon}
                    </span>
                    <span>{item.text}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main 
        className={`
          flex-1 transition-all duration-300 ease-in-out pt-16
          ${open && !isMobile ? 'md:ml-60' : 'ml-0'}
        `}
      >
        <div className="p-6 bg-white min-h-screen">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResponsableLayout;