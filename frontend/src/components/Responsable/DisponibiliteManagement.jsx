import React, { useState, useEffect } from "react";
import { Form, Input, Button, DatePicker, TimePicker, Select, message } from "antd";
import axios from "axios";

const { Option } = Select;

const DisponibiliteManagement = () => {
  const [salles, setSalles] = useState([]);

  useEffect(() => {
    // Charger les salles actives
    axios.get("http://localhost:8000/api/salles",{
      headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
    })
      .then(res => setSalles(res.data.filter(s => s.status === "active")));
  }, []);

  const onFinish = async (values) => {
    try {
      await axios.post("http://localhost:8000/api/disponibilites", {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        salle_id: values.salle_id,
        date: values.date.format("YYYY-MM-DD"),
        heure_debut: values.heure_debut.format("HH:mm"),
        heure_fin: values.heure_fin.format("HH:mm"),
        statut: values.statut,
      });
      message.success("Disponibilité ajoutée !");
    } catch (e) {
      message.error("Erreur lors de l'ajout !");
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item name="salle_id" label="Salle" rules={[{ required: true }]}>
        <Select placeholder="Choisir une salle">
          {salles.map(salle => (
            <Option key={salle.id} value={salle.id}>{salle.nom}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="date" label="Date" rules={[{ required: true }]}>
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="heure_debut" label="Heure de début" rules={[{ required: true }]}>
        <TimePicker format="HH:mm" style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="heure_fin" label="Heure de fin" rules={[{ required: true }]}>
        <TimePicker format="HH:mm" style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="statut" label="Statut" rules={[{ required: true }]}>
        <Select>
          <Option value="disponible">Disponible</Option>
          <Option value="occupé">Occupé</Option>
          <Option value="inactif">Inactif</Option>
        </Select>
      </Form.Item>
      <Button type="primary" htmlType="submit">Ajouter</Button>
    </Form>
  );
};

export default DisponibiliteManagement;