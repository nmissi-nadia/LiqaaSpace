import React, { useEffect } from 'react';
import axios from 'axios';

const TestConnexion = () => {
  useEffect(() => {
    axios.get('http://localhost:8000/api/test', {
      withCredentials: true
    })
      .then(res => console.log('✅ Réponse Laravel:', res.data))
      .catch(err => console.error('❌ Erreur Laravel:', err));
  }, []);

  return (
    <div>
      <h2>Test de connexion avec Laravel</h2>
    </div>
  );
};

export default TestConnexion;
