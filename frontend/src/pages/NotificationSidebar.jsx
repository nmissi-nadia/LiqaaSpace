import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const NotificationSidebar = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Charger les notifications existantes
    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`${API_URL}/notifications`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Accept': 'application/json'
                }
            });
            setNotifications(response.data);
        } catch (err) {
            console.error('Erreur lors du chargement des notifications:', err);
            setError('Impossible de charger les notifications');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();

        // Initialiser Echo si disponible
        const initializeEcho = () => {
            if (window.Echo) {
                const echo = window.Echo;
                echo.private(`notifications.${userId}`)
                    .listen('.new-notification', (data) => {
                        setNotifications(prev => [data, ...prev]);
                    });
                return () => {
                    echo.leave(`notifications.${userId}`);
                };
            } else {
                console.warn('Echo n\'est pas disponible');
            }
        };

        initializeEcho();
        const timer = setTimeout(() => {
            if (window.Echo) {
                initializeEcho();
            }
        }, 1000);

        return () => {
            clearTimeout(timer);
            if (window.Echo) {
                window.Echo.leave(`notifications.${userId}`);
            }
        };
    }, [userId]);

    const markAsRead = async (notificationId) => {
        try {
            await axios.post(
                `${API_URL}/notifications/${notificationId}/read`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Accept': 'application/json'
                    }
                }
            );
            setNotifications(prev => 
                prev.map(notif => 
                    notif.id === notificationId 
                        ? { ...notif, read_at: new Date().toISOString() } 
                        : notif
                )
            );
        } catch (err) {
            console.error('Erreur lors du marquage comme lu:', err);
        }
    };

    const unreadCount = notifications.filter(n => !n.read_at).length;

    return (
        <div className="relative">
            {/* Bouton cloche à sa position initiale (inline, pas fixed) */}
            <button 
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-full hover:bg-gray-200 relative"
                aria-label="Notifications"
            >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Overlay et Sidebar */}
            {isOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-30 z-[9998] transition-opacity duration-300"
                        onClick={() => setIsOpen(false)}
                        aria-label="Fermer la sidebar de notifications"
                    ></div>
                    {/* Sidebar amélioré */}
                    <div className="fixed top-0 right-0 h-full w-96 max-w-full bg-white rounded-l-2xl shadow-2xl z-[10000] flex flex-col animate-slide-in transition-transform duration-300"
                        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
                    >
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between rounded-tl-2xl">
                            <h3 className="font-medium text-gray-900 text-lg">Notifications</h3>
                            <button
                                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                                onClick={() => setIsOpen(false)}
                                aria-label="Fermer"
                            >
                                ×
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {isLoading ? (
                                <div className="p-4">Chargement...</div>
                            ) : error ? (
                                <div className="text-red-500 text-sm p-4">{error}</div>
                            ) : notifications.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">
                                    Aucune notification
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div 
                                        key={notification.id} 
                                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer rounded-lg mx-2 my-1 ${
                                            !notification.read_at ? 'bg-blue-50' : ''
                                        }`}
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                    
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-800">
                                                    {notification.data?.message || 'Nouvelle notification'}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(notification.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                            {!notification.read_at && (
                                                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationSidebar;