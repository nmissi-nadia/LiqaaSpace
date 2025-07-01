import React, { useState } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { Layout, Menu, Avatar, Dropdown, Badge } from "antd"
import {
  HomeOutlined,
  CalendarOutlined,
  TeamOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
  BellOutlined,
  MessageOutlined,
} from "@ant-design/icons"
import { Logo } from "../common/logo"

const { Header, Sider, Content } = Layout

const ResponsableLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  const getSelectedKey = () => {
    const path = location.pathname
    if (path.includes("dashboard")) return "1"
    if (path.includes("reservations")) return "2"
    if (path.includes("Msalles")) return "3"
    if (path.includes("disponibilite")) return "4"
    if (path.includes("chat")) return "5"
    return "1"
  }

  const getPageTitle = () => {
    const key = getSelectedKey()
    switch (key) {
      case "1":
        return "Tableau de bord"
      case "2":
        return "Gestion des réservations"
      case "3":
        return "Gestion des salles"
      case "4":
        return "Disponibilité"
      case "5":
        return "Chat"
      default:
        return "Tableau de bord"
    }
  }

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Mon Profil",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Disponibilité",
      onClick: () => navigate("/responsable/disponibilite"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Déconnexion",
      onClick: () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/auth"
      },
    },
  ]
  const [notifOpen, setNotifOpen] = useState(false);
  return (
    <Layout className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="bg-white/95 backdrop-blur-sm border-r border-emerald-200 shadow-xl shadow-emerald-500/10"
        style={{
          boxShadow: "4px 0 24px rgba(16, 185, 129, 0.1)",
        }}
      >
        <Logo collapsed={collapsed} />

        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          className="bg-transparent border-none px-2"
          items={[
            {
              key: "1",
              icon: <HomeOutlined className="text-emerald-600" />,
              label: (
                <Link
                  to="/responsable"
                  className="text-slate-700 font-medium hover:text-emerald-600 transition-all duration-200"
                >
                  Tableau de bord
                </Link>
              ),
              className: "mb-2 rounded-lg hover:bg-emerald-50",
            },
            {
              key: "2",
              icon: <CalendarOutlined className="text-emerald-600" />,
              label: (
                <Link
                  to="/responsable/reservations"
                  className="text-slate-700 font-medium hover:text-emerald-600 transition-all duration-200"
                >
                  Gestion des réservations
                </Link>
              ),
              className: "mb-2 rounded-lg hover:bg-emerald-50",
            },
            {
              key: "3",
              icon: <TeamOutlined className="text-emerald-600" />,
              label: (
                <Link
                  to="/responsable/Msalles"
                  className="text-slate-700 font-medium hover:text-emerald-600 transition-all duration-200"
                >
                  Gestion des salles
                </Link>
              ),
              className: "mb-2 rounded-lg hover:bg-emerald-50",
            },
            {
              key: "4",
              icon: <SettingOutlined className="text-emerald-600" />,
              label: (
                <Link
                    to="/responsable/disponibilite"
                  className="text-slate-700 font-medium hover:text-emerald-600 transition-all duration-200"
                >
                  Disponibilité
                </Link>
              ),
              className: "mb-2 rounded-lg hover:bg-emerald-50",
            },
            {
              key: "5",
              icon: <MessageOutlined className="text-emerald-600" />,
              label: (
                <Link
                  to="/responsable/chat"
                  className="text-slate-700 font-medium hover:text-emerald-600 transition-all duration-200"
                >
                  Chat
                </Link>
              ),
              className: "mb-2 rounded-lg hover:bg-emerald-50",
            },
          ]}
          theme="light"
        />

        {/* Responsable section at bottom */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-3 border border-emerald-200">
            <div className="flex items-center space-x-3">
              <Avatar size={32} className="bg-emerald-500 flex-shrink-0">
                <UserOutlined />
              </Avatar>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">Responsable</p>
                  <p className="text-xs text-slate-500 truncate">Gestion avancée</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Sider>

      <Layout className="bg-transparent">
        <Header className="px-6 bg-white/80 backdrop-blur-sm border-b border-emerald-200 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className:
                "text-emerald-600 text-lg cursor-pointer p-2 rounded-lg hover:bg-emerald-50 transition-all duration-200",
              onClick: toggleCollapsed,
            })}
            <div>
              <h1 className="text-slate-800 font-bold text-xl">{getPageTitle()}</h1>
              <p className="text-slate-500 text-sm">Espace Responsable</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge count={7} size="small">
              <BellOutlined className="text-slate-600 text-lg cursor-pointer hover:text-emerald-600 transition-colors" />
            </Badge>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-emerald-50 rounded-lg px-3 py-2 transition-all duration-200">
                <Avatar size={32} className="bg-emerald-500">
                  <UserOutlined />
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-700">Responsable</p>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="m-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-emerald-500/5 border border-emerald-100 p-6 min-h-[calc(100vh-8rem)]">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default ResponsableLayout