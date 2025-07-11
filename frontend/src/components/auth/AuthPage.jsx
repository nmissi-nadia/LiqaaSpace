"use client"

import { useState } from "react"
import { Button, Space, Typography } from "antd"
import {
  UserOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
  SafetyOutlined as ShieldCheckOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons"
import Login from "./Login"
import Register from "./Register"
import Logo from "../common/logo"

const { Title, Text } = Typography

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  const toggleForm = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsLogin(!isLogin)
      setIsAnimating(false)
    }, 200)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 50%, #ffffff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Effets de fond décoratifs verts */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-50px",
          left: "-50px",
          width: "250px",
          height: "250px",
          background: "radial-gradient(circle, rgba(5, 150, 105, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: "100px",
          height: "100px",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          background: "rgba(255, 255, 255, 0.98)",
          borderRadius: "24px",
          boxShadow: "0 25px 50px rgba(16, 185, 129, 0.15)",
          backdropFilter: "blur(20px)",
          overflow: "hidden",
          position: "relative",
          border: "1px solid rgba(16, 185, 129, 0.1)",
        }}
      >
        {/* Bordure verte en haut */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            height: "4px",
            background: "linear-gradient(90deg, #10b981 0%, #059669 50%, #10b981 100%)",
          }}
        />

        <div style={{ display: "flex", minHeight: "700px" }}>
          {/* Section Image/Présentation - Fond vert */}
          <div
            style={{
              flex: 1,
              background: "linear-gradient(135deg, #10b981 0%, #059669 50%,rgb(4, 189, 102) 100%)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "48px",
              color: "white",
              overflow: "hidden",
            }}
          >
            {/* Éléments décoratifs blancs */}
            <div
              style={{
                position: "absolute",
                top: "40px",
                left: "40px",
                width: "80px",
                height: "80px",
                border: "2px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "80px",
                right: "40px",
                width: "64px",
                height: "64px",
                border: "2px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "33%",
                right: "80px",
                width: "8px",
                height: "8px",
                background: "rgba(255, 255, 255, 0.4)",
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "33%",
                left: "80px",
                width: "12px",
                height: "12px",
                background: "rgba(255, 255, 255, 0.3)",
                borderRadius: "50%",
              }}
            />

            <div style={{ maxWidth: "400px", zIndex: 10 }}>
              {/* Logo OCP en haut */}
              <div style={{ marginBottom: "32px" }}>
                <Logo size="xlarge" white={true} />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "64px",
                    height: "64px",
                    background: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "16px",
                    marginBottom: "24px",
                  }}
                >
                  {isLogin ? (
                    <UserOutlined style={{ fontSize: "32px" }} />
                  ) : (
                    <UserAddOutlined style={{ fontSize: "32px" }} />
                  )}
                </div>
              </div>

              <Title
                level={1}
                style={{
                  color: "white",
                  fontSize: "48px",
                  fontWeight: "bold",
                  marginBottom: "24px",
                  lineHeight: "1.2",
                }}
              >
                {isLogin ? "Bienvenue !" : "Rejoignez OCP"}
              </Title>

              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: "20px",
                  lineHeight: "1.6",
                  marginBottom: "32px",
                  display: "block",
                }}
              >
                {isLogin
                  ? "Connectez-vous à votre espace LiqaaSpace pour gérer vos réservations de salles"
                  : "Créez votre compte OCP LiqaaSpace pour réserver des salles de réunion"}
              </Text>

              <Space direction="vertical" size="large">
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      background: "rgba(255, 255, 255, 0.2)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckCircleOutlined style={{ fontSize: "16px" }} />
                  </div>
                  <Text style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "16px" }}>Réservation instantanée</Text>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      background: "rgba(255, 255, 255, 0.2)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ShieldCheckOutlined style={{ fontSize: "16px" }} />
                  </div>
                  <Text style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "16px" }}>Plateforme sécurisée OCP</Text>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      background: "rgba(255, 255, 255, 0.2)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ClockCircleOutlined style={{ fontSize: "16px" }} />
                  </div>
                  <Text style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "16px" }}>Accès 24h/24 7j/7</Text>
                </div>
              </Space>
            </div>
          </div>

          {/* Section Formulaire - Fond blanc */}
          <div
            style={{
              flex: 1,
              padding: "48px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
              background: "white",
            }}
          >
            {/* Bouton de basculement */}
            <Button
              onClick={toggleForm}
              style={{
                position: "absolute",
                top: "24px",
                right: "24px",
                borderColor: "#10b981",
                color: "#10b981",
                borderRadius: "12px",
                height: "40px",
                paddingLeft: "24px",
                paddingRight: "24px",
                fontWeight: "500",
                background: "white",
              }}
              icon={<ArrowRightOutlined />}
            >
              {isLogin ? "S'inscrire" : "Se connecter"}
            </Button>

            {/* En-tête du formulaire */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              {/* Logo OCP plus petit */}
              <div style={{ marginBottom: "24px" }}>
                <Logo size="medium" />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "64px",
                    height: "64px",
                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)",
                    borderRadius: "16px",
                    marginBottom: "16px",
                  }}
                >
                  {isLogin ? (
                    <UserOutlined style={{ fontSize: "32px", color: "#10b981" }} />
                  ) : (
                    <UserAddOutlined style={{ fontSize: "32px", color: "#10b981" }} />
                  )}
                </div>
              </div>

              <Title
                level={2}
                style={{
                  color: "#1f2937",
                  marginBottom: "8px",
                  fontSize: "32px",
                  fontWeight: "bold",
                }}
              >
                {isLogin ? "Connexion" : "Inscription"}
              </Title>

              <Text type="secondary" style={{ fontSize: "16px" }}>
                {isLogin ? "Accédez à votre espace OCP LiqaaSpace" : "Créez votre compte OCP LiqaaSpace"}
              </Text>
            </div>

            {/* Zone de formulaire avec animation */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  transition: "all 0.3s ease",
                  opacity: isAnimating ? 0 : 1,
                  transform: isAnimating ? "scale(0.95)" : "scale(1)",
                }}
              >
                {isLogin ? <Login /> : <Register />}
              </div>
            </div>

            {/* Lien alternatif */}
            <div style={{ textAlign: "center", marginTop: "32px" }}>
              <Text type="secondary">
                {isLogin ? "Nouveau chez OCP LiqaaSpace ?" : "Déjà membre OCP ?"}
                <Button
                  type="link"
                  onClick={toggleForm}
                  style={{
                    color: "#10b981",
                    fontWeight: "600",
                    padding: "0 8px",
                  }}
                >
                  {isLogin ? "Créer un compte" : "Se connecter"}
                </Button>
              </Text>
            </div>

            {/* Décoration verte */}
            <div style={{ marginTop: "24px", display: "flex", justifyContent: "center" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    background: "rgba(16, 185, 129, 0.3)",
                    borderRadius: "50%",
                  }}
                />
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    background: "rgba(16, 185, 129, 0.5)",
                    borderRadius: "50%",
                  }}
                />
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    background: "#10b981",
                    borderRadius: "50%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "4px",
            background: "linear-gradient(90deg, #10b981 0%, #059669 50%, #10b981 100%)",
          }}
        />
      </div>
    </div>
  )
}

export default AuthPage
