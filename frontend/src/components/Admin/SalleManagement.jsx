"use client"

import React, { useState, useEffect } from "react"
import { Card, Col, Row, Carousel, Typography, Tag, Button, Space, Spin, Alert, Badge, message, Modal } from "antd"
import {
  EnvironmentOutlined,
  UserOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  DeleteOutlined,
  WifiOutlined,
  DesktopOutlined,
  SoundOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import api from '../../services/api';

const { Title, Text } = Typography
const { confirm } = Modal

const SallesManagement = () => {
  const [salles, setSalles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingIds, setDeletingIds] = useState(new Set())
  const navigate = useNavigate()

  const ImageWithFallback = ({ src, alt, className, style, fallbackSrc = "/placeholder.jpg" }) => {
    const [imgSrc, setImgSrc] = React.useState(src)
    const [hasError, setHasError] = React.useState(false)

    const handleError = () => {
      if (!hasError) {
        setHasError(true)
        setImgSrc(fallbackSrc)
      }
    }

    return (
      <img src={imgSrc || "/placeholder.svg"} alt={alt} className={className} style={style} onError={handleError} />
    )
  }

  const handleDeleteSalle = (salle) => {
    confirm({
      title: "Confirmer la suppression",
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>
            Êtes-vous sûr de vouloir supprimer la salle <strong>"{salle.nom}"</strong> ?
          </p>
          <p style={{ color: "#ff4d4f", fontSize: "14px" }}>
            Cette action est irréversible et supprimera définitivement la salle.
          </p>
        </div>
      ),
      okText: "Supprimer",
      okType: "danger",
      cancelText: "Annuler",
      onOk: async () => {
        await deleteSalle(salle.id)
      },
    })
  }

  const deleteSalle = async (salleId) => {
    try {
      setDeletingIds((prev) => new Set([...prev, salleId]))
      const token = localStorage.getItem("access_token")
        console.log(token);
      await api.delete(`/api/salles/${salleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Mettre à jour la liste des salles
      setSalles((prevSalles) => prevSalles.filter((salle) => salle.id !== salleId))
      message.success("Salle supprimée avec succès !")
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      message.error(error.response?.data?.message || "Erreur lors de la suppression de la salle")
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(salleId)
        return newSet
      })
    }
  }

  useEffect(() => {
    const fetchSalles = async () => {
      try {
        const token = localStorage.getItem("access_token")

        if (!token) {
          setError("Veuillez vous connecter pour voir les salles")
          setLoading(false)
          navigate("/auth")
          return
        }

        const response = await api.get("/api/salles", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setSalles(response.data)
      } catch (error) {
        console.error("Erreur lors de la récupération des salles:", error)
        setError("Erreur lors du chargement des salles. Veuillez réessayer.")
      } finally {
        setLoading(false)
      }
    }

    fetchSalles()
  }, [navigate])
  const handleViewDetails = (salleId) => {
    navigate(`/admin/salles/${salleId}`);
  };
  // Fonction pour obtenir l'icône et la couleur de statut
  const getStatusConfig = (status) => {
    switch (status) {
      case "active":
        return {
          icon: <CheckCircleOutlined />,
          color: "#52c41a",
          bgColor: "#f6ffed",
          borderColor: "#b7eb8f",
        }
      case "occupée":
        return {
          icon: <CloseCircleOutlined />,
          color: "#d32f2f",
          bgColor: "#fff5f5",
          borderColor: "#ffcdd2",
        }
      default:
        return {
          icon: <InfoCircleOutlined />,
          color: "#52c41a",
          bgColor: "#f6ffed",
          borderColor: "#b7eb8f",
        }
    }
  }

  // Composant d'équipements
  const EquipmentIcons = ({ salle }) => {
    const equipments = []

    if (salle.wifi) equipments.push(<WifiOutlined key="wifi" title="WiFi disponible" />)
    if (salle.projecteur) equipments.push(<DesktopOutlined key="projecteur" title="Projecteur" />)
    if (salle.systeme_audio) equipments.push(<SoundOutlined key="audio" title="Système audio" />)

    return equipments.length > 0 ? (
      <div style={{ marginTop: "8px", color: "#52c41a" }}>
        <Space>{equipments}</Space>
      </div>
    ) : null
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
        <Text style={{ marginTop: "16px", color: "#666" }}>Chargement des salles...</Text>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert message="Erreur de chargement" description={error} type="error" showIcon closable />
      </div>
    )
  }

  return (
    <div
      className="salles-disponibles"
      style={{
        padding: "24px",
        background: "linear-gradient(135deg, #f0f9f0 0%, #e8f5e8 100%)",
        minHeight: "100vh",
      }}
    >
      {/* En-tête avec titre et statistiques */}
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
        <Title
          level={2}
          style={{
            margin: 0,
            background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "28px",
            fontWeight: "bold",
          }}
        >
          Gestion des Salles
        </Title>

        <div style={{ marginTop: "12px" }}>
          <Space size="middle">
            <Badge count={salles.filter((s) => s.status === "active").length} style={{ backgroundColor: "#52c41a" }}>
              <Tag color="success">Disponibles</Tag>
            </Badge>
            <Badge count={salles.filter((s) => s.status === "inactive").length} style={{ backgroundColor: "#d32f2f" }}>
              <Tag color="error">Occupées</Tag>
            </Badge>
            <Tag
              style={{
                backgroundColor: "#f6ffed",
                borderColor: "#52c41a",
                color: "#389e0d",
              }}
            >
              Total: {salles.length}
            </Tag>
          </Space>
        </div>
      </div>

      {/* Grille des salles */}
      <Row gutter={[24, 24]}>
        {salles.map((salle) => {
          const statusConfig = getStatusConfig(salle.status)
          const isDeleting = deletingIds.has(salle.id)

          return (
            <Col xs={24} sm={12} md={8} lg={6} key={salle.id}>
              <Card
                hoverable={!isDeleting}
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  border: `2px solid ${statusConfig.borderColor}`,
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  opacity: isDeleting ? 0.6 : 1,
                }}
                bodyStyle={{ padding: "20px" }}
                cover={
                  <div style={{ position: "relative" }}>
                    <Carousel
                      autoplay={!isDeleting}
                      effect="fade"
                      dots={{ className: "custom-carousel-dots" }}
                      style={{ width: "100%" }}
                    >
                      {(() => {
                        // Conversion en tableau
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

                        // Si on a des images
                        if (imagesArray && imagesArray.length > 0) {
                          return imagesArray.map((image, index) => {
                            // Nettoyage du chemin
                            let imagePath = ""
                            if (typeof image === "string") {
                              // Supprime les préfixes inutiles
                              const cleanPath = image
                                .replace(/^public\//, "")
                                .replace(/^salles\//, "")
                                .replace(/^storage\//, "")
                                .replace(/^\//, "")

                              imagePath = `http://localhost:8000/storage/salles/${image }`
                            }

                            return (
                              <div key={index} style={{ height: "220px", overflow: "hidden" }}>
                                <ImageWithFallback
                                  src={imagePath || "/placeholder.svg"}
                                  alt={salle.nom || `Salle ${salle.id}`}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    filter: salle.status === "inactive" || isDeleting ? "grayscale(30%)" : "none",
                                  }}
                                />
                              </div>
                            )
                          })
                        }

                        // Aucune image
                        return (
                          <div
                            style={{
                              width: "100%",
                              height: "220px",
                              background: "linear-gradient(135deg, #f0f2f5 0%, #d9d9d9 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#666",
                              fontSize: "16px",
                            }}
                          >
                            📷 Aucune image disponible
                          </div>
                        )
                      })()}
                    </Carousel>

                    {/* Badge de statut flottant */}
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        background: statusConfig.bgColor,
                        border: `1px solid ${statusConfig.borderColor}`,
                        borderRadius: "20px",
                        padding: "4px 12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        color: statusConfig.color,
                        fontWeight: "500",
                        fontSize: "12px",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      {statusConfig.icon}
                      {salle.status}
                    </div>

                    {/* Overlay de suppression */}
                    {isDeleting && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: "rgba(0, 0, 0, 0.3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backdropFilter: "blur(2px)",
                        }}
                      >
                        <Spin size="large" />
                      </div>
                    )}
                  </div>
                }
              >
                {/* Contenu de la carte */}
                <div>
                  {/* Titre de la salle */}
                  <Title
                    level={4}
                    style={{
                      margin: "0 0 12px 0",
                      color: "#262626",
                      fontSize: "18px",
                    }}
                  >
                    {salle.nom}
                  </Title>

                  {/* Informations principales */}
                  <Space direction="vertical" size="small" style={{ width: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#595959",
                        fontSize: "14px",
                      }}
                    >
                      <EnvironmentOutlined style={{ marginRight: "8px", color: "#52c41a" }} />
                      <Text>{salle.location}</Text>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#595959",
                        fontSize: "14px",
                      }}
                    >
                      <UserOutlined style={{ marginRight: "8px", color: "#52c41a" }} />
                      <Text strong>{salle.capacite}</Text>
                      <Text style={{ marginLeft: "4px" }}>places</Text>
                    </div>

                    {salle.description && (
                      <div
                        style={{
                          color: "#8c8c8c",
                          fontSize: "13px",
                          lineHeight: "1.4",
                          marginTop: "8px",
                        }}
                      >
                        {salle.description}
                      </div>
                    )}

                    <EquipmentIcons salle={salle} />
                  </Space>

                  {/* Boutons d'action */}
                  <div
                    style={{
                      marginTop: "16px",
                      paddingTop: "16px",
                      borderTop: "1px solid #f0f0f0",
                      display: "flex",
                      gap: "8px",
                      justifyContent: "space-between",
                    }}
                  >
                    {/*le clique sur voir details redirige vers la page de details de la salle */}
                    <Button
                      type="primary"
                      icon={<EyeOutlined />}
                      size="small"
                      disabled={isDeleting}
                      onClick={() => handleViewDetails(salle.id)}
                      style={{
                        borderRadius: "6px",
                        background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                        border: "none",
                      }}
                    >
                      Voir détails
                    </Button>

                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                      loading={isDeleting}
                      onClick={() => handleDeleteSalle(salle)}
                      style={{
                        borderRadius: "6px",
                      }}
                    >
                      {isDeleting ? "Suppression..." : "Supprimer"}
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          )
        })}
      </Row>

      {/* Message si aucune salle */}
      {salles.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "48px",
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
          }}
        >
          <InfoCircleOutlined style={{ fontSize: "48px", color: "#b7eb8f", marginBottom: "16px" }} />
          <Title level={3} style={{ color: "#52c41a" }}>
            Aucune salle disponible
          </Title>
          <Text style={{ color: "#95de64" }}>Aucune salle n'a été trouvée dans le système</Text>
        </div>
      )}

      {/* Styles CSS personnalisés */}
      <style jsx>{`
        .custom-carousel-dots {
          bottom: 8px;
        }
        
        .custom-carousel-dots li button {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
        }
        
        .custom-carousel-dots li.slick-active button {
          background: white;
        }
        
        .ant-card:hover:not([style*="opacity: 0.6"]) {
          transform: translateY(-4px);
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15) !important;
        }
        
        .ant-carousel .slick-dots li button {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
      `}</style>
    </div>
  )
}

export default SallesManagement
