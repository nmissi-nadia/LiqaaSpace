import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  message,
  Card,
  Tag,
  Typography,
  Popconfirm,
  DatePicker,
  Select,
  Row,
  Col,
  Tooltip
} from 'antd';
import {
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/fr';
import api from '../../services/api';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

moment.locale('fr');

const ReservationAdmin = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    statut: null,
    dateRange: null
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Salle',
      dataIndex: ['salle', 'nom'],
      key: 'salle',
      render: (_, record) => record.salle?.nom || '-',
    },
    {
      title: 'Collaborateur',
      dataIndex: ['collaborateur', 'name'],
      key: 'collaborateur',
      render: (_, record) => record.collaborateur?.name || '-',
    },
    {
      title: 'Email',
      dataIndex: ['collaborateur', 'email'],
      key: 'email',
      render: (_, record) => record.collaborateur?.email || '-',
    },
    {
      title: 'Date de réservation',
      dataIndex: 'date',
      key: 'date',
      render: (date) => date ? moment(date).format('DD/MM/YYYY') : '-',
    },
    {
      title: 'Date début',
      dataIndex: 'heure_debut',
      key: 'heure_debut',
      render: (date) => date ? moment(date).format('HH:mm') : '-',
    },
    {
      title: 'Date fin',
      dataIndex: 'heure_fin',
      key: 'heure_fin',
      render: (date) => date ? moment(date).format('HH:mm') : '-',
    },
    {
      title: 'Statut',
      dataIndex: 'statut',
      key: 'statut',
      render: (statut) => {
        const statusConfig = {
          'en attente': { color: 'orange', text: 'En attente' },
          'accepté': { color: 'green', text: 'Accepté' },
          'refusé': { color: 'red', text: 'Refusé' },
          'confirmé': { color: 'blue', text: 'Confirmé' },
          'annulé': { color: 'default', text: 'Annulé' }
        };
        const config = statusConfig[statut] || { color: 'default', text: statut };
        return (
          <Tag color={config.color} style={{ textTransform: 'capitalize' }}>
            {config.text}
          </Tag>
        );
      },
      filters: [
        { text: 'En attente', value: 'en attente' },
        { text: 'Accepté', value: 'accepté' },
        { text: 'Refusé', value: 'refusé' },
      ],
      onFilter: (value, record) => record.statut === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          {record.statut === 'en attente' && (
            <>
              <Tooltip title="Accepter">
                <Button
                  type="text"
                  icon={<CheckOutlined style={{ color: '#52c41a' }} />}
                  onClick={() => handleStatusChange(record, 'accepté')}
                />
              </Tooltip>
              <Tooltip title="Refuser">
                <Button
                  type="text"
                  danger
                  icon={<CloseOutlined />}
                  onClick={() => handleStatusChange(record, 'refusé')}
                />
              </Tooltip>
            </>
          )}
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer cette réservation ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Oui"
            cancelText="Non"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await api.get('/api/reservations', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      // Si le backend ne retourne pas .data mais un tableau direct
      setReservations(Array.isArray(response.data) ? response.data : response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      message.error('Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('access_token');
      await api.delete(`/api/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Réservation supprimée avec succès');
      fetchReservations();
    } catch (error) {
      console.error('Error deleting reservation:', error);
      message.error('Erreur lors de la suppression de la réservation');
    }
  };

  // Pour changer le statut, il faut envoyer tous les champs requis
  const handleStatusChange = async (record, newStatus) => {
    try {
      const token = localStorage.getItem('access_token');
      await api.put(`/api/reservations/${record.id}`, {
        salle_id: record.salle?.id,
        collaborateur_id: record.collaborateur?.id,
        heure_debut: record.heure_debut,
        heure_fin: record.heure_fin,
        statut: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success(`Réservation ${newStatus} avec succès`);
      fetchReservations();
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('Erreur lors de la mise à jour du statut');
    }
  };

  // Filtres côté front (statut/date)
  const handleStatusFilter = (value) => {
    setFilters({ ...filters, statut: value });
  };
  const handleDateRangeChange = (dates) => {
    setFilters({ ...filters, dateRange: dates });
  };

  // Application des filtres côté front
  const filteredReservations = reservations.filter(res => {
    let ok = true;
    if (filters.statut) ok = ok && res.statut === filters.statut;
    if (filters.dateRange && filters.dateRange.length === 2) {
      const start = filters.dateRange[0].startOf('day');
      const end = filters.dateRange[1].endOf('day');
      ok = ok && moment(res.heure_debut).isBetween(start, end, null, '[]');
    }
    return ok;
  });

  return (
    <div className="reservation-admin">
      <Card>
        <Title level={3} style={{ marginBottom: 24 }}>
          Gestion des Réservations
        </Title>

        <div style={{ marginBottom: 16 }}>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={24} md={8} style={{ marginBottom: 8 }}>
              <RangePicker
                style={{ width: '100%' }}
                onChange={handleDateRangeChange}
                format="HH:mm"
                placeholder={['Date de début', 'Date de fin']}
                suffixIcon={<CalendarOutlined />}
              />
            </Col>
            <Col xs={24} md={8}>
              <Select
                style={{ width: '100%' }}
                placeholder="Filtrer par statut"
                allowClear
                onChange={handleStatusFilter}
                suffixIcon={<SearchOutlined />}
              >
                <Option value="en attente">En attente</Option>
                <Option value="accepté">Accepté</Option>
                <Option value="refusé">Refusé</Option>
              </Select>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          rowKey="id"
          dataSource={filteredReservations}
          loading={loading}
          scroll={{ x: 1000 }}
          bordered
        />
      </Card>
    </div>
  );
};

export default ReservationAdmin;