import { useState, useCallback } from 'react';

/**
 * Custom hook untuk menangani notifikasi
 * @returns {Object} Object berisi state dan methods untuk menangani notifikasi
 */
const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const showSuccess = useCallback((message, duration = 3000) => {
    setNotification({ type: 'success', message });
    const timer = setTimeout(() => setNotification(null), duration);
    return () => clearTimeout(timer);
  }, []);

  const showError = useCallback((message, duration = 5000) => {
    setNotification({ type: 'error', message });
    const timer = setTimeout(() => setNotification(null), duration);
    return () => clearTimeout(timer);
  }, []);

  const showInfo = useCallback((message, duration = 3000) => {
    setNotification({ type: 'info', message });
    const timer = setTimeout(() => setNotification(null), duration);
    return () => clearTimeout(timer);
  }, []);

  const clearNotification = useCallback(() => setNotification(null), []);

  const NotificationComponent = useCallback(() => {
    if (!notification) return null;
    const className = `message message-${notification.type}`;
    return (
      <div className={className}>
        {notification.message}
        <button className="close-notification" onClick={clearNotification} aria-label="Close notification">
          &times;
        </button>
      </div>
    );
  }, [notification, clearNotification]);

  return { notification, showSuccess, showError, showInfo, clearNotification, NotificationComponent };
};

export default useNotification;

