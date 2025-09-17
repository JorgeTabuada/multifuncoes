import React, { useState } from 'react';
import AppLogo from '../components/common/AppLogo';

const LoginPage = ({ onLogin, onShowRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (email && password) {
      console.log('Attempting login with:', email);
      onLogin({ fullName: email.split('@')[0] || 'Utilizador Teste', email });
    } else {
      setErrorMessage('Email e Palavra-passe são obrigatórios.');
    }
  };

  return (
    <div className="app-container flex justify-center items-center">
      <div className="login-box">
        <AppLogo />
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="o.seu@email.com"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Palavra-passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="********"
            />
          </div>
          <button type="submit" id="loginButton" className="w-full">
            Entrar
          </button>
        </form>
        {errorMessage && (
          <p className="text-red-500 text-sm mt-3 text-center">{errorMessage}</p>
        )}
        <div className="mt-6 text-center">
          <button
            onClick={onShowRegister}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Não tem conta? Registe-se aqui.
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
