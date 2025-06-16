import React, { useState, useEffect } from 'react';
import { Table, Card, Typography, Tag, Space, message } from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CloseCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const { Title, Text } = Typography;

const MesReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('access_token');
        
        if (!token || !user) {
          message.error('Veuillez vous connecter');
          return;
        }

        const response = await api.get(`/api/reservations/collaborateur/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const reservationsData = Array.isArray(response.data?.data) 
          ? response.data.data 
          : [];
        
        setReservations(reservationsData);
      } catch (error) {
        console.error('Erreur:', error);
        message.error('Erreur lors du chargement des réservations');
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchReservations();
    }
  }, [user]);

  const getStatusTag = (statut) => {
    const statusConfig = {
      'confirmée': { color: 'success', icon: <CheckCircleOutlined /> },
      'en_attente': { color: 'processing', icon: <ClockCircleOutlined /> },
      'annulée': { color: 'error', icon: <CloseCircleOutlined /> }
    };

    const config = statusConfig[statut] || { color: 'default', icon: null };

    return (
      <Tag 
        color={config.color} 
        icon={config.icon}
        style={{ 
          borderRadius: '12px',
          padding: '0 10px',
          margin: 0
        }}
      >
        {statut}
      </Tag>
    );
  };

  const handleAction = async (action, record) => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (action === 'annuler') {
        await api.put(`/api/reservations/${record.id}/annuler`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        message.success('Réservation annulée avec succès');
        // Recharger les réservations
        const response = await api.get(`/api/reservations/collaborateur/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setReservations(response.data?.data || []);
      }
    } catch (error) {
      console.error('Erreur:', error);
      message.error(`Erreur lors de l'action: ${error.response?.data?.message || error.message}`);
    }
  };

  const columns = [
    {
      title: 'Salle',
      dataIndex: ['salle', 'nom'],
      key: 'salle',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.salle?.nom || 'N/A'}</Text>
          {record.salle?.location && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              <EnvironmentOutlined /> {record.salle.location}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => date ? new Date(date).toLocaleDateString('fr-FR') : 'N/A',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Heure début',
      dataIndex: 'heure_debut',
      key: 'heure_debut',
      render: (heure) => heure || 'N/A'
    },
    {
      title: 'Heure fin',
      dataIndex: 'heure_fin',
      key: 'heure_fin',
      render: (heure) => heure || 'N/A'
    },
    {
      title: 'Statut',
      dataIndex: 'statut',
      key: 'statut',
      render: (statut) => getStatusTag(statut),
      filters: [
        { text: 'Confirmée', value: 'confirmée' },
        { text: 'En attente', value: 'en attente' },
        { text: 'Annulée', value: 'annulée' },
      ],
      onFilter: (value, record) => record.statut === value,
      filterMultiple: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleAction('voir', record)}>
            <EyeOutlined style={{ color: '#1890ff' }} />
          </a>
          {record.statut === 'en attente' && (
            <>
              <a onClick={() => handleAction('modifier', record)}>
                <EditOutlined style={{ color: '#52c41a' }} />
              </a>
              <a 
                onClick={() => handleAction('annuler', record)}
                style={{ color: '#ff4d4f' }}
              >
                <DeleteOutlined />
              </a>
            </>
          )}
        </Space>
      ),
    }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ color: '#2c3e50' }}>Mes Réservations</Title>
        <Text type="secondary">Consultez l'historique et le statut de vos réservations</Text>
      </div>
      
      <Card
        bordered={false}
        style={{ 
          borderRadius: '8px',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        }}
      >
        <Table
          columns={columns}
          dataSource={Array.isArray(reservations) ? reservations : []}
          rowKey="id"
          loading={loading}
          pagination={{ 
            pageSize: 5,
            showSizeChanger: false,
            style: { marginRight: '16px' }
          }}
          scroll={{ x: true }}
          locale={{
            emptyText: 'Aucune réservation trouvée'
          }}
        />
      </Card>
    </div>
  );
};

export default MesReservations;