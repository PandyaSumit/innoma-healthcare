import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-sm shadow-sm w-full max-w-lg mx-4 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between pl-4 pr-2 py-1 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>

          <button
            onClick={onClose}
            className="py-2 px-3 rounded hover:bg-gray-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
