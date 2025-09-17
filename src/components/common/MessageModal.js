import React from 'react';

const MessageModal = ({ title, message, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="form-modal-backdrop">
      <div className="modal-content">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <button onClick={onClose} className="action-button">
          Fechar
        </button>
      </div>
    </div>
  );
};

export default MessageModal;
