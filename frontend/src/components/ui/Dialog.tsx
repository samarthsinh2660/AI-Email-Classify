import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function Dialog({ isOpen, onClose, title, message, type }: DialogProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      // Delay hiding for animation
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-600" />;
      default:
        return <Info className="w-6 h-6 text-blue-600" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-green-200';
      case 'error':
        return 'border-red-200';
      case 'info':
        return 'border-blue-200';
      default:
        return 'border-blue-200';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className={`bg-white rounded-lg shadow-xl border-2 ${getBorderColor()} max-w-md w-full mx-4`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {getIcon()}
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-gray-700 leading-relaxed">{message}</p>
          </div>

          {/* Footer */}
          <div className="flex justify-end p-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
