import { useState, useEffect } from "react"
import {
  Table,
  Button,
  Tag,
  Input,
  Select,
  Modal,
  Avatar,
  Space,
  Tooltip,
  Card,
  Row,
  Col,
  Typography,
  Descriptions,
  message,
  Badge,
} from "antd"
import {
  SearchOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
  HomeOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import axios from "axios"

const { Title, Text } = Typography
const { Option } = Select

const statusConfig = {
  "en attente": {
    color: "orange",
    icon: <ExclamationCircleOutlined />,
    text: "En attente",
  },
  "accepté": {
    color: "green",
    icon: <CheckCircleOutlined />,
    text: "Accepté",
  },
  "refusé": {
    color: "red",
    icon: <CloseCircleOutlined />,
    text: "Refusé",
  },
  "confirmé": {
    color: "blue",
    icon: <CheckCircleOutlined />,
    text: "Confirmé",
  },
  "annulé": {
    color: "default",
    icon: <CloseCircleOutlined />,
    text: "Annulé",
  },
  "approuvee": {
    color: "green",
    icon: <CheckCircleOutlined />,
    text: "Approuvée",
  },
  "rejetee": {
    color: "red",
    icon: <CloseCircleOutlined />,
    text: "Rejetée",
  },
}

const ReservationsManagement = () => {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [actionLoading, setActionLoading] = useState({})

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:8000/api/reservations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      setReservations(response.data)
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error)
      message.error("Erreur lors du chargement des réservations")
    } finally {
      setLoading(false)
    }
  }

  const buildUpdatePayload = (record, newStatut) => ({
    salle_id: record.salle?.id,
    collaborateur_id: record.collaborateur?.id,
    heure_debut: record.heure_debut || record.date,
    heure_fin: record.heure_fin || record.date,
    statut: newStatut,
  })

  const handleStatusUpdate = async (record, newStatut) => {
    try {
      setActionLoading((prev) => ({ ...prev, [record.id]: true }))
      await axios.put(
        `http://localhost:8000/api/reservations/${record.id}`,
        buildUpdatePayload(record, newStatut),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      )
      message.success(`Statut changé en ${newStatut}`)
      fetchReservations()
      if (selectedReservation?.id === record.id) {
        setSelectedReservation({ ...selectedReservation, statut: newStatut })
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error)
      message.error("Erreur lors de la mise à jour du statut")
    } finally {
      setActionLoading((prev) => ({ ...prev, [record.id]: false }))
    }
  }

  const handleOpenModal = (reservation) => {
    setSelectedReservation(reservation)
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setSelectedReservation(null)
  }

  const filteredReservations = reservations
    .filter(
      (reservation) =>
        (reservation.salle?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservation.collaborateur?.name?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === "all" || reservation.statut === statusFilter),
    )
    .sort((a, b) => new Date(b.heure_debut || b.date) - new Date(a.heure_debut || a.date))

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "PPP", { locale: fr })
    } catch (error) {
      return dateString
    }
  }

  const formatTime = (timeString) => {
    try {
      return format(parseISO(`2000-01-01T${timeString}`), "HH:mm")
    } catch (error) {
      return timeString
    }
  }

  const getTimeRange = (start, end) => {
    return `${formatTime(start)} - ${formatTime(end)}`
  }

  const columns = [
    {
      title: "Salle",
      dataIndex: ["salle", "nom"],
      key: "salle",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <HomeOutlined style={{ color: "#10b981" }} />
          <Text strong>{record.salle?.nom}</Text>
        </div>
      ),
    },
    {
      title: "Demandeur",
      dataIndex: ["collaborateur", "name"],
      key: "collaborateur",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Avatar size={32} className="bg-emerald-500">
            {record.collaborateur?.name?.charAt(0)?.toUpperCase() || "?"}
          </Avatar>
          <div>
            <Text strong>{record.collaborateur?.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.collaborateur?.email}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Date et heure",
      dataIndex: "heure_debut",
      key: "heure_debut",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ClockCircleOutlined style={{ color: "#10b981" }} />
          <div>
            <Text>{formatDate(record.heure_debut || record.date)}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {getTimeRange(record.heure_debut, record.heure_fin)}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Motif",
      dataIndex: "motif",
      key: "motif",
      render: (text) => (
        <Tooltip title={text}>
          <Text
            style={{
              maxWidth: "200px",
              display: "block",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {text}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      align: "center",
      render: (statut) => {
        const config = statusConfig[statut] || statusConfig["en attente"]
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
          <Tooltip title="Voir les détails">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleOpenModal(record)}
              style={{ color: "#10b981" }}
            />
          </Tooltip>
          <Select
            value={record.statut}
            style={{ width: 120 }}
            onChange={(value) => handleStatusUpdate(record, value)}
            loading={actionLoading[record.id]}
          >
            <Option value="en attente">En attente</Option>
            <Option value="accepté">Accepté</Option>
            <Option value="refusé">Refusé</Option>
          </Select>
        </Space>
      ),
    },
  ]

  const getStatusCounts = () => {
    const counts = {
      total: reservations.length,
      pending: reservations.filter((r) => r.statut === "en attente").length,
      approved: reservations.filter((r) => r.statut === "accepté").length,
      rejected: reservations.filter((r) => r.statut === "refusé").length,
    }
    return counts
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
        <Title
          level={2}
          style={{
            margin: "0 0 16px 0",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "28px",
            fontWeight: "bold",
          }}
        >
          Gestion des Réservations
        </Title>

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
              <Badge count={statusCounts.pending} style={{ backgroundColor: "#f59e0b" }}>
                <div style={{ padding: "8px" }}>
                  <Text strong>En attente</Text>
                </div>
              </Badge>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small" className="text-center">
              <Badge count={statusCounts.approved} style={{ backgroundColor: "#10b981" }}>
                <div style={{ padding: "8px" }}>
                  <Text strong>Approuvées</Text>
                </div>
              </Badge>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card size="small" className="text-center">
              <Badge count={statusCounts.rejected} style={{ backgroundColor: "#ef4444" }}>
                <div style={{ padding: "8px" }}>
                  <Text strong>Rejetées</Text>
                </div>
              </Badge>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Filtres et recherche */}
      <Card
        style={{
          marginBottom: "24px",
          borderRadius: "16px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(16, 185, 129, 0.1)",
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Input
              placeholder="Rechercher par salle ou demandeur..."
              prefix={<SearchOutlined style={{ color: "#10b981" }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderRadius: "8px" }}
            />
          </Col>
          <Col xs={24} md={6}>
            <Select
              placeholder="Filtrer par statut"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%", borderRadius: "8px" }}
            >
              <Option value="all">Tous les statuts</Option>
              <Option value="en attente">En attente</Option>
              <Option value="accepté">Accepté</Option>
              <Option value="refusé">Refusé</Option>
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <Button
              type="primary"
              icon={<CalendarOutlined />}
              style={{
                width: "100%",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                border: "none",
              }}
            >
              Voir le calendrier
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Table des réservations */}
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
          dataSource={filteredReservations}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} sur ${total} réservations`,
          }}
          scroll={{ x: 800 }}
          rowClassName="hover:bg-emerald-50"
        />
      </Card>

      {/* Modal de détails */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CalendarOutlined style={{ color: "#10b981" }} />
            <span>Détails de la réservation</span>
          </div>
        }
        open={modalVisible}
        onCancel={handleCloseModal}
        width={600}
        footer={
          selectedReservation
            ? [
                <Select
                  key="statut"
                  value={selectedReservation.statut}
                  style={{ width: 160, marginRight: 8 }}
                  onChange={(value) => handleStatusUpdate(selectedReservation, value)}
                  loading={actionLoading[selectedReservation.id]}
                >
                  <Option value="en attente">En attente</Option>
                  <Option value="accepté">Accepté</Option>
                  <Option value="refusé">Refusé</Option>
                </Select>,
                <Button key="close" onClick={handleCloseModal}>
                  Fermer
                </Button>,
              ]
            : null
        }
      >
        {selectedReservation && (
          <div style={{ padding: "16px 0" }}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item
                label={
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <HomeOutlined /> Salle
                  </span>
                }
              >
                <div>
                  <Text strong>{selectedReservation.salle?.nom}</Text>
                  <br />
                  <Text type="secondary">Capacité: {selectedReservation.salle?.capacite} personnes</Text>
                </div>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <UserOutlined /> Demandeur
                  </span>
                }
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Avatar size={40} className="bg-emerald-500">
                    {selectedReservation.collaborateur?.name?.charAt(0)?.toUpperCase() || "?"}
                  </Avatar>
                  <div>
                    <Text strong>{selectedReservation.collaborateur?.name}</Text>
                    <br />
                    <Text type="secondary">{selectedReservation.collaborateur?.email}</Text>
                  </div>
                </div>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <CalendarOutlined /> Date
                  </span>
                }
              >
                {formatDate(selectedReservation.heure_debut || selectedReservation.date)}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <ClockCircleOutlined /> Horaire
                  </span>
                }
              >
                {getTimeRange(selectedReservation.heure_debut, selectedReservation.heure_fin)}
              </Descriptions.Item>

              <Descriptions.Item label="Motif">{selectedReservation.motif}</Descriptions.Item>

              <Descriptions.Item label="Statut">
                {(() => {
                  const config = statusConfig[selectedReservation.statut] || statusConfig["en attente"]
                  return (
                    <Tag icon={config.icon} color={config.color}>
                      {config.text}
                    </Tag>
                  )
                })()}
              </Descriptions.Item>

              {selectedReservation.notes && (
                <Descriptions.Item label="Notes">
                  <Text type="secondary">{selectedReservation.notes}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ReservationsManagement
