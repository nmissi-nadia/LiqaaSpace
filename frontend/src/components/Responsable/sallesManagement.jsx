import { useState, useEffect } from "react"
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Card,
  Space,
  Tooltip,
  Tag,
  Typography,
  Row,
  Col,
  Image,
  message,
  Popconfirm,
  Badge,
  Divider,
} from "antd"
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CloudUploadOutlined,
  HomeOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons"
import api from "../../services/api"

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select
const { Dragger } = Upload

const statusConfig = {
  active: {
    color: "green",
    icon: <CheckCircleOutlined />,
    text: "Active",
  },
  inactive: {
    color: "orange",
    icon: <ExclamationCircleOutlined />,
    text: "Inactive",
  },
  maintenance: {
    color: "red",
    icon: <CloseCircleOutlined />,
    text: "En maintenance",
  },
}

const SallesManagement = () => {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState([])
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState("")
  const [submitLoading, setSubmitLoading] = useState(false)

  const fetchRooms = async () => {
    try {
      setLoading(true)
      const response = await api.get("/api/salles")
      setRooms(response.data)
    } catch (error) {
      console.error("Erreur de chargement:", error)
      message.error("Erreur lors du chargement des salles")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const handleOpenModal = (room = null) => {
    if (room) {
      setEditingRoom(room.id)
      form.setFieldsValue({
        nom: room.nom,
        description: room.description || "",
        capacite: room.capacite,
        location: room.location,
        status: room.status,
      })

      // Gérer les images existantes
      if (room.images) {
        let images = []
        try {
          images = typeof room.images === "string" ? JSON.parse(room.images) : room.images
        } catch (e) {
          console.error("Erreur parsing images:", e)
        }

        const existingFiles = images.map((img, index) => ({
          uid: `existing-${index}`,
          name: `image-${index}`,
          status: "done",
          url: typeof img === "string" ? `/storage/${img}` : img.url,
        }))
        setFileList(existingFiles)
      }
    } else {
      setEditingRoom(null)
      form.resetFields()
      setFileList([])
    }
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setEditingRoom(null)
    form.resetFields()
    setFileList([])
  }

  const handleSubmit = async (values) => {
    try {
      setSubmitLoading(true)
      const formData = new FormData()

      // Ajouter les champs du formulaire
      Object.keys(values).forEach((key) => {
        if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key])
        }
      })

      // Ajouter les nouvelles images
      fileList.forEach((file, index) => {
        if (file.originFileObj) {
          formData.append(`images[${index}]`, file.originFileObj)
        } else if (file.url && file.uid.startsWith("existing-")) {
          formData.append("existing_images[]", file.url)
        }
      })

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }

      if (editingRoom) {
        await api.put(`/api/salles/${editingRoom}`, formData, config)
        message.success("Salle modifiée avec succès")
      } else {
        await api.post("/api/salles", formData, config)
        message.success("Salle ajoutée avec succès")
      }

      handleCloseModal()
      fetchRooms()
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      message.error(error.response?.data?.message || "Erreur lors de la sauvegarde")
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDeleteRoom = async (id) => {
    try {
      await api.delete(`/api/salles/${id}`)
      message.success("Salle supprimée avec succès")
      fetchRooms()
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      message.error("Erreur lors de la suppression")
    }
  }

  const uploadProps = {
    name: "file",
    multiple: true,
    fileList,
    listType: "picture-card",
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/")
      if (!isImage) {
        message.error("Vous ne pouvez télécharger que des images!")
        return false
      }

      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        message.error("L'image doit faire moins de 5MB!")
        return false
      }

      if (fileList.length >= 5) {
        message.error("Vous ne pouvez télécharger que 5 images maximum!")
        return false
      }

      return false // Empêcher l'upload automatique
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList.slice(-5)) // Limiter à 5 images
    },
    onPreview: (file) => {
      setPreviewImage(file.url || file.preview)
      setPreviewVisible(true)
    },
    onRemove: (file) => {
      setFileList((prev) => prev.filter((item) => item.uid !== file.uid))
    },
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Ajouter</div>
    </div>
  )

  const columns = [
    {
      title: "Nom",
      dataIndex: "nom",
      key: "nom",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <HomeOutlined style={{ color: "#10b981" }} />
          <Text strong>{text}</Text>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <Text style={{ maxWidth: "200px", display: "block" }} ellipsis={{ tooltip: text }}>
          {text || "-"}
        </Text>
      ),
    },
    {
      title: "Capacité",
      dataIndex: "capacite",
      key: "capacite",
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <TeamOutlined style={{ color: "#10b981" }} />
          <Text>{text} personnes</Text>
        </div>
      ),
    },
    {
      title: "Localisation",
      dataIndex: "location",
      key: "location",
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <EnvironmentOutlined style={{ color: "#10b981" }} />
          <Text>{text}</Text>
        </div>
      ),
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const config = statusConfig[status] || statusConfig.active
        return (
          <Tag icon={config.icon} color={config.color}>
            {config.text}
          </Tag>
        )
      },
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title="Modifier">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleOpenModal(record)}
              style={{ color: "#10b981" }}
            />
          </Tooltip>
          <Popconfirm
            title="Supprimer la salle"
            description="Êtes-vous sûr de vouloir supprimer cette salle ?"
            onConfirm={() => handleDeleteRoom(record.id)}
            okText="Oui"
            cancelText="Non"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Supprimer">
              <Button type="text" icon={<DeleteOutlined />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const getStatusCounts = () => {
    return {
      total: rooms.length,
      active: rooms.filter((r) => r.status === "active").length,
      inactive: rooms.filter((r) => r.status === "inactive").length,
      maintenance: rooms.filter((r) => r.status === "maintenance").length,
    }
  }

  const statusCounts = getStatusCounts()

  return (
    <div
      style={{
        padding: "24px",
        background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
        minHeight: "100vh",
      }}
    >
      {/* En-tête avec statistiques */}
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
        

        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <Card size="small" className="text-center">
              <Badge count={statusCounts.total} style={{ backgroundColor: "#10b981" }}>
                <div style={{ padding: "8px" }}>
                  <Text strong>Total</Text>
                </div>
              </Badge>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small" className="text-center">
              <Badge count={statusCounts.active} style={{ backgroundColor: "#10b981" }}>
                <div style={{ padding: "8px" }}>
                  <Text strong>Actives</Text>
                </div>
              </Badge>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small" className="text-center">
              <Badge count={statusCounts.inactive} style={{ backgroundColor: "#f59e0b" }}>
                <div style={{ padding: "8px" }}>
                  <Text strong>Inactives</Text>
                </div>
              </Badge>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small" className="text-center">
              <Badge count={statusCounts.maintenance} style={{ backgroundColor: "#ef4444" }}>
                <div style={{ padding: "8px" }}>
                  <Text strong>Maintenance</Text>
                </div>
              </Badge>
            </Card>
          </Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
            size="large"
            style={{
              borderRadius: "12px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              border: "none",
              height: "48px",
              paddingLeft: "24px",
              paddingRight: "24px",
              marginRight: "16px",
            }}
          >
            Ajouter une salle
          </Button>
        </Row>
      </div>

      {/* Table des salles */}
      <Card
        style={{
          borderRadius: "16px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(16, 185, 129, 0.1)",
        }}
      >
        <Table
          columns={columns}
          dataSource={rooms}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} salles`,
          }}
          scroll={{ x: 800 }}
          rowClassName="hover:bg-emerald-50"
        />
      </Card>

      {/* Modal d'ajout/modification */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 0" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <HomeOutlined style={{ color: "white", fontSize: "20px" }} />
            </div>
            <div>
              <Title level={4} style={{ margin: 0, color: "#1f2937" }}>
                {editingRoom ? "Modifier la salle" : "Ajouter une nouvelle salle"}
              </Title>
              <Text type="secondary">
                {editingRoom
                  ? "Modifiez les informations de la salle"
                  : "Remplissez les informations de la nouvelle salle"}
              </Text>
            </div>
          </div>
        }
        open={modalVisible}
        onCancel={handleCloseModal}
        width={800}
        footer={null}
        style={{ top: 20 }}
        bodyStyle={{ padding: "24px" }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
          <Row gutter={[24, 16]}>
            {/* Informations de base */}
            <Col span={24}>
              <Card
                title={
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <HomeOutlined style={{ color: "#10b981" }} />
                    <span>Informations de base</span>
                  </div>
                }
                size="small"
                style={{ marginBottom: "16px" }}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="nom"
                      label="Nom de la salle"
                      rules={[{ required: true, message: "Le nom est requis" }]}
                    >
                      <Input placeholder="Ex: Salle de conférence A1" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="capacite"
                      label="Capacité"
                      rules={[{ required: true, message: "La capacité est requise" }]}
                    >
                      <InputNumber
                        min={1}
                        max={1000}
                        placeholder="Nombre de personnes"
                        style={{ width: "100%" }}
                        addonAfter="personnes"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name="description" label="Description">
                      <TextArea
                        rows={3}
                        placeholder="Description détaillée de la salle, équipements disponibles..."
                        showCount
                        maxLength={500}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Localisation et statut */}
            <Col span={24}>
              <Card
                title={
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <EnvironmentOutlined style={{ color: "#10b981" }} />
                    <span>Localisation et statut</span>
                  </div>
                }
                size="small"
                style={{ marginBottom: "16px" }}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="location"
                      label="Bâtiment"
                      rules={[{ required: true, message: "La localisation est requise" }]}
                    >
                      <Select placeholder="Sélectionnez un bâtiment">
                        <Option value="Bâtiment A">Bâtiment A</Option>
                        <Option value="Bâtiment B">Bâtiment B</Option>
                        <Option value="Bâtiment C">Bâtiment C</Option>
                        <Option value="Bâtiment D">Bâtiment D</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="status"
                      label="Statut"
                      rules={[{ required: true, message: "Le statut est requis" }]}
                    >
                      <Select placeholder="Sélectionnez un statut">
                        <Option value="active">
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <CheckCircleOutlined style={{ color: "#10b981" }} />
                            Active
                          </div>
                        </Option>
                        <Option value="inactive">
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <ExclamationCircleOutlined style={{ color: "#f59e0b" }} />
                            Inactive
                          </div>
                        </Option>
                        <Option value="maintenance">
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <CloseCircleOutlined style={{ color: "#ef4444" }} />
                            En maintenance
                          </div>
                        </Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Images */}
            <Col span={24}>
              <Card
                title={
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CloudUploadOutlined style={{ color: "#10b981" }} />
                    <span>Images de la salle</span>
                    <Badge count={fileList.length} style={{ backgroundColor: "#10b981" }} />
                  </div>
                }
                size="small"
                style={{ marginBottom: "24px" }}
              >
                <Upload {...uploadProps}>{fileList.length >= 5 ? null : uploadButton}</Upload>
                <Text type="secondary" style={{ fontSize: "12px", marginTop: "8px", display: "block" }}>
                  Formats acceptés: JPG, PNG, JPEG • Taille max: 5MB • Maximum 5 images
                </Text>
              </Card>
            </Col>
          </Row>

          <Divider />

          {/* Boutons d'action */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <Button size="large" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={submitLoading}
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                border: "none",
                borderRadius: "8px",
                paddingLeft: "32px",
                paddingRight: "32px",
              }}
            >
              {editingRoom ? "Mettre à jour" : "Ajouter la salle"}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Modal de prévisualisation d'image */}
      <Modal open={previewVisible} title="Aperçu de l'image" footer={null} onCancel={() => setPreviewVisible(false)}>
        <Image alt="Aperçu" style={{ width: "100%" }} src={previewImage || "/placeholder.svg"} />
      </Modal>
    </div>
  )
}

export default SallesManagement
