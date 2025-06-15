import { useEffect } from 'react';
import { X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type];

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3`}>
        <span>{message}</span>
        <button
          onClick={onClose}
          className="hover:bg-white/10 rounded-full p-1 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast; 