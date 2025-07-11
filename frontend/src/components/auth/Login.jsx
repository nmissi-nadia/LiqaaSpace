"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Form, Input, Button, Alert, message, Divider } from "antd"
import { MailOutlined, LockOutlined } from "@ant-design/icons"
import { useAuth } from "../../contexts/AuthContext"
import api from "../../services/api"

const Login = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const onFinish = async (values) => {
    try {
      setLoading(true)
      setError(null)

      const success = await login(values.email, values.password)
      console.log("Token after login:", localStorage.getItem("access_token"))

      if (success) {
        // Récupérer le rôle de l'utilisateur
        const userResponse = await api.get("api/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        const role = userResponse.data.role

        message.success("Connexion réussie ! Bienvenue sur OCP LiqaaSpace")

        // Redirection selon le rôle
        switch (role) {
          case "admin":
            navigate("/admin")
            break
          case "responsable":
            navigate("/responsable")
            break
          case "collaborateur":
            navigate("/collaborateur")
            break
          default:
            navigate("/")
            break
        }
      } else {
        throw new Error("Échec de la connexion")
      }
    } catch (error) {
      console.error("Erreur de connexion:", error)

      if (error.response?.data?.errors) {
        // Gestion des erreurs de validation
        const errors = error.response.data.errors
        Object.entries(errors).forEach(([field, messages]) => {
          form.setFields([
            {
              name: field,
              errors: [messages[0]],
            },
          ])
        })
      } else {
        const errorMessage =
          error.response?.data?.message || "Impossible de se connecter. Vérifiez vos identifiants OCP."
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      {error && (
        <Alert
          message="Erreur de connexion"
          description={error}
          type="error"
          showIcon
          style={{
            marginBottom: "24px",
            borderRadius: "12px",
            border: "1px solid #fecaca",
            background: "#fef2f2",
          }}
          closable
          onClose={() => setError(null)}
        />
      )}

      <div
        style={{
          background: "white",
          padding: "32px",
          borderRadius: "16px",
          border: "2px solid #10b981",
          boxShadow: "0 8px 32px rgba(16, 185, 129, 0.15)",
        }}
      >
        <Form form={form} name="login" onFinish={onFinish} layout="vertical" size="large">
          <Form.Item
            name="email"
            label={<span style={{ color: "#374151", fontWeight: "500" }}>Adresse email OCP</span>}
            rules={[
              {
                required: true,
                message: "Veuillez saisir votre email OCP !",
              },
              {
                type: "email",
                message: "Format d'email invalide !",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "#10b981" }} />}
              placeholder="votre.nom@ocpgroup.ma"
              style={{
                borderRadius: "8px",
                height: "48px",
                borderColor: "#d1fae5",
                background: "#f0fdf4",
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span style={{ color: "#374151", fontWeight: "500" }}>Mot de passe</span>}
            rules={[
              {
                required: true,
                message: "Veuillez saisir votre mot de passe !",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#10b981" }} />}
              placeholder="Votre mot de passe"
              style={{
                borderRadius: "8px",
                height: "48px",
                borderColor: "#d1fae5",
                background: "#f0fdf4",
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: "16px" }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: "48px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                border: "none",
                fontSize: "16px",
                fontWeight: "600",
                boxShadow: "0 4px 16px rgba(16, 185, 129, 0.3)",
              }}
            >
              {loading ? "Connexion en cours..." : "Se connecter à OCP LiqaaSpace"}
            </Button>
          </Form.Item>

          <Divider style={{ borderColor: "#d1fae5" }} />

          <div style={{ textAlign: "center" }}>
            <Button
              type="link"
              style={{
                color: "#10b981",
                padding: "0",
                height: "auto",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Mot de passe oublié ?
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Login
