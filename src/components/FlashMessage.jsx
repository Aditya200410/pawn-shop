import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const FlashMessage = ({ message, type, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) {
          onClose();
        }
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!visible || !message) return null;

  let bgColor, textColor, Icon;
  switch (type) {
    case 'success':
      bgColor = 'bg-green-500';
      textColor = 'text-white';
      Icon = CheckCircleIcon;
      break;
    case 'error':
      bgColor = 'bg-red-500';
      textColor = 'text-white';
      Icon = XCircleIcon;
      break;
    default:
      bgColor = 'bg-blue-500';
      textColor = 'text-white';
      Icon = InformationCircleIcon;
  }

  return (
    <div 
      className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg flex items-center z-50 transition-opacity duration-300 ease-in-out ${bgColor} ${textColor} ${visible ? 'opacity-100' : 'opacity-0'}`}
      role="alert"
    >
      {Icon && <Icon className="h-6 w-6 mr-3" />}
      <span>{message}</span>
    </div>
  );
};

export default FlashMessage;