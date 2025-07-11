"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Form, Input, Button, Select, Alert, message, Divider } from "antd"
import { UserOutlined, MailOutlined, LockOutlined, TeamOutlined } from "@ant-design/icons"
import { useAuth } from "../../contexts/AuthContext"

const { Option } = Select

const Register = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { register } = useAuth()
  const navigate = useNavigate()

  const onFinish = async (values) => {
    try {
      setLoading(true)
      setError(null)

      const success = await register(values)
      if (success) {
        message.success("Inscription réussie ! Bienvenue dans OCP LiqaaSpace.")
        navigate("/")
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error)

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
        const errorMessage = error.response?.data?.message || "Une erreur est survenue lors de l'inscription"
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
          message="Erreur d'inscription"
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
        <Form form={form} name="register" onFinish={onFinish} layout="vertical" size="large">
          <Form.Item
            name="name"
            label={<span style={{ color: "#374151", fontWeight: "500" }}>Nom complet</span>}
            rules={[
              {
                required: true,
                message: "Veuillez saisir votre nom !",
              },
              {
                min: 2,
                message: "Le nom doit contenir au moins 2 caractères !",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#10b981" }} />}
              placeholder="Votre nom complet"
              style={{
                borderRadius: "8px",
                height: "48px",
                borderColor: "#d1fae5",
                background: "#f0fdf4",
              }}
            />
          </Form.Item>

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
              {
                min: 8,
                message: "Le mot de passe doit contenir au moins 8 caractères !",
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

          <Form.Item
            name="password_confirmation"
            label={<span style={{ color: "#374151", fontWeight: "500" }}>Confirmer le mot de passe</span>}
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Veuillez confirmer votre mot de passe !",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error("Les mots de passe ne correspondent pas !"))
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#10b981" }} />}
              placeholder="Confirmez votre mot de passe"
              style={{
                borderRadius: "8px",
                height: "48px",
                borderColor: "#d1fae5",
                background: "#f0fdf4",
              }}
            />
          </Form.Item>

          <Form.Item
            name="role"
            label={<span style={{ color: "#374151", fontWeight: "500" }}>Rôle dans OCP</span>}
            initialValue="collaborateur"
            rules={[
              {
                required: true,
                message: "Veuillez sélectionner votre rôle !",
              },
            ]}
          >
            <Select
              placeholder="Sélectionnez votre rôle"
              style={{
                borderRadius: "8px",
              }}
              suffixIcon={<TeamOutlined style={{ color: "#10b981" }} />}
            >
              <Option value="collaborateur">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <UserOutlined style={{ color: "#10b981" }} />
                  Collaborateur OCP
                </div>
              </Option>
              <Option value="responsable">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <TeamOutlined style={{ color: "#10b981" }} />
                  Responsable OCP
                </div>
              </Option>
            </Select>
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
              {loading ? "Inscription en cours..." : "Rejoindre OCP LiqaaSpace"}
            </Button>
          </Form.Item>

          <Divider style={{ borderColor: "#d1fae5" }} />

          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
              En vous inscrivant, vous acceptez les{" "}
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
                conditions d'utilisation OCP
              </Button>
            </p>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Register
