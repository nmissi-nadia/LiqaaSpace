import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, Row, Col, Typography, Button, Space, Avatar, Progress, Tag, Divider, Empty, Spin, Alert } from "antd"
import {
  CalendarOutlined,
  HomeOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  RightOutlined,
} from "@ant-design/icons"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import axios from "axios"

const { Title, Text } = Typography

const CollaborateurDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalReservations: 0,
    totalSallesoccupe: 0,
    totalCollaborateurs: 0,
    totalsalledispo: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reunionsAVenir, setReunionsAVenir] = useState([])
  const [sallesDisponibles, setSallesDisponibles] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("access_token")
        const userData = JSON.parse(localStorage.getItem("user") || "{}")
        setUser(userData)

        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        }

        // Récupération des statistiques
        const statsResponse = await axios.get("http://localhost:8000/api/stats/collaborateur", { headers })

        // Récupération des réunions à venir
        const reunionsResponse = await axios.get(`http://localhost:8000/api/reservations/avenir/${userData.id}`, {
          headers,
        })

        // Récupération des salles disponibles
        const sallesResponse = await axios.get("http://localhost:8000/api/salles/disponibles", { headers })
        console.log(statsResponse.data)
        setStats({
          ...statsResponse.data,
        })
        setReunionsAVenir(reunionsResponse.data)
        setSallesDisponibles(sallesResponse.data)
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err)
        setError("Impossible de charger les données. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const calculateAvailabilityRate = (data) => {
    const totalSalles = data.totalsalledispo + data.totalSallesoccupe
    return totalSalles > 0 ? Math.round((data.totalsalledispo / totalSalles) * 100) : 0
  }

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "EEEE d MMMM à HH:mm", { locale: fr })
    } catch (error) {
      return dateString
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepté":
        return <CheckCircleOutlined style={{ color: "#10b981" }} />
      case "en attente":
        return <ExclamationCircleOutlined style={{ color: "#f59e0b" }} />
      default:
        return <CloseCircleOutlined style={{ color: "#ef4444" }} />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "accepté":
        return "green"
      case "en attente":
        return "orange"
      default:
        return "red"
    }
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          flexDirection: "column",
        }}
      >
        <Spin size="large" />
        <Text style={{ marginTop: "16px", color: "#666" }}>Chargement de votre espace...</Text>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert
          message="Erreur de chargement"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div
      style={{
        padding: "24px",
        background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
        minHeight: "100vh",
      }}
    >
      {/* En-tête de bienvenue */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "24px",
          boxShadow: "0 8px 32px rgba(16, 185, 129, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Avatar size={64} className="bg-emerald-500">
              <UserOutlined style={{ fontSize: "28px" }} />
            </Avatar>
            <div>
              <Title
                level={2}
                style={{
                  margin: 0,
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: "28px",
                  fontWeight: "bold",
                }}
              >
                Bonjour {user?.name || "Collaborateur"} !
              </Title>
              <Text type="secondary" style={{ fontSize: "16px" }}>
                Bienvenue dans votre espace personnel
              </Text>
            </div>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => navigate("/collaborateur/mesreservations")}
            style={{
              borderRadius: "12px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              border: "none",
              height: "48px",
              paddingLeft: "24px",
              paddingRight: "24px",
            }}
          >
            Nouvelle réservation
          </Button>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.1)",
              transition: "all 0.3s ease",
            }}
            className="hover:shadow-xl hover:-translate-y-1"
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "12px",
                }}
              >
                <CalendarOutlined style={{ color: "white", fontSize: "20px" }} />
              </div>
              <Text type="secondary">Mes Réservations</Text>
            </div>
            <Title level={2} style={{ margin: "0 0 8px 0", color: "#1f2937" }}>
              {stats.totalReservations}
            </Title>
            <Text type="secondary">
              {stats.totalReservations === 1 ? "Réservation effectuée" : "Réservations effectuées"}
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.1)",
              transition: "all 0.3s ease",
            }}
            className="hover:shadow-xl hover:-translate-y-1"
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "12px",
                }}
              >
                <TeamOutlined style={{ color: "white", fontSize: "20px" }} />
              </div>
              <Text type="secondary">Équipe</Text>
            </div>
            <Title level={2} style={{ margin: "0 0 8px 0", color: "#1f2937" }}>
              {stats.totalCollaborateurs}
            </Title>
            <Text type="secondary">
              {stats.totalCollaborateurs === 1 ? "Collaborateur dans l'équipe" : "Collaborateurs dans l'équipe"}
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.1)",
              transition: "all 0.3s ease",
            }}
            className="hover:shadow-xl hover:-translate-y-1"
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "12px",
                }}
              >
                <HomeOutlined style={{ color: "white", fontSize: "20px" }} />
              </div>
              <Text type="secondary">Disponibilité</Text>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
              <Title level={2} style={{ margin: "0 8px 0 0", color: "#1f2937" }}>
                {calculateAvailabilityRate(stats)}%
              </Title>
            </div>
            <Progress
              percent={calculateAvailabilityRate(stats)}
              strokeColor={{
                "0%": "#10b981",
                "100%": "#059669",
              }}
              trailColor="#f3f4f6"
              strokeWidth={8}
              showInfo={false}
              style={{ marginBottom: "8px" }}
            />
            <Text type="secondary">
              {stats.totalsalledispo} {stats.totalsalledispo === 1 ? "salle disponible" : "salles disponibles"}
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.1)",
              transition: "all 0.3s ease",
            }}
            className="hover:shadow-xl hover:-translate-y-1"
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "12px",
                }}
              >
                <HomeOutlined style={{ color: "white", fontSize: "20px" }} />
              </div>
              <Text type="secondary">Salles</Text>
            </div>
            <Title level={2} style={{ margin: "0 0 8px 0", color: "#1f2937" }}>
              {stats.totalsalledispo + stats.totalSallesoccupe}
            </Title>
            <Text type="secondary">
              {stats.totalsalledispo + stats.totalSallesoccupe === 1 ? "Salle au total" : "Salles au total"}
            </Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Prochaines réunions */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CalendarOutlined style={{ color: "#10b981" }} />
                  <span>Mes prochaines réunions</span>
                </div>
                <Button
                  type="text"
                  onClick={() => navigate("/collaborateur/mesreservations")}
                  style={{ color: "#10b981" }}
                  icon={<RightOutlined />}
                >
                  Voir tout
                </Button>
              </div>
            }
            style={{
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(16, 185, 129, 0.1)",
            }}
          >
            {reunionsAVenir.length > 0 ? (
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                {reunionsAVenir.map((reunion, index) => (
                  <div key={reunion.id}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px",
                        borderRadius: "12px",
                        background: "rgba(16, 185, 129, 0.05)",
                        border: "1px solid rgba(16, 185, 129, 0.1)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      className="hover:bg-emerald-50"
                      onClick={() => navigate(`/collaborateur/reunion/${reunion.id}`)}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                          {getStatusIcon(reunion.status)}
                          <Text strong style={{ marginLeft: "8px", fontSize: "16px" }}>
                            {reunion.titre || reunion.motif}
                          </Text>
                        </div>
                        <Space wrap>
                          <Tag icon={<HomeOutlined />} color="green">
                            {reunion.salle?.nom}
                          </Tag>
                          <Text type="secondary">{formatDate(reunion.heure_debut || reunion.date)}</Text>
                        </Space>
                      </div>
                      <Button type="primary" ghost style={{ borderColor: "#10b981", color: "#10b981" }}>
                        Détails
                      </Button>
                    </div>
                    {index < reunionsAVenir.length - 1 && <Divider style={{ margin: "8px 0" }} />}
                  </div>
                ))}
              </Space>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div>
                    <Text type="secondary">Aucune réunion à venir</Text>
                    <br />
                    <Button
                      type="primary"
                      onClick={() => navigate("/collaborateur/mesreservations")}
                      style={{
                        marginTop: "16px",
                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        border: "none",
                      }}
                    >
                      Réserver une salle
                    </Button>
                  </div>
                }
              />
            )}
          </Card>
        </Col>

        {/* Salles disponibles et actions rapides */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Salles disponibles */}
            <Card
              title={
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <HomeOutlined style={{ color: "#10b981" }} />
                    <span>Salles disponibles</span>
                  </div>
                  <Button
                    type="text"
                    onClick={() => navigate("/collaborateur/sallesdisponibles")}
                    style={{ color: "#10b981" }}
                    icon={<RightOutlined />}
                  >
                    Voir tout
                  </Button>
                </div>
              }
              style={{
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px rgba(16, 185, 129, 0.1)",
              }}
            >
              {sallesDisponibles.length > 0 ? (
                <Space direction="vertical" size="small" style={{ width: "100%" }}>
                  {sallesDisponibles.slice(0, 4).map((salle) => (
                    <div
                      key={salle.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px",
                        borderRadius: "8px",
                        background: salle.disponible ? "rgba(16, 185, 129, 0.05)" : "rgba(156, 163, 175, 0.05)",
                        borderLeft: `4px solid ${salle.disponible ? "#10b981" : "#9ca3af"}`,
                      }}
                    >
                      <div>
                        <Text strong>{salle.nom}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          Capacité: {salle.capacite} personnes
                        </Text>
                      </div>
                      <Tag color={salle.disponible ? "green" : "default"}>
                        {salle.disponible ? "Disponible" : "Occupée"}
                      </Tag>
                    </div>
                  ))}
                </Space>
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Aucune salle disponible pour le moment" />
              )}
            </Card>

            {/* Actions rapides */}
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <ClockCircleOutlined style={{ color: "#10b981" }} />
                  <span>Actions rapides</span>
                </div>
              }
              style={{
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px rgba(16, 185, 129, 0.1)",
              }}
            >
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<PlusOutlined />}
                  onClick={() => navigate("/collaborateur/mesreservations")}
                  style={{
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    border: "none",
                    height: "48px",
                  }}
                >
                  Nouvelle réservation
                </Button>
                <Button
                  size="large"
                  block
                  icon={<EyeOutlined />}
                  onClick={() => navigate("/collaborateur/mesreservations")}
                  style={{
                    borderRadius: "8px",
                    borderColor: "#10b981",
                    color: "#10b981",
                    height: "48px",
                  }}
                >
                  Voir mes réservations
                </Button>
                <Button
                  size="large"
                  block
                  icon={<HomeOutlined />}
                  onClick={() => navigate("/collaborateur/sallesdisponibles")}
                  style={{
                    borderRadius: "8px",
                    borderColor: "#10b981",
                    color: "#10b981",
                    height: "48px",
                  }}
                >
                  Explorer les salles
                </Button>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  )
}

export default CollaborateurDashboard
