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
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const CollaborateurLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // Déterminer l'élément de menu sélectionné en fonction de l'URL
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('mes-reservations')) return '2';
    return '1'; // Par défaut, sélectionner l'accueil
  };

  return (
    <Layout className="min-h-screen">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={250}
        className="site-layout-background"
      >
        <div className="p-4 text-center text-white h-16 flex items-center justify-center text-lg font-bold">
          {!collapsed ? 'Espace Collaborateur' : 'EC'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[getSelectedKey()]}
          selectedKeys={[getSelectedKey()]}
          items={[
            {
              key: '1',
              icon: <HomeOutlined />,
              label: <Link to="/collaborateur">Accueil</Link>,
            },
            {
              key: '2',
              icon: <CalendarOutlined />,
              label: <Link to="/collaborateur/mes-reservations">Mes Réservations</Link>,
            },
            {
              key: '3',
              icon: <TeamOutlined />,
              label: <Link to="/collaborateur/salles">Salles Disponibles</Link>,
            },
            {
              key: '4',
              icon: <LogoutOutlined />,
              label: 'Déconnexion',
              onClick: () => {
                // Logique de déconnexion
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                console.log('Déconnexion');
              },
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background p-0 bg-white flex items-center pl-4 shadow-sm sticky top-0 z-10">
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger text-lg cursor-pointer',
            onClick: toggleCollapsed,
          })}
          <h1 className="mx-4 my-0 text-lg font-medium">
            {getSelectedKey() === '1' && 'Tableau de bord'}
            {getSelectedKey() === '2' && 'Mes Réservations'}
            {getSelectedKey() === '3' && 'Salles Disponibles'}
          </h1>
        </Header>
        <Content className="m-6 p-6 min-h-70 bg-white rounded-lg">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default CollaborateurLayout;