import React, { useState, useEffect } from "react"
import {
  Card,
  Carousel,
  Typography,
  Tag,
  Button,
  Space,
  Spin,
  Alert,
  Modal,
  Descriptions,
  Avatar,
  Row,
  Col,
  message,
  Breadcrumb,
} from "antd"
import {
  EnvironmentOutlined,
  UserOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  WifiOutlined,
  DesktopOutlined,
  SoundOutlined,
  ExclamationCircleOutlined,
  IdcardOutlined,
  TeamOutlined,
  HomeOutlined,
} from "@ant-design/icons"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import api from "../../services/api"

const { Title, Text, Paragraph } = Typography
const { confirm } = Modal

const SalleDetails = () => {
  const [salle, setSalle] = useState(null)
  const [responsable, setResponsable] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()

  
  const handleDeleteSalle = () => {
    confirm({
      title: "Confirmer la suppression",
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>
            Êtes-vous sûr de vouloir supprimer définitivement la salle <strong>"{salle?.nom}"</strong> ?
          </p>
          <p style={{ color: "#ff4d4f", fontSize: "14px", marginTop: "12px" }}>
            ⚠️ Cette action est irréversible et supprimera :
          </p>
          <ul style={{ color: "#ff4d4f", fontSize: "14px", marginLeft: "20px" }}>
            <li>Toutes les informations de la salle</li>
            <li>Toutes les images associées</li>
            <li>Toutes les réservations liées</li>
          </ul>
        </div>
      ),
      okText: "Supprimer définitivement",
      okType: "danger",
      cancelText: "Annuler",
      width: 500,
      onOk: async () => {
        await deleteSalle()
      },
    })
  }

  const deleteSalle = async () => {
    try {
      setDeleting(true)
      const token = localStorage.getItem("access_token")

      await api.delete(`/api/salles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      message.success("Salle supprimée avec succès !")
      navigate("/salles") // Redirection vers la liste des salles
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      message.error(error.response?.data?.message || "Erreur lors de la suppression de la salle")
      setDeleting(false)
    }
  }

  useEffect(() => {
    const fetchSalleDetails = async () => {
      try {
        const token = localStorage.getItem("access_token")

        if (!token) {
          setError("Veuillez vous connecter pour voir les détails")
          setLoading(false)
          navigate("/auth")
          return
        }

        // Récupérer les détails de la salle
        const salleResponse = await api.get(`/api/salles/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setSalle(salleResponse.data)

        // Récupérer les informations du responsable si disponible
        if (salleResponse.data.responsable_id) {
          try {
            const responsableResponse = await api.get(
              `/api/users/${salleResponse.data.responsable_id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            )
            setResponsable(responsableResponse.data)
          } catch (error) {
            console.warn("Impossible de récupérer les informations du responsable:", error)
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des détails:", error)
        if (error.response?.status === 404) {
          setError("Salle non trouvée")
        } else {
          setError("Erreur lors du chargement des détails. Veuillez réessayer.")
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchSalleDetails()
    }
  }, [id, navigate])

  // Fonction pour obtenir la configuration du statut
  const getStatusConfig = (status) => {
    switch (status) {
      case "active":
        return {
          icon: <CheckCircleOutlined />,
          color: "#52c41a",
          bgColor: "#f6ffed",
          borderColor: "#b7eb8f",
          text: "Disponible",
        }
      case "inactive":
        return {
          icon: <CloseCircleOutlined />,
          color: "#d32f2f",
          bgColor: "#fff5f5",
          borderColor: "#ffcdd2",
          text: "Occupée",
        }
      default:
        return {
          icon: <InfoCircleOutlined />,
          color: "#52c41a",
          bgColor: "#f6ffed",
          borderColor: "#b7eb8f",
          text: status,
        }
    }
  }

  // Composant d'équipements
  const EquipmentSection = ({ salle }) => {
    const equipments = []

    if (salle.wifi) equipments.push({ icon: <WifiOutlined />, label: "WiFi disponible" })
    if (salle.projecteur) equipments.push({ icon: <DesktopOutlined />, label: "Projecteur" })
    if (salle.systeme_audio) equipments.push({ icon: <SoundOutlined />, label: "Système audio" })

    if (equipments.length === 0) {
      return (
        <Text type="secondary" italic>
          Aucun équipement spécifique répertorié
        </Text>
      )
    }

    return (
      <Space direction="vertical" size="small">
        {equipments.map((equipment, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#52c41a", fontSize: "16px" }}>{equipment.icon}</span>
            <Text>{equipment.label}</Text>
          </div>
        ))}
      </Space>
    )
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          flexDirection: "column",
        }}
      >
        <Spin size="large" />
        <Text style={{ marginTop: "16px", color: "#666" }}>Chargement des détails...</Text>
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
            <Button size="small" onClick={() => navigate("/salles")}>
              Retour à la liste
            </Button>
          }
        />
      </div>
    )
  }

  if (!salle) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert
          message="Salle non trouvée"
          description="La salle demandée n'existe pas ou a été supprimée."
          type="warning"
          showIcon
          action={
            <Button size="small" onClick={() => navigate("/salles")}>
              Retour à la liste
            </Button>
          }
        />
      </div>
    )
  }

  const statusConfig = getStatusConfig(salle.status)

  // Traitement des images
  let imagesArray = []
  if (typeof salle.images === "string") {
    try {
      imagesArray = JSON.parse(salle.images)
    } catch (e) {
      console.error("Erreur de parsing JSON:", e)
    }
  } else if (Array.isArray(salle.images)) {
    imagesArray = salle.images
  }
// Juste avant le return du composant
console.log('Données de la salle:', salle);
console.log('Type de salle.images:', typeof salle.images);
console.log('Valeur de salle.images:', salle.images);
  return (
    <div
      style={{
        padding: "24px",
        background: "linear-gradient(135deg, #f0f9f0 0%, #e8f5e8 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Breadcrumb et navigation */}
      <div style={{ marginBottom: "24px" }}>
        <Breadcrumb
          items={[
            {
              href: "/",
              title: <HomeOutlined />,
            },
            {
              href: "/salles",
              title: "Salles",
            },
            {
              title: salle.nom,
            },
          ]}
        />
      </div>

      {/* En-tête avec bouton retour */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "24px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/salles")} style={{ borderRadius: "8px" }}>
            Retour à la liste
          </Button>

          <Button
            danger
            icon={<DeleteOutlined />}
            loading={deleting}
            onClick={handleDeleteSalle}
            style={{ borderRadius: "8px" }}
          >
            {deleting ? "Suppression..." : "Supprimer la salle"}
          </Button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Title
            level={1}
            style={{
              margin: 0,
              background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "32px",
              fontWeight: "bold",
            }}
          >
            {salle.nom}
          </Title>

          <Tag
            icon={statusConfig.icon}
            color={statusConfig.color}
            style={{
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {statusConfig.text}
          </Tag>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Colonne gauche - Carrousel d'images */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
            styles={{ body: {padding: 0} }}
          >
            {imagesArray && imagesArray.length > 0 ? (
                  <Carousel autoplay effect="fade" dots={{ className: "custom-carousel-dots" }} style={{ width: "100%" }}>
                    {imagesArray.map((image, index) => {
                      let imagePath = ""
                      if (typeof image === "string") {
                        // Supprimer le préfixe 'public/' s'il existe
                        const cleanPath = image.replace(/^public\//, "");
                        // Construire le chemin complet avec le préfixe /storage
                        imagePath = `http://localhost:8000/storage/salles/${image}`;
                      }
                      console.log("Chemin de l'image:", imagePath);
                      return (
                        <div key={index} style={{ height: "400px", overflow: "hidden" }}>
                          <img
                            src={imagePath}
                            alt={`${salle.nom} - Image ${index + 1}`}
                            style={{
                              width: "50%",
                              height: "50%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      )
                    })}
                  </Carousel>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "400px",
                  background: "linear-gradient(135deg, #f0f2f5 0%, #d9d9d9 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#666",
                  fontSize: "18px",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ fontSize: "48px" }}>📷</div>
                <Text>Aucune image disponible</Text>
              </div>
            )}
          </Card>
        </Col>

        {/* Colonne droite - Informations détaillées */}
        <Col xs={24} lg={12}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Informations générales */}
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <InfoCircleOutlined style={{ color: "#52c41a" }} />
                  Informations générales
                </div>
              }
              style={{
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Descriptions column={1} size="middle">
                <Descriptions.Item
                  label={
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <IdcardOutlined /> ID
                    </span>
                  }
                >
                  <Tag color="blue">#{salle.id}</Tag>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <EnvironmentOutlined /> Localisation
                    </span>
                  }
                >
                  <Text strong>{salle.location}</Text>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <TeamOutlined /> Capacité
                    </span>
                  }
                >
                  <Text strong style={{ color: "#52c41a", fontSize: "16px" }}>
                    {salle.capacite} personnes
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Description */}
            {salle.description && (
              <Card
                title="Description"
                style={{
                  borderRadius: "16px",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Paragraph style={{ fontSize: "15px", lineHeight: "1.6", margin: 0 }}>{salle.description}</Paragraph>
              </Card>
            )}

            {/* Responsable */}
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <UserOutlined style={{ color: "#52c41a" }} />
                  Responsable
                </div>
              }
              style={{
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              {responsable ? (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Avatar size={48} style={{ backgroundColor: "#52c41a" }}>
                    {responsable.name?.charAt(0)?.toUpperCase() || "?"}
                  </Avatar>
                  <div>
                    <Text strong style={{ fontSize: "16px" }}>
                      {responsable.name}
                    </Text>
                    <br />
                    <Text type="secondary">{responsable.email}</Text>
                  </div>
                </div>
              ) : salle.responsable_id ? (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Avatar size={48} style={{ backgroundColor: "#d9d9d9" }}>
                    ?
                  </Avatar>
                  <div>
                    <Text>ID: {salle.responsable_id}</Text>
                    <br />
                    <Text type="secondary">Informations non disponibles</Text>
                  </div>
                </div>
              ) : (
                <Text type="secondary" italic>
                  Aucun responsable assigné
                </Text>
              )}
            </Card>

            {/* Équipements */}
            <Card
              title="Équipements disponibles"
              style={{
                borderRadius: "16px",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              <EquipmentSection salle={salle} />
            </Card>
          </Space>
        </Col>
      </Row>

      {/* Styles CSS personnalisés */}
      <style jsx>{`
        .custom-carousel-dots {
          bottom: 12px;
        }

        .custom-carousel-dots li button {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
        }

        .custom-carousel-dots li.slick-active button {
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .ant-descriptions-item-label {
          font-weight: 500;
          color: #595959;
        }

        .ant-card-head-title {
          font-weight: 600;
          color: #262626;
        }
      `}</style>
    </div>
  )
}

export default SalleDetails
