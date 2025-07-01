import React, { useState, useEffect } from "react"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { Layout, Menu, Avatar, Dropdown, Badge, Button } from "antd"
import {
  DashboardOutlined,
  TeamOutlined,
  HomeOutlined,
  CalendarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  BellOutlined,
  LogoutOutlined,
  CloseOutlined,
  MessageOutlined,
} from "@ant-design/icons"
import { Logo } from "../common/logo"
import NotificationSidebar from "../../pages/NotificationSidebar";
const { Header, Sider, Content } = Layout

const menuItems = [
  { key: "1", text: "Tableau de bord", icon: <DashboardOutlined />, path: "/admin" },
  { key: "2", text: "Utilisateurs", icon: <TeamOutlined />, path: "/admin/users" },
  { key: "3", text: "Salles", icon: <HomeOutlined />, path: "/admin/salles" },
  { key: "4", text: "Réservations", icon: <CalendarOutlined />, path: "/admin/reservations" },
  { key: "5", text: "Chat", icon: <MessageOutlined />, path: "/admin/chat" },
]

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setMobileOpen(false)
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const toggleCollapsed = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen)
    } else {
      setCollapsed(!collapsed)
    }
  }

  const getSelectedKey = () => {
    const currentItem = menuItems.find((item) => item.path === location.pathname)
    if (currentItem?.path.includes("chat")) return "5"
    return currentItem?.key || "1"
  }

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find((item) => item.path === location.pathname)
      return currentItem?.text || "Tableau de bord"
  }

  const handleNavigation = (path) => {
    navigate(path)
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Mon Profil",
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
        navigate("/auth")
      },
    },
  ]
  const [notifOpen, setNotifOpen] = useState(false);
  return (
    <Layout className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Mobile Overlay */}
      {isMobile && mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <Sider
        trigger={null}
        collapsible
        collapsed={isMobile ? false : collapsed}
        className={`
          bg-white/95 backdrop-blur-sm border-r border-emerald-200 shadow-xl shadow-emerald-500/10
          ${isMobile ? "fixed z-50 h-full" : ""}
          ${isMobile && !mobileOpen ? "hidden" : ""}
        `}
        style={{
          boxShadow: "4px 0 24px rgba(16, 185, 129, 0.1)",
        }}
        width={isMobile ? 280 : undefined}
      >
        <div className="flex items-center justify-between p-4">
          <Logo collapsed={!isMobile && collapsed} />
          {isMobile && (
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setMobileOpen(false)}
              className="text-slate-600 hover:text-emerald-600"
            />
          )}
        </div>

        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          className="bg-transparent border-none px-2"
          items={menuItems.map((item) => ({
            key: item.key,
            icon: <span className="text-emerald-600">{item.icon}</span>,
            label: (
              <span
                onClick={() => handleNavigation(item.path)}
                className="text-slate-700 font-medium hover:text-emerald-600 transition-all duration-200 cursor-pointer"
              >
                {item.text}
              </span>
            ),
            className: "mb-2 rounded-lg hover:bg-emerald-50",
          }))}
          theme="light"
        />

        {/* Admin section at bottom */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-3 border border-emerald-200">
            <div className="flex items-center space-x-3">
              <Avatar size={32} className="bg-emerald-500 flex-shrink-0">
                <UserOutlined />
              </Avatar>
              {(isMobile || !collapsed) && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">Administrateur</p>
                  <p className="text-xs text-slate-500 truncate">Panel Admin v1.0</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Sider>

      <Layout className="bg-transparent" style={{ marginLeft: isMobile ? 0 : undefined }}>
        <Header className="px-6 bg-white/80 backdrop-blur-sm border-b border-emerald-200 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            {React.createElement(isMobile ? MenuFoldOutlined : collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className:
                "text-emerald-600 text-lg cursor-pointer p-2 rounded-lg hover:bg-emerald-50 transition-all duration-200",
              onClick: toggleCollapsed,
            })}
            <div>
              <h1 className="text-slate-800 font-bold text-xl">{getCurrentPageTitle()}</h1>
              <p className="text-slate-500 text-sm">Administration</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
          <Badge count={5} size="small">
              <BellOutlined
                className="text-slate-600 text-lg cursor-pointer hover:text-emerald-600 transition-colors"
                onClick={() => setNotifOpen(true)}
              />
            </Badge>
            <NotificationSidebar open={notifOpen} onClose={() => setNotifOpen(false)} />

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-emerald-50 rounded-lg px-3 py-2 transition-all duration-200">
                <Avatar size={32} className="bg-emerald-500">
                  <UserOutlined />
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-700">Admin</p>
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

export default AdminLayout
