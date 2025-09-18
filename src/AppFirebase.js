import React, { useState, useEffect } from 'react';
import { useFirebaseAuth } from './components/auth/FirebaseAuth';
import { FirebaseLoginPage } from './components/auth/FirebaseAuth';
import ReservasFirebaseSubAppPage from './components/subapps/ReservasFirebase';
import ReservasFirebaseRealSubAppPage from './components/subapps/ReservasFirebaseReal';
import RecolhasFirebaseSubAppPage from './components/subapps/RecolhasFirebase';
import FirebaseCollectionExplorer from './components/debug/FirebaseDebug';

// Importar todos os ícones
const IconPlaceholder = ({ name, className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 12m-9 0a9 9 0 1018 0a9 9 0 10-18 0"></path><text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="10">{name.substring(0,1)}</text></svg>;
const CalendarDays = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const List = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>;
const LayoutGrid = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>;
const Users = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const DollarSign = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const X = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const Filter = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;

// Dados das Subaplicações
const subAppsData = [ { id: 'recolhas', name: 'Recolhas', category: 'Operacional', href: '/apps/recolhas' }, { id: 'entregas', name: 'Entregas', category: 'Operacional', href: '/apps/entregas' }, { id: 'caixa_multipark', name: 'Caixa Multipark', category: 'Operacional', href: '/apps/caixa_multipark' }, { id: 'cancelamentos', name: 'Cancelamentos', category: 'Operacional', href: '/apps/cancelamentos' }, { id: 'reservas', name: 'Reservas', category: 'Operacional', href: '/apps/reservas' }, { id: 'confirmacao_caixa', name: 'Confirmação de Caixa', category: 'Operacional', href: '/apps/confirmacao_caixa' }, { id: 'marketing', name: 'Marketing', category: 'Análises', href: '/apps/marketing' }, { id: 'relatorios', name: 'Relatórios', category: 'Análises', href: '/apps/relatorios' }, { id: 'produtividade_condutores', name: 'Produtividade Condutores', category: 'Análises', href: '/apps/produtividade_condutores' }, { id: 'comportamentos', name: 'Comportamentos', category: 'Análises', href: '/apps/comportamentos' }, { id: 'mapa_ocupacao', name: 'Mapa de Ocupação', category: 'Análises', href: '/apps/mapa_ocupacao' }, { id: 'bi_interno', name: 'BI Interno', category: 'Análises', href: '/apps/bi_interno' }, { id: 'despesas', name: 'Despesas', category: 'Gestão', href: '/apps/despesas' }, { id: 'faturacao', name: 'Faturação', category: 'Gestão', href: '/apps/faturacao' }, { id: 'recursos_humanos', name: 'Recursos Humanos', category: 'Gestão', href: '/apps/recursos_humanos' }, { id: 'projetos', name: 'Projetos', category: 'Gestão', href: '/apps/projetos' }, { id: 'tarefas', name: 'Tarefas', category: 'Gestão', href: '/apps/tarefas' }, { id: 'hub_multipark', name: 'Hub Multipark', category: 'Gestão', href: '/apps/hub_multipark' }, { id: 'formacao_apoio', name: 'Formação & Apoio', category: 'Administração e Suporte', href: '/apps/formacao_apoio' }, { id: 'perdidos_achados', name: 'Perdidos & Achados', category: 'Administração e Suporte', href: '/apps/perdidos_achados' }, { id: 'comentarios_reclamacoes', name: 'Comentários & Reclamações', category: 'Administração e Suporte', href: '/apps/comentarios_reclamacoes' }, { id: 'auditorias_internas', name: 'Auditorias Internas', category: 'Administração e Suporte', href: '/apps/auditorias_internas' }, { id: 'acessos_alteracoes', name: 'Acessos e Alterações', category: 'Administração e Suporte', href: '/apps/acessos_alteracoes' } ];
const orderedCategoryNames = ['Operacional', 'Gestão', 'Análises', 'Administração e Suporte'];
const parks = [ { value: 'lisboa', label: 'LISBOA' }, { value: 'porto', label: 'PORTO' }, { value: 'faro', label: 'FARO' }, ];

// Componentes UI
const AppLogo = () => (<div className="app-logo-styled"><span className="logo-p-icon">P</span><span className="logo-text-multipark">MULTIPARK</span></div>);

const MessageModal = ({ title, message, isOpen, onClose }) => { 
  if (!isOpen) return null; 
  return (
    <div className="form-modal-backdrop">
      <div className="modal-content">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <button onClick={onClose} className="action-button">Fechar</button>
      </div>
    </div>
  ); 
};

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
              <input type="text" id="regFirstName" value={firstName} onChange={e => setFirstName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="regLastName">Último Nome</label>
              <input type="text" id="regLastName" value={lastName} onChange={e => setLastName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="regPhone">Número de Telefone</label>
              <input type="tel" id="regPhone" value={phone} onChange={e => setPhone(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="regEmail">Email</label>
              <input type="email" id="regEmail" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            {formError && <p className="text-red-500 text-sm mt-2">{formError}</p>}
          </div>
          <div className="form-modal-footer">
            <button type="button" onClick={onClose} className="action-button secondary">Cancelar</button>
            <button type="submit" className="action-button">Submeter Pedido</button>
          </div>
        </form>
      </div>
    </div>
  ); 
};

// Dashboard integrado com Firebase
const FirebaseDashboardPage = ({ onNavigateToApp, selectedPark, setSelectedPark }) => { 
  const { user, logout } = useFirebaseAuth();
  
  const appsByCategory = subAppsData.reduce((acc, app) => { 
    if (!acc[app.category]) acc[app.category] = []; 
    acc[app.category].push(app); 
    return acc; 
  }, {});
  
  for (const category in appsByCategory) { 
    appsByCategory[category].sort((a, b) => { 
      if (category === 'Gestão') { 
        if (a.id === 'hub_multipark') return 1; 
        if (b.id === 'hub_multipark') return -1; 
      } 
      return a.name.localeCompare(b.name); 
    }); 
  }
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };
  
  return (
    <div className="app-container">
      <div className="main-content-container">
        <AppLogo />
        
        <div className="welcome-message">
          BEM-VINDO DE VOLTA, <span id="userName">{user?.fullName?.toUpperCase() || 'UTILIZADOR'}</span>!
          {user?.nivelAcesso && (
            <div className="text-sm text-gray-600 mt-1">
              Nível de Acesso: {user.nivelAcesso} | Firebase: Conectado ✅
            </div>
          )}
        </div>
        
        <div className="park-selector-buttons-container mb-6 flex justify-center space-x-2 w-full max-w-md">
          {parks.map(park => (
            <button 
              key={park.value} 
              onClick={() => setSelectedPark(park.value)} 
              className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                selectedPark === park.value 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
              }`}
            >
              {park.label}
            </button>
          ))}
        </div>
        
        <main id="categoriesLayoutContainer" className="w-full">
          {orderedCategoryNames.map(categoryName => (
            <div key={categoryName} className="category-group">
              <h2 className="category-title">{categoryName}</h2>
              <div className="dashboard-grid">
                {appsByCategory[categoryName]?.map(app => {
                  // Verificar se o utilizador tem acesso à aplicação
                  const hasAccess = 
                    app.id !== 'acessos_alteracoes' || user?.nivelAcesso === 'Super User';
                  
                  // Verificar se tem integração Firebase
                  const hasFirebaseIntegration = ['reservas', 'recolhas', 'entregas'].includes(app.id);
                  
                  return (
                    <button 
                      key={app.id} 
                      className={`subapp-button-dashboard ${!hasAccess ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => hasAccess && onNavigateToApp(app.id, app.name)}
                      disabled={!hasAccess}
                      title={!hasAccess ? 'Acesso restrito' : ''}
                    >
                      {app.name}
                      {hasFirebaseIntegration && (
                        <div className="text-xs text-green-600 mt-1">🔥 Firebase</div>
                      )}
                      {!hasAccess && <div className="text-xs text-red-500 mt-1">Restrito</div>}
                    </button>
                  );
                })} 
                {(!appsByCategory[categoryName] || appsByCategory[categoryName].length === 0) && (
                  <p className="text-xs text-gray-500 p-4">Sem aplicações nesta categoria.</p>
                )}
              </div>
            </div>
          ))}
        </main>
        
        <div className="logout-button-container">
          <button 
            onClick={() => onNavigateToApp('firebase-debug', 'Diagnóstico Firebase')} 
            className="w-full mb-2 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            🔍 Diagnosticar Firebase
          </button>
          <button id="logoutButton" onClick={handleLogout} className="w-full">
            Sair
          </button>
        </div>
      </div>
    </div>
  ); 
};



// Componente genérico para sub-aplicações
const GenericFirebaseSubAppPage = ({ appName, onNavigateToDashboard }) => { 
  return (
    <div className="subapp-page w-full max-w-4xl mx-auto p-4">
      <div className="subapp-header">
        <h1 className="subapp-title">{appName || "Sub-aplicação"}</h1>
        <button onClick={onNavigateToDashboard} className="action-button secondary">
          Voltar ao Dashboard
        </button>
      </div>
      <div className="subapp-section">
        <div className="content-placeholder">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">
              🔥 {appName} - Integração Firebase
            </h3>
            <p className="mb-4">
              Esta sub-aplicação está configurada para integrar com o Firebase admin-multipark.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg text-left mb-4">
              <h4 className="font-semibold mb-2">Funcionalidades Disponíveis:</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>✅ Leitura de dados do Firestore</li>
                <li>✅ Filtros e pesquisa avançada</li>
                <li>✅ Estatísticas em tempo real</li>
                <li>✅ Interface responsiva</li>
                <li>✅ Controlo de acesso por utilizador</li>
                <li>✅ Operações CRUD (Create, Read, Update, Delete)</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-left">
              <h4 className="font-semibold mb-2">Estado da Integração:</h4>
              <div className="text-sm space-y-1">
                <div>🔗 <strong>Firebase:</strong> Conectado</div>
                <div>🗄️ <strong>Firestore:</strong> Configurado</div>
                <div>🔐 <strong>Autenticação:</strong> Ativa</div>
                <div>📊 <strong>Dados:</strong> Prontos para uso</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ); 
};

// Estilos globais
const GlobalStyles = () => (
  <style>{`
    body {font-family: 'Inter', sans-serif; background-color: #f0f2f5; color: #333; margin: 0; line-height: 1.6;}
    .app-container, .subapp-page {min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 1rem;}
    .main-content-container {background-color: #f0f2f5; padding: 1rem; border-radius: 0.5rem; width: 100%; max-width: 1200px; display: flex; flex-direction: column; align-items: center; margin-top: 2rem; margin-bottom: 2rem;}
    .login-box {background-color: #fff; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 100%; max-width: 400px;}
    .app-logo-styled {font-size: 1.85rem; font-weight: 700; color: #0A2B5C; margin-bottom: 2rem; text-align: center; display: flex; align-items: center; justify-content: center; letter-spacing: 0.5px;}
    .app-logo-styled .logo-p-icon {background-color: #0A2B5C; color: #fff; padding: 4px 10px; margin-right: 6px; border-radius: 4px; font-family: 'Arial Black', Gadget, sans-serif; font-size: 1.9rem; line-height: 1;}
    .app-logo-styled .logo-text-multipark {color: #0A2B5C;}
    .welcome-message {font-size: 1.25rem; font-weight: 600; color: #333; margin-bottom: 1rem; text-align: center;}
    #categoriesLayoutContainer {display: grid; grid-template-columns: repeat(1, 1fr); gap: 1.5rem; width: 100%; margin-bottom: 2rem;}
    @media (min-width: 768px) {#categoriesLayoutContainer {grid-template-columns: repeat(2, 1fr);}}
    .category-group {padding: 1rem; background-color: #fff; border-radius: 0.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; flex-direction: column; min-height: 200px;}
    .category-title {font-size: 1.1rem; font-weight: 600; color: #0A2B5C; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #0d6efd;}
    .dashboard-grid {display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; width: 100%; flex-grow: 1;}
    .subapp-button-dashboard {background-color: #fff; color: #0d6efd; border: 1px solid #0d6efd; border-radius: 0.375rem; padding: 0.75rem 0.5rem; text-align: center; cursor: pointer; transition: all 0.2s ease-in-out; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); font-size: 0.8rem; word-break: break-word; font-weight: 600; line-height: 1.2;}
    .subapp-button-dashboard:hover:not(:disabled) {background-color: #0d6efd; color: #fff; transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1);}
    .logout-button-container {width: 100%; max-width: 320px; margin-top: 1rem;}
    #logoutButton, .action-button {color: white; font-weight: 500; padding: 0.6rem 1.2rem; border-radius: 0.375rem; transition: background-color 0.2s; border: none; cursor: pointer; width: 100%;}
    #loginButton {background-color: #0d6efd; color: white; font-weight: 600; padding: 0.75rem; border-radius: 0.375rem;}
    #loginButton:hover {background-color: #0b5ed7;}
    #logoutButton { background-color: #dc3545; }
    #logoutButton:hover { background-color: #c82333; }
    .action-button { background-color: #0d6efd; width: auto; }
    .action-button:hover { background-color: #0b5ed7; }
    .action-button.secondary { background-color: #6c757d; }
    .action-button.secondary:hover { background-color: #5a6268; }
    .subapp-header {width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 1rem; background-color: #fff; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 1.5rem;}
    .subapp-title {font-size: 1.5rem; font-weight: 600; color: #0A2B5C;}
    .subapp-section {width: 100%; background-color: #fff; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 1.5rem;}
    .subapp-section-title {font-size: 1.1rem; font-weight: 600; color: #333; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee;}
    .filters-grid, .actions-container {display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem; align-items: flex-end;}
    .filters-grid > div {display: flex; flex-direction: column; flex-grow: 1; min-width: 150px;}
    .filters-grid label {font-size: 0.875rem; margin-bottom: 0.25rem; color: #555;}
    .filters-grid input[type="text"], .filters-grid input[type="date"], .filters-grid input[type="datetime-local"], .filters-grid select {padding: 0.5rem; border: 1px solid #ccc; border-radius: 0.25rem; font-size: 0.9rem; width: 100%;}
    .table-container { overflow-x: auto; margin-top: 1rem; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 0.9em; white-space: nowrap; }
    th { background-color: #f2f2f2; font-weight: 600; }
    .content-placeholder {min-height: 150px; display: flex; flex-direction:column; align-items: center; justify-content: center; border: 2px dashed #ddd; border-radius: 0.25rem; color: #777; text-align: center; padding: 1rem;}
    .form-modal-backdrop {position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1050;}
    .form-modal-dialog {background-color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 5px 15px rgba(0,0,0,0.3); width: 100%; max-width: 600px;}
    .modal-content {background-color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 5px 15px rgba(0,0,0,0.3); width: 100%; max-width: 400px; text-align: center;}
    .form-modal-header {display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.75rem; margin-bottom: 1rem; border-bottom: 1px solid #eee;}
    .form-modal-title {font-size: 1.25rem; font-weight: 600;}
    .form-modal-body .form-group { margin-bottom: 1rem; }
    .form-modal-body .form-group label { display: block; margin-bottom: 0.3rem; font-size: 0.875rem; font-weight:500; }
    .form-modal-body .form-group input, .form-modal-body .form-group select, .form-modal-body .form-group textarea { width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 0.25rem; font-size: 0.9rem;}
    .form-modal-footer {padding-top: 1rem; margin-top: 1rem; border-top: 1px solid #eee; display: flex; justify-end: flex-end; gap: 0.75rem;}
    input, select {box-sizing: border-box;}
  `}
  </style>
);

// Componente Principal da Aplicação com Firebase
export default function AppFirebase() {
  const { user, loading } = useFirebaseAuth();
  const [currentPage, setCurrentPage] = useState('dashboard'); 
  const [currentAppName, setCurrentAppName] = useState('');
  const [selectedPark, setSelectedPark] = useState(parks[0].value); 
  
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({ title: '', text: '' });
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

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
    /* console.log(`Parque selecionado: ${selectedPark}`); */ 
  }, [selectedPark]);

  // Loading screen
  if (loading) {
    return (
      <>
        <GlobalStyles />
        <div className="app-container flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Carregando aplicação Firebase...</p>
            <p className="text-sm text-gray-500 mt-2">Conectando ao admin-multipark</p>
          </div>
        </div>
      </>
    );
  }

  // Login screen
  if (!user) {
    return (
      <>
        <GlobalStyles />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
        
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
        
        <FirebaseLoginPage onShowRegister={handleShowRegisterModal} />
      </>
    );
  }

  return (
    <>
      <GlobalStyles />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com"></script> 
      
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

      {currentPage === 'dashboard' && (
        <FirebaseDashboardPage 
          onNavigateToApp={handleNavigateToApp} 
          selectedPark={selectedPark} 
          setSelectedPark={setSelectedPark} 
        />
      )}
      
      {currentPage.startsWith('app/') && (
        (() => {
          const appId = currentPage.split('/')[1];
          
          // Routing para as sub-aplicações com Firebase
          if (appId === 'firebase-debug') {
            return <FirebaseCollectionExplorer onNavigateToDashboard={handleNavigateToDashboard} />;
          }
          
          if (appId === 'reservas') {
            return <ReservasFirebaseRealSubAppPage appName={currentAppName} onNavigateToDashboard={handleNavigateToDashboard} />;
          }
          
          if (appId === 'recolhas') {
            return <RecolhasFirebaseSubAppPage appName={currentAppName} onNavigateToDashboard={handleNavigateToDashboard} />;
          }
          
          // Para outras sub-aplicações, usar componente genérico Firebase
          return <GenericFirebaseSubAppPage appName={currentAppName} onNavigateToDashboard={handleNavigateToDashboard} />;
        })()
      )}
    </>
  );
}
