import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  MeetingRoom as RoomIcon,
  CalendarToday as CalendarIcon,
  Menu as MenuIcon,
  BarChart as StatsIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

const menuItems = [
  { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { text: 'Utilisateurs', icon: <PeopleIcon />, path: '/users' },
  { text: 'Salles', icon: <RoomIcon />, path: '/admin/salles' },
  { text: 'Réservations', icon: <CalendarIcon />, path: '/admin/reservations' },
  { text: 'Statistiques', icon: <StatsIcon />, path: '/admin/stats' },
  { divider: true },
  { text: 'Paramètres', icon: <SettingsIcon />, path: '/admin/settings' },
  { text: 'Déconnexion', icon: <LogoutIcon />, path: '/logout' },
];

const AdminLayout = ({ allowedRoles }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Détecter la taille de l'écran
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem?.text || 'Tableau de bord';
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* AppBar/Header */}
      <header className="fixed top-0 left-0 right-0 bg-green-700 text-white shadow-lg z-50 h-16 sm:left-60">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center">
            <button
              onClick={handleDrawerToggle}
              className="p-2 rounded-md hover:bg-green-800 transition-colors mr-3 sm:hidden"
              aria-label="Toggle menu"
            >
              <MenuIcon />
            </button>
            <h1 className="text-xl font-semibold">
              {getCurrentPageTitle()}
            </h1>
          </div>
        </div>
      </header>

      {/* Overlay pour mobile */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleDrawerToggle}
        />
      )}

      {/* Sidebar/Drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-lg z-40 w-60 transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          sm:translate-x-0
        `}
      >
        {/* Header du drawer */}
        <div className="flex items-center justify-between h-16 px-4 bg-green-50 border-b border-green-100">
          <div className="flex items-center space-x-3">
            <div className="w-20 h-10 bg-green-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              Liqaa
            </div>
            <span className="text-lg font-semibold text-green-800">Space</span>
          </div>
          <button
            onClick={handleDrawerToggle}
            className="p-1 rounded-md hover:bg-green-100 transition-colors sm:hidden"
          >
            <CloseIcon className="text-green-700" />
          </button>
        </div>

        {/* Menu items */}
        <nav className="mt-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item, index) => {
              if (item.divider) {
                return (
                  <li key={`divider-${index}`} className="my-4">
                    <hr className="border-stone-200" />
                  </li>
                );
              }

              const isActive = location.pathname === item.path;
              return (
                <li key={item.text}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left
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
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer du sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-stone-50 border-t border-stone-200">
          <div className="text-center text-xs text-stone-500">
            <p className="font-medium">Panel Admin</p>
            <p>Version 1.0</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 transition-all duration-300 ease-in-out pt-16 sm:ml-60">
        <div className="p-6 bg-white min-h-screen">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;