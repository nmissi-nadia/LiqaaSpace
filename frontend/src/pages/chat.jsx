import React, { useEffect, useRef, useState } from 'react';
import { FiSend, FiPaperclip, FiX, FiDownload } from 'react-icons/fi';
import Pusher from 'pusher-js';
import api from '../services/api';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Récupérer l'utilisateur et les messages
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes= await Promise.all([
          api.get('api/user', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
              'Accept': 'application/json',
            },
          })
        ]);
        console.log('userRes.data', userRes.data);
        const messagesRes = await api.get('api/messages', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Accept': 'application/json',
          },
        });
        
        setMessages(messagesRes.data.reverse()); 
      } catch (err) {
        console.error('Erreur:', err);
        setError('Impossible de charger les données du chat');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Configuration de Pusher
  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
      cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
      wsHost: process.env.REACT_APP_PUSHER_HOST || '127.0.0.1',
      wsPort: process.env.REACT_APP_PUSHER_PORT || 6001,
      forceTLS: false,
      enabledTransports: ['ws', 'wss'],
    });

    const channel = pusher.subscribe('chat');
    
    channel.bind('message.sent', (data) => {
      setMessages(prev => [...prev, data.message]);
    });

    return () => {
      pusher.unsubscribe('chat');
    };
  }, []);

  // Faire défiler vers le bas à chaque nouveau message
  // Récupérer l'utilisateur et les messages
useEffect(() => {
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 1. D'abord, récupérer le jeton CSRF
      try {
        await api.get('/sanctum/csrf-cookie');
      } catch (csrfError) {
        console.error('Erreur CSRF:', csrfError);
      }

      // 2. Ensuite, récupérer les données utilisateur
      const userResponse = await api.get('/api/user').catch(userErr => {
        console.error('Erreur utilisateur:', userErr);
        throw userErr;
      });

      // 3. Enfin, récupérer les messages
      const messagesResponse = await api.get('/api/messages').catch(msgErr => {
        console.error('Erreur messages:', msgErr);
        throw msgErr;
      });

      if (messagesResponse.data && messagesResponse.data.messages) {
        setMessages(messagesResponse.data.messages);
      } else {
        console.error('Format de réponse inattendu:', messagesResponse);
        setError('Format de réponse inattendu du serveur');
      }
      
    } catch (err) {
      console.error('Erreur détaillée:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });
      
      if (err.response?.status === 401) {
        // Non authentifié
        localStorage.removeItem('access_token');
        window.location.href = '/auth';
      } else {
        setError('Impossible de charger les messages. Veuillez réessayer.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if ((!message.trim() && !file) || isSending) return;
  
    const formData = new FormData();
    if (message.trim()) formData.append('message', message.trim());
    if (file) formData.append('file', file);
  
    setIsSending(true);
    setError(null);
  
    try {
      const response = await api.post('/api/messages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setMessage('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Mettre à jour les messages avec la réponse
      setMessages(prev => [...prev, response.data.message]);
      
    } catch (error) {
      console.error('Erreur détaillée:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      // Afficher un message d'erreur plus détaillé
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Erreur lors de l\'envoi du message';
      
      setError(errorMessage);
      
      // Si le token a expiré, rediriger vers la page de connexion
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token');
        window.location.href = '/auth';
      }
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      hour: '2-digit', 
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    return new Date(dateString).toLocaleString('fr-FR', options);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* En-tête du chat */}
      <div className="bg-emerald-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-semibold">Chat en direct</h1>
      </div>

      {/* Zone des messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Aucun message pour le moment</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`flex ${msg.user_id === (messages[0]?.user?.id || 1) ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.user_id === (messages[0]?.user?.id || 1)
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white text-gray-800 shadow'
                }`}
              >
                {msg.user && (
                  <p className="font-semibold text-xs mb-1">
                    {msg.user.name || 'Utilisateur inconnu'}
                  </p>
                )}
                {msg.message && <p className="text-sm">{msg.message}</p>}
                
                {msg.file_path && (
                  <div className="mt-2">
                    <a
                      href={`${process.env.REACT_APP_BACKEND_URL}/storage/${msg.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-500 hover:underline"
                    >
                      <FiDownload className="mr-1" size={14} />
                      {msg.file_name || 'Télécharger le fichier'}
                    </a>
                  </div>
                )}
                
                <p className="text-xs opacity-70 mt-1">
                  {formatDate(msg.created_at)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie */}
      <form
        onSubmit={sendMessage}
        className="bg-white p-4 border-t border-gray-200"
      >
        {error && (
          <div className="mb-3 p-2 bg-red-100 text-red-700 text-sm rounded">
            {error}
          </div>
        )}
        
        {file && (
          <div className="mb-3 p-2 bg-blue-50 rounded flex justify-between items-center">
            <span className="text-sm text-blue-700 truncate max-w-xs">
              {file.name}
            </span>
            <button
              type="button"
              onClick={removeFile}
              className="text-gray-500 hover:text-red-500"
            >
              <FiX size={16} />
            </button>
          </div>
        )}

        <div className="flex items-center">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700"
            onClick={() => fileInputRef.current?.click()}
          >
            <FiPaperclip size={20} />
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tapez votre message..."
            className="flex-1 mx-2 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(e)}
          />
          
          <button
            type="submit"
            disabled={isSending || (!message.trim() && !file)}
            className={`p-2 rounded-full transition-colors ${
              isSending || (!message.trim() && !file)
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FiSend size={20} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;