import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  CalendarOutlined,
  TeamOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserSwitchOutlined,
  DashboardOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const ResponsableLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return '1';
    if (path.includes('reservations')) return '2';
    if (path.includes('Msalles')) return '3';
    if (path.includes('parametres')) return '4';
    return '1';
  };

  return (
    <Layout className="min-h-screen bg-white">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="bg-white border-r-2 border-green-500 shadow-lg"
      >
        <div className="h-16 m-4 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-green-500/30">
          <span className={collapsed ? 'text-sm' : 'text-base'}>
            {!collapsed ? 'Liqaa' : 'LS'}
          </span>
          <span className="text-white font-bold text-lg">Space</span>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          className="bg-transparent border-none"
          items={[
            {
              key: '1',
              icon: <HomeOutlined className="text-green-600" />,
              label: (
                <Link 
                  to="/responsable" 
                  className="text-gray-700 font-medium hover:text-green-600 transition-colors"
                >
                  Tableau de bord
                </Link>
              ),
            },
            {
              key: '2',
              icon: <CalendarOutlined className="text-green-600" />,
              label: (
                <Link 
                  to="/responsable/reservations" 
                  className="text-gray-700 font-medium hover:text-green-600 transition-colors"
                >
                  Gestion des réservations
                </Link>
              ),
            },
            {
              key: '3',
              icon: <TeamOutlined className="text-green-600" />,
              label: (
                <Link 
                  to="/responsable/Msalles" 
                  className="text-gray-700 font-medium hover:text-green-600 transition-colors"
                >
                  Gestion des salles
                </Link>
              ),
            },
            {
              key: '4',
              icon: <SettingOutlined className="text-green-600" />,
              label: (
                <Link 
                  to="/responsable/parametres" 
                  className="text-gray-700 font-medium hover:text-green-600 transition-colors"
                >
                  Paramètres
                </Link>
              ),
            },
            {
              key: '5',
              icon: <LogoutOutlined className="text-red-600" />,
              label: (
                <span 
                  className="text-red-600 font-medium hover:text-red-700 transition-colors cursor-pointer"
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/auth';
                  }}
                >
                  Déconnexion
                </span>
              ),
            },
          ]}
          theme="light"
        />
      </Sider>


      <Layout className="bg-white">
        <Header className="px-6 bg-gradient-to-r from-white to-green-50 border-b-2 border-green-500 flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'text-green-600 text-lg cursor-pointer p-2 rounded hover:bg-green-50 transition-all duration-300',
              onClick: toggleCollapsed,
            })}
            <h2 className="ml-4 text-gray-700 font-semibold text-xl">
              {getSelectedKey() === '1' && 'Tableau de bord'}
              {getSelectedKey() === '2' && 'Gestion des réservations'}
              {getSelectedKey() === '3' && 'Gestion des salles'}
              {getSelectedKey() === '4' && 'Paramètres'}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Responsable
            </span>
          </div>
        </Header>

        <Content className="m-6 p-6 bg-white rounded-xl shadow-sm border border-green-100 min-h-[calc(100vh-7rem)]">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ResponsableLayout;