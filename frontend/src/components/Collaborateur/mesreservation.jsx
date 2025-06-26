import { useState, useEffect } from "react"
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Card,
  Space,
  Tooltip,
  Tag,
  Typography,
  Row,
  Col,
  Badge,
  message,
  Popconfirm,
  Empty,
  Select,
} from "antd"
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import moment from "moment"
import axios from "axios"

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select
const { RangePicker } = TimePicker

const statusConfig = {
  "en attente": {
    color: "orange",
    icon: <ExclamationCircleOutlined />,
    text: "En attente",
    bgColor: "#fff7e6",
  },
  approuvee: {
    color: "green",
    icon: <CheckCircleOutlined />,
    text: "Approuvée",
    bgColor: "#f6ffed",
  },
  rejetee: {
    color: "red",
    icon: <CloseCircleOutlined />,
    text: "Rejetée",
    bgColor: "#fff2f0",
  },
}

const MesReservations = () => {
  const [reservations, setReservations] = useState([])
  const [salles, setSalles] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [detailsModalVisible, setDetailsModalVisible] = useState(false)
  const [editingReservation, setEditingReservation] = useState(null)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [form] = Form.useForm()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")


  const fetchReservations = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:8000/api/reservations/collaborateur`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      setReservations(Array.isArray(response.data) ? response.data : response.data.data || [])
    } catch (error) {
      console.error("Erreur de chargement des réservations:", error)
      message.error("Erreur lors du chargement des réservations")
    } finally {
      setLoading(false)
    }
  }

  const fetchSalles = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/salles", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      setSalles(response.data.filter((salle) => salle.status === "active"))
    } catch (error) {
      console.error("Erreur de chargement des salles:", error)
      message.error("Erreur lors du chargement des salles")
    }
  }

  useEffect(() => {
    fetchReservations()
    fetchSalles()
  }, [])

  const handleOpenModal = (reservation = null) => {
    if (reservation) {
      setEditingReservation(reservation.id)
      form.setFieldsValue({
        salle_id: reservation.salle_id,
        date: moment(reservation.date),
        heure_debut: moment(reservation.heure_debut, "HH:mm"),
        heure_fin: moment(reservation.heure_fin, "HH:mm"),
        motif: reservation.motif,
      })
    } else {
      setEditingReservation(null)
      form.resetFields()
    }
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setEditingReservation(null)
    form.resetFields()
  }

  const handleOpenDetailsModal = (reservation) => {
    setSelectedReservation(reservation)
    setDetailsModalVisible(true)
  }

  const handleCloseDetailsModal = () => {
    setDetailsModalVisible(false)
    setSelectedReservation(null)
  }

  const handleSubmit = async (values) => {
    try {
      setSubmitLoading(true)
      const data = {
        salle_id: values.salle_id,
        date: values.date.format("YYYY-MM-DD"),
        heure_debut: values.heure_debut.format("HH:mm"),
        heure_fin: values.heure_fin.format("HH:mm"),
        motif: values.motif,
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
          'Accept': 'application/json'
        }
      }

      if (editingReservation) {
        await axios.put(`http://localhost:8000/api/reservations/${editingReservation}`, data, config)
        message.success("Réservation modifiée avec succès")
      } else {
        console.log(data)
        await axios.post("http://localhost:8000/api/reservations", data, config)
        message.success("Réservation créée avec succès")
      }

      handleCloseModal()
      fetchReservations()
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      message.error(error.response?.data?.message || "Erreur lors de la sauvegarde")
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDeleteReservation = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/reservations/${id}`,{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
          'Accept': 'application/json'
        }
      })
      message.success("Réservation annulée avec succès")
      fetchReservations()
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error)
      message.error("Erreur lors de l'annulation de la réservation")
    }
  }

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

  const filteredReservations = reservations.filter((reservation) => {
    if (statusFilter === "all") return true
    return reservation.status === statusFilter
  })

  const columns = [
    {
      title: "Salle",
      dataIndex: ["salle", "nom"],
      key: "salle",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <HomeOutlined style={{ color: "#10b981" }} />
          <div>
            <Text strong>{record.salle?.nom}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.salle?.location}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Date et heure",
      dataIndex: "date",
      key: "date",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ClockCircleOutlined style={{ color: "#10b981" }} />
          <div>
            <Text>{formatDate(record.date)}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {getTimeRange(record.heure_debut, record.heure_fin)}
            </Text>
          </div>
        </div>
      ),
    },
   
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => {
        const config = statusConfig[status] || statusConfig["en attente"]
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
              onClick={() => handleOpenDetailsModal(record)}
              style={{ color: "#10b981" }}
            />
          </Tooltip>
          {(record.status === "en attente" || record.status === "accepté") && (
            <Tooltip title="Modifier">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleOpenModal(record)}
                style={{ color: "#10b981" }}
              />
            </Tooltip>
          )}
          {record.status !== "accepté" && (
            <Popconfirm
              title="Annuler la réservation"
              description="Êtes-vous sûr de vouloir annuler cette réservation ?"
              onConfirm={() => handleDeleteReservation(record.id)}
              okText="Oui"
              cancelText="Non"
              okButtonProps={{ danger: true }}
            >
              <Tooltip title="Annuler">
                <Button type="text" icon={<DeleteOutlined />} danger />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  const getStatusCounts = () => {
    return {
      total: reservations.length,
      pending: reservations.filter((r) => r.status === "en attente").length,
      approved: reservations.filter((r) => r.status === "accepté").length,
      rejected: reservations.filter((r) => r.status === "refusé").length,
    }
  }

  const statusCounts = getStatusCounts()

  return (
    <>
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
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
              Mes Réservations
            </Title>

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
              }}
            >
              Nouvelle réservation
            </Button>
          </div>

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
                    <Text strong>Acceptées</Text>
                  </div>
                </Badge>
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card size="small" className="text-center">
                <Badge count={statusCounts.rejected} style={{ backgroundColor: "#ef4444" }}>
                  <div style={{ padding: "8px" }}>
                    <Text strong>Refusées</Text>
                  </div>
                </Badge>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Filtres */}
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
            <Col xs={24} md={8}>
              <Select
                placeholder="Filtrer par statut"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: "100%" }}
                suffixIcon={<SearchOutlined style={{ color: "#10b981" }} />}
              >
                <Option value="all">Tous les statuts</Option>
                <Option value="en attente">En attente</Option>
                <Option value="accepté">Accepté</Option>
                <Option value="refusé">Refusé</Option>
              </Select>
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
          {filteredReservations.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <Text type="secondary">Aucune réservation trouvée</Text>
                  <br />
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => handleOpenModal()}
                    style={{
                      marginTop: "16px",
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      border: "none",
                    }}
                  >
                    Créer ma première réservation
                  </Button>
                </div>
              }
            />
          ) : (
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
          )}
        </Card>

        {/* Modal de création/modification */}
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
                <CalendarOutlined style={{ color: "white", fontSize: "20px" }} />
              </div>
              <div>
                <Title level={4} style={{ margin: 0, color: "#1f2937" }}>
                  {editingReservation ? "Modifier la réservation" : "Nouvelle réservation"}
                </Title>
                <Text type="secondary">
                  {editingReservation
                    ? "Modifiez les détails de votre réservation"
                    : "Réservez une salle pour votre événement"}
                </Text>
              </div>
            </div>
          }
          open={modalVisible}
          onCancel={handleCloseModal}
          width={600}
          footer={null}
          style={{ top: 20 }}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit} size="large" style={{ marginTop: "24px" }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item
                  name="salle_id"
                  label="Salle"
                  rules={[{ required: true, message: "Veuillez sélectionner une salle" }]}
                >
                  <Select placeholder="Sélectionnez une salle" size="large">
                    {salles.map((salle) => (
                      <Option key={salle.id} value={salle.id}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <HomeOutlined style={{ color: "#10b981" }} />
                          <div>
                            <Text strong>{salle.nom}</Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              {salle.location} • {salle.capacite} personnes
                            </Text>
                          </div>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              

              <Col span={24}>
                <Form.Item
                  name="date"
                  label="Date"
                  rules={[{ required: true, message: "Veuillez sélectionner une date" }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    disabledDate={(current) => current && current < moment().startOf("day")}
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="heure_debut"
                  label="Heure de début"
                  rules={[{ required: true, message: "Veuillez sélectionner l'heure de début" }]}
                >
                  <TimePicker
                    format="HH:mm"
                    style={{ width: "100%" }}
                    minuteStep={15}
                    size="large"
                    placeholder="Heure de début"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="heure_fin"
                  label="Heure de fin"
                  rules={[{ required: true, message: "Veuillez sélectionner l'heure de fin" }]}
                >
                  <TimePicker
                    format="HH:mm"
                    style={{ width: "100%" }}
                    minuteStep={15}
                    size="large"
                    placeholder="Heure de fin"
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="motif"
                  label="Motif de la réservation"
                  rules={[{ required: true, message: "Veuillez indiquer le motif" }]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Décrivez brièvement l'objet de votre réservation..."
                    showCount
                    maxLength={500}
                  />
                </Form.Item>
              </Col>
            </Row>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
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
                {editingReservation ? "Mettre à jour" : "Réserver"}
              </Button>
            </div>
          </Form>
        </Modal>

        {/* Modal de détails */}
        <Modal
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CalendarOutlined style={{ color: "#10b981" }} />
              <span>Détails de la réservation</span>
            </div>
          }
          open={detailsModalVisible}
          onCancel={handleCloseDetailsModal}
          width={500}
          footer={[
            <Button key="close" onClick={handleCloseDetailsModal}>
              Fermer
            </Button>,
          ]}
        >
          {selectedReservation && (
            <div style={{ padding: "16px 0" }}>
              <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Card size="small" style={{ background: statusConfig[selectedReservation.status]?.bgColor }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {statusConfig[selectedReservation.status]?.icon}
                    <Text strong>{statusConfig[selectedReservation.status]?.text}</Text>
                  </div>
                </Card>

                <div>
                  <Text type="secondary">Salle</Text>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                    <HomeOutlined style={{ color: "#10b981" }} />
                    <div>
                      <Text strong>{selectedReservation.salle?.nom}</Text>
                      <br />
                      <Text type="secondary">{selectedReservation.salle?.location}</Text>
                    </div>
                  </div>
                </div>

                <div>
                  <Text type="secondary">Date et heure</Text>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                    <ClockCircleOutlined style={{ color: "#10b981" }} />
                    <div>
                      <Text strong>{formatDate(selectedReservation.date)}</Text>
                      <br />
                      <Text>{getTimeRange(selectedReservation.heure_debut, selectedReservation.heure_fin)}</Text>
                    </div>
                  </div>
                </div>

                <div>
                  <Text type="secondary">Motif</Text>
                  <div style={{ marginTop: "4px" }}>
                    <Text>{selectedReservation.motif}</Text>
                  </div>
                </div>
              </Space>
            </div>
          )}
        </Modal>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .ant-card, .ant-table-wrapper {
            margin-bottom: 16px !important;
            min-width: 0 !important;
            max-width: 100% !important;
          }
          .ant-card-body {
            padding: 12px !important;
          }
          .ant-typography, .ant-typography h2, .ant-typography h3, .ant-typography h4 {
            font-size: 16px !important;
          }
          .ant-table {
            font-size: 13px !important;
          }
          .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
            padding: 8px 4px !important;
          }
          .ant-row {
            flex-direction: column !important;
          }
          .ant-col {
            width: 100% !important;
            max-width: 100% !important;
          }
          .ant-modal {
            width: 98vw !important;
            max-width: 98vw !important;
          }
        }
        @media (max-width: 480px) {
          .ant-card, .ant-table-wrapper {
            margin-bottom: 8px !important;
            border-radius: 8px !important;
          }
          .ant-card-body {
            padding: 8px !important;
          }
          .ant-typography, .ant-typography h2, .ant-typography h3, .ant-typography h4 {
            font-size: 14px !important;
          }
          .ant-table {
            font-size: 12px !important;
          }
          .ant-modal {
            padding: 0 !important;
          }
        }
      `}</style>
    </>
  )
}

export default MesReservations
