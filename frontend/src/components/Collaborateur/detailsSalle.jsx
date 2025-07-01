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
  Input,
  Divider,
  Carousel
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

  const getSalleImageUrl = () => {
    // Gestion d'un tableau d'images
    if (salle.images && Array.isArray(salle.images) && salle.images.length > 0) {
      // Retourne la première image du tableau
      const firstImage = salle.images[0];
      if (firstImage && firstImage !== 'null' && firstImage !== '') {
        return `http://localhost:8000/storage/salles/${firstImage}`;
      }
    }
    // Fallback pour une seule image (compatibilité)
    if (salle.image && salle.image !== 'null' && salle.image !== '') {
      return `http://localhost:8000/storage/salles/${salle.image}`;
    }
    return 'https://via.placeholder.com/1000x500?text=Sans+image';
  };

  // Fonction pour obtenir toutes les URLs d'images
  const getAllImageUrls = () => {
    const urls = [];
    
    if (salle.images && Array.isArray(salle.images)) {
      salle.images.forEach(image => {
        if (image && image !== 'null' && image !== '') {
          urls.push(`http://localhost:8000/storage/salles/${image}`);
        }
      });
    }
    
    // Si pas d'images dans le tableau, essayer l'image unique
    if (urls.length === 0 && salle.image && salle.image !== 'null' && salle.image !== '') {
      urls.push(`http://localhost:8000/storage/salles/${salle.image}`);
    }
    
    return urls.length > 0 ? urls : ['https://via.placeholder.com/1000x500?text=Sans+image'];
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
          'Accept': 'application/json',
          'Content-Type': 'application/json',
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
      <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)', minHeight: '100vh', padding: 0 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px' }}>
          <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(16,185,129,0.10)', marginBottom: 32, background: '#fff' }}>
            {/* Image et titre superposés */}
            <div style={{ position: 'relative' }}>
              <Carousel
                autoplay
                effect="fade"
                dots={{ className: 'custom-carousel-dots' }}
                style={{ width: '100%', height: 260, borderRadius: '0 0 24px 24px' }}
              >
                {getAllImageUrls().map((imageUrl, index) => (
                  <div key={index} style={{ height: 260, overflow: 'hidden' }}>
                    <Image
                      src={imageUrl}
                      alt={`${salle.nom} - Image ${index + 1}`}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        borderRadius: index === 0 ? '0 0 24px 24px' : '0'
                      }}
                      preview={false}
                    />
                  </div>
                ))}
              </Carousel>
              <div style={{ position: 'absolute', top: 24, left: 24, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
                <Title level={2} style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: 32 }}>{salle.nom}</Title>
                <Tag color={salle.status === 'active' ? 'green' : 'red'} style={{ fontSize: 16, borderRadius: 8, marginTop: 8 }}>
                  {salle.status === 'active' ? 'Disponible' : 'Indisponible'}
                </Tag>
              </div>
              <Button 
                type="text" 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate(-1)}
                style={{ position: 'absolute', top: 24, right: 24, background: 'rgba(255,255,255,0.85)', borderRadius: 12, fontWeight: 600 }}
              >
                Retour
              </Button>
            </div>
          </div>

          <Row gutter={[32, 32]}>
            <Col xs={24} md={14}>
              <Card style={{ borderRadius: 20, boxShadow: '0 4px 24px rgba(16,185,129,0.08)', marginBottom: 24, background: '#fff' }}>
                <Title level={4} style={{ marginBottom: 8 }}>Description</Title>
                <Paragraph style={{ color: '#374151', fontSize: 16 }}>{salle.description || 'Aucune description disponible.'}</Paragraph>
                <Divider style={{ margin: '16px 0' }} />
                <Title level={4} style={{ marginBottom: 8 }}>Équipements</Title>
                <Space size={[8, 8]} wrap style={{ marginTop: 8 }}>
                  {equipmentIcons.length > 0 ? (
                    equipmentIcons.map((item, index) => (
                      <Tag key={index} icon={item.icon} color="success" style={{ fontSize: 15, borderRadius: 8, padding: '6px 16px' }}>
                        {item.text}
                      </Tag>
                    ))
                  ) : (
                    <Tag color="default">Aucun équipement spécifique</Tag>
                  )}
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={10}>
              <Card style={{ borderRadius: 20, boxShadow: '0 4px 24px rgba(16,185,129,0.08)', marginBottom: 24, background: '#fff' }}>
                <Title level={5} style={{ marginBottom: 16 }}>Détails de la salle</Title>
                <Descriptions column={1} styles={{ label: { fontWeight: 600, color: '#059669' } }}>
                  <Descriptions.Item label={<><EnvironmentOutlined /> Localisation</>}>
                    {salle.localisation || 'Non spécifiée'}
                  </Descriptions.Item>
                  <Descriptions.Item label={<><UserOutlined /> Capacité</>}>
                    {salle.capacite} personnes
                  </Descriptions.Item>
                  <Descriptions.Item label={<><ClockCircleOutlined /> Horaires d'ouverture</>}>
                    {salle.horaires_ouverture || 'Non spécifiés'}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
              <Card style={{ borderRadius: 20, boxShadow: '0 4px 24px rgba(16,185,129,0.08)', background: '#fff' }}>
                <Title level={5} style={{ marginBottom: 16 }}>Disponibilité & Actions</Title>
                <Button 
                  type="primary" 
                  block 
                  size="large"
                  onClick={handleReservation}
                  disabled={salle.status !== 'active'}
                  style={{ marginBottom: 12, borderRadius: 10, fontWeight: 600 }}
                >
                  Réserver cette salle
                </Button>
                <Button 
                  type="default" 
                  block 
                  style={{ borderRadius: 10, fontWeight: 600 }}
                  onClick={() => setIsModalVisible(true)}
                >
                  <CalendarOutlined /> Voir les disponibilités
                </Button>
              </Card>
            </Col>
          </Row>

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
            style={{ top: 30 }}
            styles={{ body: { borderRadius: 16, padding: 24 } }}
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
                  disabledTime={() => ({
                    disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 7, 20, 21, 22, 23],
                  })}
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
                  style={{ marginRight: '8px', borderRadius: 8 }}
                >
                  Annuler
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={reservationLoading}
                  style={{ borderRadius: 8 }}
                >
                  Confirmer la réservation
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
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
    </>
  );
};

export default DetailsSalle;