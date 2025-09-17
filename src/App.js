import React, { useState, useEffect } from 'react';
import GlobalStyles from './components/layout/GlobalStyles';
import MessageModal from './components/common/MessageModal';
import RegisterModal from './components/common/RegisterModal';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import GenericSubAppPage from './components/subapps/GenericSubAppPage';
import { parks } from './data/subAppsData';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [currentAppName, setCurrentAppName] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedPark, setSelectedPark] = useState(parks[0].value);
  
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({ title: '', text: '' });
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const handleShowRegisterModal = () => setIsRegisterModalOpen(true);
  const handleCloseRegisterModal = () => setIsRegisterModalOpen(false);
  
  const handleRegisterSubmit = (formData) => {
    console.log("Dados do registo para 'enviar por email':", formData);
    setIsRegisterModalOpen(false);
    setMessageModalContent({
      title: 'Pedido de Registo',
      text: 'O seu pedido de registo foi submetido. Será contactado após aprovação.'
    });
    setIsMessageModalOpen(true);
  };

  const handleNavigateToApp = (appId, appName) => {
    setCurrentAppName(appName);
    setCurrentPage(`app/${appId}`);
  };

  const handleNavigateToDashboard = () => {
    setCurrentPage('dashboard');
    setCurrentAppName('');
  };
  
  useEffect(() => {
    // console.log(`Parque selecionado: ${selectedPark}`);
  }, [selectedPark]);

  return (
    <>
      <GlobalStyles />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      <MessageModal
        isOpen={isMessageModalOpen}
        title={messageModalContent.title}
        message={messageModalContent.text}
        onClose={() => setIsMessageModalOpen(false)}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={handleCloseRegisterModal}
        onSubmit={handleRegisterSubmit}
      />

      {currentPage === 'login' && (
        <LoginPage onLogin={handleLogin} onShowRegister={handleShowRegisterModal} />
      )}
      
      {currentPage === 'dashboard' && currentUser && (
        <DashboardPage
          user={currentUser}
          onLogout={handleLogout}
          onNavigateToApp={handleNavigateToApp}
          selectedPark={selectedPark}
          setSelectedPark={setSelectedPark}
        />
      )}
      
      {currentPage.startsWith('app/') && (
        <GenericSubAppPage
          appName={currentAppName}
          onNavigateToDashboard={handleNavigateToDashboard}
        />
      )}
    </>
  );
}
