import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Tag, 
  Button, 
  Space, 
  Spin, 
  Alert, 
  Descriptions, 
  Image,
  Modal,
  Form,
  DatePicker,
  TimePicker,
  message,
  Input
} from 'antd';
import { 
  EnvironmentOutlined, 
  UserOutlined, 
  ClockCircleOutlined, 
  WifiOutlined, 
  DesktopOutlined, 
  SoundOutlined,
  ArrowLeftOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = TimePicker;

const DetailsSalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salle, setSalle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [reservationLoading, setReservationLoading] = useState(false);

  useEffect(() => {
    const fetchSalleDetails = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          navigate('/auth');
          return;
        }

        const response = await axios.get(`http://localhost:8000/api/salles/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setSalle(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement des détails de la salle:', err);
        setError('Impossible de charger les détails de la salle');
      } finally {
        setLoading(false);
      }
    };

    fetchSalleDetails();
  }, [id, navigate]);

  const handleReservation = () => {
    setIsModalVisible(true);
  };

  const handleSubmitReservation = async (values) => {
    try {
      setReservationLoading(true);
      const token = localStorage.getItem('access_token');
      
      const reservationData = {
        salle_id: id,
        date: values.date.format('YYYY-MM-DD'),
        heure_debut: values.heure[0].format('HH:mm'),
        heure_fin: values.heure[1].format('HH:mm'),
        motif: values.motif || 'Réunion'
      };

      await axios.post('http://localhost:8000/api/reservations', reservationData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      message.success('Réservation effectuée avec succès !');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      message.error(error.response?.data?.message || 'Erreur lors de la réservation');
    } finally {
      setReservationLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Erreur"
          description={error}
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          }
        />
      </div>
    );
  }

  if (!salle) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Information"
          description="Aucune salle trouvée avec cet identifiant."
          type="info"
          showIcon
        />
      </div>
    );
  }

  const equipmentIcons = [
    salle.wifi && { icon: <WifiOutlined />, text: 'WiFi' },
    salle.projecteur && { icon: <DesktopOutlined />, text: 'Projecteur' },
    salle.systeme_audio && { icon: <SoundOutlined />, text: 'Système audio' },
  ].filter(Boolean);

  return (
    <>
      <div>
        <div style={{ padding: '24px' }}>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)}
            style={{ marginBottom: '16px' }}
          >
            Retour
          </Button>

          <Card
            title={
              <Title level={2} style={{ margin: 0 }}>
                {salle.nom}
              </Title>
            }
            extra={
              <Tag color={salle.status === 'active' ? 'success' : 'error'}>
                {salle.status === 'active' ? 'Disponible' : 'Indisponible'}
              </Tag>
            }
            style={{ borderRadius: '8px', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)' }}
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} md={14}>
                <Image
                  src={salle.image_url || 'https://via.placeholder.com/1000x500?text=Sans+image'}
                  alt={salle.nom}
                  style={{ width: '100%', borderRadius: '8px' }}
                  preview={false}
                />
                
                <div style={{ marginTop: '24px' }}>
                  <Title level={4}>Description</Title>
                  <Paragraph>{salle.description || 'Aucune description disponible.'}</Paragraph>
                  
                  <Title level={4} style={{ marginTop: '24px' }}>Équipements</Title>
                  <Space size="middle" style={{ marginTop: '8px' }}>
                    {equipmentIcons.length > 0 ? (
                      equipmentIcons.map((item, index) => (
                        <Tag key={index} icon={item.icon}>
                          {item.text}
                        </Tag>
                      ))
                    ) : (
                      <Text type="secondary">Aucun équipement spécifique</Text>
                    )}
                  </Space>
                </div>
              </Col>
              
              <Col xs={24} md={10}>
                <Card 
                  title="Détails de la salle"
                  style={{ marginBottom: '24px' }}
                >
                  <Descriptions column={1}>
                  <Descriptions.Item
                      label={
                      <>
                          <EnvironmentOutlined /> Localisation
                      </>
                      }
                  >
                      {salle.localisation || 'Non spécifiée'}
                  </Descriptions.Item>

                  <Descriptions.Item
                      label={
                      <>
                          <UserOutlined /> Capacité
                      </>
                      }
                  >
                      {salle.capacite} personnes
                  </Descriptions.Item>

                  <Descriptions.Item
                      label={
                      <>
                          <ClockCircleOutlined /> Horaires d'ouverture
                      </>
                      }
                  >
                      {salle.horaires_ouverture || 'Non spécifiés'}
                  </Descriptions.Item>
                  </Descriptions>

                  
                  <Button 
                    type="primary" 
                    block 
                    size="large"
                    onClick={handleReservation}
                    disabled={salle.status !== 'active'}
                    style={{ marginTop: '16px' }}
                  >
                    Réserver cette salle
                  </Button>
                </Card>
                
                <Card title="Disponibilité">
                  <Text>Vérifiez la disponibilité pour réserver cette salle.</Text>
                  <Button 
                    type="default" 
                    block 
                    style={{ marginTop: '16px' }}
                    onClick={() => setIsModalVisible(true)}
                  >
                    <CalendarOutlined /> Voir les disponibilités
                  </Button>
                </Card>
              </Col>
            </Row>
          </Card>

          {/* Modal de réservation */}
          <Modal
            title={`Réserver la salle ${salle.nom}`}
            open={isModalVisible}
            onCancel={() => {
              setIsModalVisible(false);
              form.resetFields();
            }}
            footer={null}
            width={600}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmitReservation}
            >
              <Form.Item
                name="date"
                label="Date de réservation"
                rules={[{ required: true, message: 'Veuillez sélectionner une date' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  disabledDate={(current) => {
                    return current && current < moment().startOf('day');
                  }}
                />
              </Form.Item>
              
              <Form.Item
                name="heure"
                label="Plage horaire"
                rules={[{ required: true, message: 'Veuillez sélectionner une plage horaire' }]}
              >
                <RangePicker 
                  style={{ width: '100%' }}
                  format="HH:mm"
                  minuteStep={15}
                  disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 7, 20, 21, 22, 23]}
                  hideDisabledOptions
                />
              </Form.Item>
              
              <Form.Item
                name="motif"
                label="Motif de la réservation"
                rules={[{ required: true, message: 'Veuillez indiquer le motif de la réservation' }]}
              >
                <Input.TextArea rows={4} placeholder="Décrivez l'objet de votre réunion..." />
              </Form.Item>
              
              <Form.Item style={{ textAlign: 'right' }}>
                <Button 
                  onClick={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                  }} 
                  style={{ marginRight: '8px' }}
                >
                  Annuler
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={reservationLoading}
                >
                  Confirmer la réservation
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
        <style jsx>{`
          @media (max-width: 1024px) {
            .ant-row {
              flex-direction: column !important;
            }
            .ant-col {
              width: 100% !important;
              max-width: 100% !important;
            }
          }
          @media (max-width: 768px) {
            .ant-card {
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
            .ant-btn {
              font-size: 15px !important;
            }
            .ant-modal {
              width: 98vw !important;
              max-width: 98vw !important;
            }
          }
          @media (max-width: 480px) {
            .ant-card {
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
            .ant-btn {
              font-size: 14px !important;
            }
            .ant-modal {
              padding: 0 !important;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default DetailsSalle;