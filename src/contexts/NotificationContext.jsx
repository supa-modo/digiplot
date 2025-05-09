import { createContext, useContext, useState, useCallback } from 'react';
import Notification from '../components/common/Notification';

// Create the context
const NotificationContext = createContext();

// Generate a unique ID for each notification
const generateUniqueId = () => {
  return `notification-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add a new notification
  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = generateUniqueId();
    
    setNotifications(prev => [
      ...prev,
      { id, message, type, duration }
    ]);
    
    return id;
  }, []);

  // Remove a notification by ID
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Convenience methods for different notification types
  const showSuccess = useCallback((message, duration) => {
    return addNotification(message, 'success', duration);
  }, [addNotification]);

  const showError = useCallback((message, duration) => {
    return addNotification(message, 'error', duration);
  }, [addNotification]);

  const showWarning = useCallback((message, duration) => {
    return addNotification(message, 'warning', duration);
  }, [addNotification]);

  const showInfo = useCallback((message, duration) => {
    return addNotification(message, 'info', duration);
  }, [addNotification]);

  // Value to be provided by the context
  const value = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Render all active notifications */}
      <div className="notification-container">
        {notifications.map((notification, index) => (
          <div 
            key={notification.id} 
            style={{ 
              position: 'relative', 
              zIndex: 9999,
              marginBottom: '0.5rem',
              transform: `translateY(${index * 4}rem)`
            }}
          >
            <Notification
              message={notification.message}
              type={notification.type}
              duration={notification.duration}
              onClose={() => removeNotification(notification.id)}
            />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

// Custom hook for using the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  
  return context;
};

export default NotificationContext;
