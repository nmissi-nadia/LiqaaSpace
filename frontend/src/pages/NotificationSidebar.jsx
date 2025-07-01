import React, { useEffect, useState } from "react";
import { Drawer, List, Badge, Spin, Empty, Button } from "antd";
import { CheckCircleTwoTone, DeleteOutlined } from "@ant-design/icons";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const NotificationSidebar = ({ open, onClose }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger les notifications à l'ouverture
  useEffect(() => {
    if (open && user) {
      setLoading(true);
      api.get("/api/notifications")
        .then(res => setNotifications(res.data))
        .finally(() => setLoading(false));
    }
  }, [open, user]);

  // Marquer une notification comme lue
  const handleNotificationClick = async (notifId) => {
    await api.post(`/api/notifications/${notifId}/read`);
    setNotifications(notifications => notifications.filter(n => n.id !== notifId));
  };

  // Supprimer une notification
  const handleDelete = async (notifId) => {
    await api.delete(`/api/notifications/${notifId}`);
    setNotifications(notifications => notifications.filter(n => n.id !== notifId));
  };

  // Marquer toutes comme lues
  const handleReadAll = async () => {
    await api.post("/api/notifications/read-all");
    setNotifications([]);
  };

  return (
    <Drawer
      title={
        <div className="flex justify-between items-center">
          <span>Notifications</span>
          <Button size="small" onClick={handleReadAll}>Tout marquer comme lu</Button>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={350}
    >
      {loading ? <Spin /> : (
        notifications.length === 0 ? <Empty description="Aucune notification" /> :
        <List
          dataSource={notifications}
          renderItem={item => (
            <List.Item
              actions={[
                <Button
                  icon={<DeleteOutlined />}
                  size="small"
                  onClick={() => handleDelete(item.id)}
                  key="delete"
                />
              ]}
              onClick={() => handleNotificationClick(item.id)}
              style={{ cursor: "pointer", background: item.read_at ? "#f6f6f6" : "#e6fffb" }}
            >
              <List.Item.Meta
                avatar={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                title={item.data.title || "Notification"}
                description={item.data.message || item.data.body}
              />
            </List.Item>
          )}
        />
      )}
    </Drawer>
  );
};

export default NotificationSidebar;