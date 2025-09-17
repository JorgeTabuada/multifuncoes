import React, { useState } from 'react';
import { X } from '../../assets/icons';

const RegisterModal = ({ isOpen, onClose, onSubmit }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !phone || !email) {
      setFormError('Todos os campos são obrigatórios.');
      return;
    }
    setFormError('');
    console.log('Submissão de Registo:', { firstName, lastName, phone, email });
    onSubmit({ firstName, lastName, phone, email });
  };

  return (
    <div className="form-modal-backdrop">
      <div className="form-modal-dialog">
        <div className="form-modal-header">
          <h2 className="form-modal-title">Pedido de Registo</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-modal-body">
            <div className="form-group">
              <label htmlFor="regFirstName">Primeiro Nome</label>
              <input
                type="text"
                id="regFirstName"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="regLastName">Último Nome</label>
              <input
                type="text"
                id="regLastName"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="regPhone">Número de Telefone</label>
              <input
                type="tel"
                id="regPhone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="regEmail">Email</label>
              <input
                type="email"
                id="regEmail"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            {formError && <p className="text-red-500 text-sm mt-2">{formError}</p>}
          </div>
          <div className="form-modal-footer">
            <button type="button" onClick={onClose} className="action-button secondary">
              Cancelar
            </button>
            <button type="submit" className="action-button">
              Submeter Pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
