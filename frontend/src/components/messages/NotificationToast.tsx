import { useState, useEffect } from 'react';

interface NotificationToastProps {
  message: string;
  sender: string;
  onClose: () => void;
  duration?: number;
}

export default function NotificationToast({ message, sender, onClose, duration = 5000 }: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`fixed top-20 right-4 z-50 transition-all duration-300 transform ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-white rounded-2xl shadow-2xl border border-blue-200 p-4 max-w-sm">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
            🎓
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 text-sm">{sender}</p>
            <p className="text-gray-700 text-sm mt-1">{message}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}