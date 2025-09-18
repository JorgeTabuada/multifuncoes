import React, { useState, useEffect } from 'react';

// Placeholder for Lucide icons (or any other icon library you'd use in Next.js)
const IconPlaceholder = ({ name, className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 12m-9 0a9 9 0 1018 0a9 9 0 10-18 0"></path><text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="10">{name.substring(0,1)}</text></svg>;
const CalendarDays = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const List = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>;
const LayoutGrid = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>;
const Users = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const DollarSign = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const UploadCloud = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>;
const X = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const FileText = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;
const BarChart3 = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>;
const Filter = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const Map = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>;
const Mic = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>;
const ShieldAlert = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>;
const History = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>;
const BookOpen = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const HelpCircle = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>;
const Search = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const DownloadCloud = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>;


// Dados das Subaplicações (mantidos)
const subAppsData = [ { id: 'recolhas', name: 'Recolhas', category: 'Operacional', href: '/apps/recolhas' }, { id: 'entregas', name: 'Entregas', category: 'Operacional', href: '/apps/entregas' }, { id: 'caixa_multipark', name: 'Caixa Multipark', category: 'Operacional', href: '/apps/caixa_multipark' }, { id: 'cancelamentos', name: 'Cancelamentos', category: 'Operacional', href: '/apps/cancelamentos' }, { id: 'reservas', name: 'Reservas', category: 'Operacional', href: '/apps/reservas' }, { id: 'confirmacao_caixa', name: 'Confirmação de Caixa', category: 'Operacional', href: '/apps/confirmacao_caixa' }, { id: 'marketing', name: 'Marketing', category: 'Análises', href: '/apps/marketing' }, { id: 'relatorios', name: 'Relatórios', category: 'Análises', href: '/apps/relatorios' }, { id: 'produtividade_condutores', name: 'Produtividade Condutores', category: 'Análises', href: '/apps/produtividade_condutores' }, { id: 'comportamentos', name: 'Comportamentos', category: 'Análises', href: '/apps/comportamentos' }, { id: 'mapa_ocupacao', name: 'Mapa de Ocupação', category: 'Análises', href: '/apps/mapa_ocupacao' }, { id: 'bi_interno', name: 'BI Interno', category: 'Análises', href: '/apps/bi_interno' }, { id: 'despesas', name: 'Despesas', category: 'Gestão', href: '/apps/despesas' }, { id: 'faturacao', name: 'Faturação', category: 'Gestão', href: '/apps/faturacao' }, { id: 'recursos_humanos', name: 'Recursos Humanos', category: 'Gestão', href: '/apps/recursos_humanos' }, { id: 'projetos', name: 'Projetos', category: 'Gestão', href: '/apps/projetos' }, { id: 'tarefas', name: 'Tarefas', category: 'Gestão', href: '/apps/tarefas' }, { id: 'hub_multipark', name: 'Hub Multipark', category: 'Gestão', href: '/apps/hub_multipark' }, { id: 'formacao_apoio', name: 'Formação & Apoio', category: 'Administração e Suporte', href: '/apps/formacao_apoio' }, { id: 'perdidos_achados', name: 'Perdidos & Achados', category: 'Administração e Suporte', href: '/apps/perdidos_achados' }, { id: 'comentarios_reclamacoes', name: 'Comentários & Reclamações', category: 'Administração e Suporte', href: '/apps/comentarios_reclamacoes' }, { id: 'auditorias_internas', name: 'Auditorias Internas', category: 'Administração e Suporte', href: '/apps/auditorias_internas' }, { id: 'acessos_alteracoes', name: 'Acessos e Alterações', category: 'Administração e Suporte', href: '/apps/acessos_alteracoes' } ];
const orderedCategoryNames = ['Operacional', 'Gestão', 'Análises', 'Administração e Suporte'];
const parks = [ { value: 'lisboa', label: 'LISBOA' }, { value: 'porto', label: 'PORTO' }, { value: 'faro', label: 'FARO' }, ];
const projectOptions = [ { value: 'proj1', label: 'Projeto Alpha' }, { value: 'proj2', label: 'Projeto Beta' }, { value: 'proj3', label: 'Manutenção Geral' }, ];

// Componentes UI (AppLogo, Modais, etc. - Mantidos para contexto e funcionalidade)
const AppLogo = () => (<div className="app-logo-styled"><span className="logo-p-icon">P</span><span className="logo-text-multipark">MULTIPARK</span></div>);
const MessageModal = ({ title, message, isOpen, onClose }) => { if (!isOpen) return null; return (<div className="form-modal-backdrop"><div className="modal-content"><h2 className="text-xl font-semibold mb-4">{title}</h2><p className="mb-6">{message}</p><button onClick={onClose} className="action-button">Fechar</button></div></div>); };
const RegisterModal = ({ isOpen, onClose, onSubmit }) => { const [firstName, setFirstName] = useState(''); const [lastName, setLastName] = useState(''); const [phone, setPhone] = useState(''); const [email, setEmail] = useState(''); const [formError, setFormError] = useState(''); if (!isOpen) return null; const handleSubmit = (e) => { e.preventDefault(); if (!firstName || !lastName || !phone || !email) { setFormError('Todos os campos são obrigatórios.'); return; } setFormError(''); console.log('Submissão de Registo:', { firstName, lastName, phone, email }); onSubmit({ firstName, lastName, phone, email }); }; return (<div className="form-modal-backdrop"><div className="form-modal-dialog"><div className="form-modal-header"><h2 className="form-modal-title">Pedido de Registo</h2><button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X className="h-6 w-6" /></button></div><form onSubmit={handleSubmit}><div className="form-modal-body"><div className="form-group"><label htmlFor="regFirstName">Primeiro Nome</label><input type="text" id="regFirstName" value={firstName} onChange={e => setFirstName(e.target.value)} required /></div><div className="form-group"><label htmlFor="regLastName">Último Nome</label><input type="text" id="regLastName" value={lastName} onChange={e => setLastName(e.target.value)} required /></div><div className="form-group"><label htmlFor="regPhone">Número de Telefone</label><input type="tel" id="regPhone" value={phone} onChange={e => setPhone(e.target.value)} required /></div><div className="form-group"><label htmlFor="regEmail">Email</label><input type="email" id="regEmail" value={email} onChange={e => setEmail(e.target.value)} required /></div>{formError && <p className="text-red-500 text-sm mt-2">{formError}</p>}</div><div className="form-modal-footer"><button type="button" onClick={onClose} className="action-button secondary">Cancelar</button><button type="submit" className="action-button">Submeter Pedido</button></div></form></div></div>); };
const LoginPage = ({ onLogin, onShowRegister }) => { const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [errorMessage, setErrorMessage] = useState(''); const handleSubmit = (e) => { e.preventDefault(); setErrorMessage(''); if (email && password) { console.log('Attempting login with:', email); onLogin({ fullName: email.split('@')[0] || 'Utilizador Teste', email }); } else { setErrorMessage('Email e Palavra-passe são obrigatórios.'); } }; return (<div className="app-container flex justify-center items-center"><div className="login-box"><AppLogo /><form onSubmit={handleSubmit}><div className="mb-4"><label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="o.seu@email.com" /></div><div className="mb-6"><label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Palavra-passe</label><input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="********" /></div><button type="submit" id="loginButton" className="w-full">Entrar</button></form>{errorMessage && <p className="text-red-500 text-sm mt-3 text-center">{errorMessage}</p>}<div className="mt-6 text-center"><button onClick={onShowRegister} className="text-sm text-blue-600 hover:text-blue-800 hover:underline">Não tem conta? Registe-se aqui.</button></div></div></div>); };
const DashboardPage = ({ user, onLogout, onNavigateToApp, selectedPark, setSelectedPark }) => { const appsByCategory = subAppsData.reduce((acc, app) => { if (!acc[app.category]) acc[app.category] = []; acc[app.category].push(app); return acc; }, {}); for (const category in appsByCategory) { appsByCategory[category].sort((a, b) => { if (category === 'Gestão') { if (a.id === 'hub_multipark') return 1; if (b.id === 'hub_multipark') return -1; } return a.name.localeCompare(b.name); }); } return (<div className="app-container"><div className="main-content-container"><AppLogo /><div className="welcome-message">BEM-VINDO DE VOLTA, <span id="userName">{user?.fullName?.toUpperCase() || 'UTILIZADOR'}</span>!</div><div className="park-selector-buttons-container mb-6 flex justify-center space-x-2 w-full max-w-md">{parks.map(park => (<button key={park.value} onClick={() => setSelectedPark(park.value)} className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${selectedPark === park.value ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'}`}>{park.label}</button>))}</div><main id="categoriesLayoutContainer" className="w-full">{orderedCategoryNames.map(categoryName => (<div key={categoryName} className="category-group"><h2 className="category-title">{categoryName}</h2><div className="dashboard-grid">{appsByCategory[categoryName]?.map(app => (<button key={app.id} className="subapp-button-dashboard" onClick={() => onNavigateToApp(app.id, app.name)}>{app.name}</button>))} {(!appsByCategory[categoryName] || appsByCategory[categoryName].length === 0) && (<p className="text-xs text-gray-500 p-4">Sem aplicações nesta categoria.</p>)}</div></div>))}</main><div className="logout-button-container"><button id="logoutButton" onClick={onLogout} className="w-full">Sair</button></div></div></div>); };

// Componentes das Sub-Aplicações (Operacionais, Gestão, Análises - Mantidos para contexto)
const OperacionalSubAppBase = ({ appName, itemName, onNavigateToDashboard }) => { const mockData = [ { id: 'OP123', data: '01/06/2025 10:00', detalhes: `Detalhe ${itemName} 1`, valor: '50,00 €', estado: 'Pendente' }, { id: 'OP124', data: '01/06/2025 11:30', detalhes: `Detalhe ${itemName} 2`, valor: '75,00 €', estado: 'Concluído' }, ]; const [showActionModal, setShowActionModal] = useState(false); const [modalActionInfo, setModalActionInfo] = useState({ title: '', message: ''}); const handleActionClick = (action, itemId) => { setModalActionInfo({ title: `${action} ${itemName}`, message: `Confirma que pretende ${action.toLowerCase()} o item ${itemId}?` }); setShowActionModal(true); }; return (<div className="subapp-page w-full max-w-6xl mx-auto p-4"><div className="subapp-header"><h1 className="subapp-title">{appName}</h1><button onClick={onNavigateToDashboard} className="action-button secondary">Voltar</button></div><section className="subapp-section"><h2 className="subapp-section-title">Registar/Importar {itemName}</h2><div className="content-placeholder mb-4">Formulário para registo manual de {itemName.toLowerCase()}.</div><div className="flex items-center gap-4 mb-6"><label className="block text-sm font-medium text-gray-700">Importar (Excel/JSON/Voz):</label><input type="file" className="p-2 border rounded-md text-sm flex-grow"/><button className="action-button">Importar</button></div></section><section className="subapp-section"><h2 className="subapp-section-title">Dashboard de {itemName}</h2><div className="table-container"><table><thead><tr><th>ID</th><th>Data</th><th>Detalhes</th><th>Valor</th><th>Estado</th><th>Ações</th></tr></thead><tbody>{mockData.map(item => (<tr key={item.id}><td>{item.id}</td><td>{item.data}</td><td>{item.detalhes}</td><td>{item.valor}</td><td>{item.estado}</td><td><button onClick={() => handleActionClick('Editar', item.id)} className="action-button mr-2">Editar</button><button onClick={() => handleActionClick('Eliminar', item.id)} className="action-button secondary">Eliminar</button></td></tr>))}</tbody></table></div></section>{showActionModal && (<MessageModal title={modalActionInfo.title} message={modalActionInfo.message} isOpen={showActionModal} onClose={() => setShowActionModal(false)} />)}</div>); };

const ReservasSubAppPage = ({ appName, onNavigateToDashboard }) => { const [selectedProject, setSelectedProject] = useState(''); const [startDate, setStartDate] = useState(''); const [endDate, setEndDate] = useState(''); const [clientName, setClientName] = useState(''); const [vehiclePlate, setVehiclePlate] = useState(''); return (<div className="subapp-page w-full max-w-6xl mx-auto p-4"><div className="subapp-header"><h1 className="subapp-title">{appName}</h1><button onClick={onNavigateToDashboard} className="action-button secondary">Voltar</button></div><section className="subapp-section"><h2 className="subapp-section-title">Filtros de Pesquisa</h2><div className="filters-grid mb-6"><div><label>Projeto:</label><select value={selectedProject} onChange={e => setSelectedProject(e.target.value)}><option value="">Todos os Projetos</option>{projectOptions.map(proj => <option key={proj.value} value={proj.value}>{proj.label}</option>)}</select></div><div><label>Data Início:</label><input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} /></div><div><label>Data Fim:</label><input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} /></div><div><label>Nome do Cliente:</label><input type="text" placeholder="Nome do cliente" value={clientName} onChange={e => setClientName(e.target.value)} /></div><div><label>Matrícula do Veículo:</label><input type="text" placeholder="XX-XX-XX" value={vehiclePlate} onChange={e => setVehiclePlate(e.target.value)} /></div><button className="action-button self-end"><Filter className="h-4 w-4 inline mr-1"/> Aplicar Filtros</button></div></section><section className="subapp-section"><h2 className="subapp-section-title">Resultados das Reservas</h2><div className="content-placeholder">Tabela com reservas filtradas. Colunas: ID, Cliente, Veículo, Data/Hora, Projeto, Estado, Ações.</div></section></div>); };

const MapaOcupacaoSubAppPage = ({ appName, onNavigateToDashboard }) => { return (<div className="subapp-page w-full max-w-6xl mx-auto p-4"><div className="subapp-header"><h1 className="subapp-title">{appName}</h1><button onClick={onNavigateToDashboard} className="action-button secondary">Voltar</button></div><section className="subapp-section"><h2 className="subapp-section-title">Visualização do Mapa de Ocupação (Futuro)</h2><div className="content-placeholder"><Map className="h-16 w-16 text-gray-400 mb-4"/><p>Este mapa irá mostrar a ocupação futura com base na capacidade dos parques e nas reservas existentes.</p><p className="text-sm mt-2">Tipos de lugares: Coberto, Descoberto, Indoor.</p><p className="text-sm">Projeção para os próximos meses/ano.</p></div></section><section className="subapp-section"><h2 className="subapp-section-title">Dados de Capacidade e Reservas</h2><div className="content-placeholder">Informação agregada sobre capacidade e reservas.</div></section></div>); };

const ProdutividadeCondutoresSubAppPage = ({ appName, onNavigateToDashboard }) => { const [excelProdFile, setExcelProdFile] = useState(''); return (<div className="subapp-page w-full max-w-6xl mx-auto p-4"><div className="subapp-header"><h1 className="subapp-title">{appName}</h1><button onClick={onNavigateToDashboard} className="action-button secondary">Voltar</button></div><section className="subapp-section"><h2 className="subapp-section-title">Carregar Ficheiro de Produtividade (Excel)</h2><div className="flex items-center gap-4 mb-6"><label htmlFor="produtividadeExcel" className="flex-grow p-2 border rounded-md text-sm cursor-pointer hover:bg-gray-50 flex items-center"><FileText className="h-4 w-4 mr-2"/> {excelProdFile || "Escolher Excel de Produtividade"}</label><input type="file" id="produtividadeExcel" className="hidden" accept=".xls,.xlsx" onChange={(e) => setExcelProdFile(e.target.files && e.target.files[0] ? e.target.files[0].name : '')} /><button className="action-button">Processar Ficheiro</button></div></section><section className="subapp-section"><h2 className="subapp-section-title">Dashboard de Produtividade</h2><div className="content-placeholder"><BarChart3 className="h-16 w-16 text-gray-400 mb-4"/>Métricas: Nº folhas, entregas/recolhas (médias), movimentações, carros mexidos, tempos parados, zonas de atividade.<p className="text-sm mt-2">Comparação com tabelas de reservas e condutores.</p></div></section></div>); };

const RelatoriosSubAppPage = ({ appName, onNavigateToDashboard }) => { return (<div className="subapp-page w-full max-w-6xl mx-auto p-4"><div className="subapp-header"><h1 className="subapp-title">{appName}</h1><button onClick={onNavigateToDashboard} className="action-button secondary">Voltar</button></div><section className="subapp-section"><h2 className="subapp-section-title">Gerador de Relatórios Personalizados</h2><div className="filters-grid mb-6"><div><label>Intervalo de Datas:</label><div className="flex gap-2"><input type="date" /><input type="date" /></div></div><div><label>Tipo de Operação:</label><select><option>Todas</option><option>Reservas</option><option>Recolhas</option></select></div><div><label>Parque:</label><select><option>Todos</option>{parks.map(p=><option key={p.value} value={p.value}>{p.label}</option>)}</select></div><button className="action-button self-end"><Filter className="h-4 w-4 inline mr-1"/> Aplicar Filtros e Gerar</button></div></section><section className="subapp-section"><h2 className="subapp-section-title">Dashboard do Relatório</h2><div className="content-placeholder"><BarChart3 className="h-16 w-16 text-gray-400 mb-4"/>Resultados do relatório com base nos filtros aplicados.</div></section></div>); };

const MarketingSubAppPage = ({ appName, onNavigateToDashboard }) => { const [gaFile, setGaFile] = useState(''); const [adsFile, setAdsFile] = useState(''); const [fbFile, setFbFile] = useState(''); const [bingFile, setBingFile] = useState(''); const handleFileUpload = (setter) => (e) => setter(e.target.files && e.target.files[0] ? e.target.files[0].name : ''); return (<div className="subapp-page w-full max-w-6xl mx-auto p-4"><div className="subapp-header"><h1 className="subapp-title">{appName}</h1><button onClick={onNavigateToDashboard} className="action-button secondary">Voltar</button></div><section className="subapp-section"><h2 className="subapp-section-title">Carregar Dados de Marketing (JSON/CSV)</h2><div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"><div><label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics</label><label htmlFor="gaFile" className="flex-grow p-2 border rounded-md text-sm cursor-pointer hover:bg-gray-50 flex items-center"><FileText className="h-4 w-4 mr-2"/> {gaFile || "Escolher Ficheiro"}</label><input type="file" id="gaFile" className="hidden" accept=".json,.csv" onChange={handleFileUpload(setGaFile)} /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Google Ads</label><label htmlFor="adsFile" className="flex-grow p-2 border rounded-md text-sm cursor-pointer hover:bg-gray-50 flex items-center"><FileText className="h-4 w-4 mr-2"/> {adsFile || "Escolher Ficheiro"}</label><input type="file" id="adsFile" className="hidden" accept=".json,.csv" onChange={handleFileUpload(setAdsFile)} /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Facebook Ads</label><label htmlFor="fbFile" className="flex-grow p-2 border rounded-md text-sm cursor-pointer hover:bg-gray-50 flex items-center"><FileText className="h-4 w-4 mr-2"/> {fbFile || "Escolher Ficheiro"}</label><input type="file" id="fbFile" className="hidden" accept=".json,.csv" onChange={handleFileUpload(setFbFile)} /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Bing Ads</label><label htmlFor="bingFile" className="flex-grow p-2 border rounded-md text-sm cursor-pointer hover:bg-gray-50 flex items-center"><FileText className="h-4 w-4 mr-2"/> {bingFile || "Escolher Ficheiro"}</label><input type="file" id="bingFile" className="hidden" accept=".json,.csv" onChange={handleFileUpload(setBingFile)} /></div></div><div className="text-center"><button className="action-button">Processar Dados de Marketing</button></div></section><section className="subapp-section"><h2 className="subapp-section-title">Dashboard de Marketing</h2><div className="content-placeholder"><BarChart3 className="h-16 w-16 text-gray-400 mb-4"/>Custos, comparação com reservas, performance de campanhas (online vs. telefone).</div></section></div>); };

// NOVOS Componentes para Administração e Suporte
const AcessosAlteracoesSubAppPage = ({ appName, onNavigateToDashboard }) => {
    const [activeTab, setActiveTab] = useState('gestaoAcessos'); // 'gestaoAcessos' ou 'logAlteracoes'
    // Estados para o formulário de Gestão de Acessos
    const [userName, setUserName] = useState('');
    const [docId, setDocId] = useState('');
    const [nif, setNif] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [declaracaoResp, setDeclaracaoResp] = useState('');

    // Estados para filtros do Log de Alterações
    const [logDateStart, setLogDateStart] = useState('');
    const [logDateEnd, setLogDateEnd] = useState('');
    const [logUser, setLogUser] = useState('');
    const [logApp, setLogApp] = useState('');
    const [logMatricula, setLogMatricula] = useState('');

    const handleFileUpload = (setter) => (e) => setter(e.target.files && e.target.files[0] ? e.target.files[0].name : '');
    const handleCreateAcesso = (e) => { e.preventDefault(); console.log("Criar Acesso:", {userName, docId, nif, email, telefone, declaracaoResp}); /* Lógica de submissão */};
    const handleSearchLog = (e) => { e.preventDefault(); console.log("Pesquisar Log:", {logDateStart, logDateEnd, logUser, logApp, logMatricula}); /* Lógica de pesquisa */};

    return (
        <div className="subapp-page w-full max-w-6xl mx-auto p-4">
            <div className="subapp-header"><h1 className="subapp-title">{appName}</h1><button onClick={onNavigateToDashboard} className="action-button secondary">Voltar</button></div>
            <div className="mb-4 border-b border-gray-200"><nav className="-mb-px flex space-x-8"><button onClick={() => setActiveTab('gestaoAcessos')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'gestaoAcessos' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}><Users className="inline h-5 w-5 mr-2"/> Gestão de Acessos</button><button onClick={() => setActiveTab('logAlteracoes')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'logAlteracoes' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}><History className="inline h-5 w-5 mr-2"/> Log de Alterações (Super User)</button></nav></div>

            {activeTab === 'gestaoAcessos' && (
                <section className="subapp-section">
                    <h2 className="subapp-section-title">Criar/Gerir Acesso de Utilizador</h2>
                    <form onSubmit={handleCreateAcesso} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div><label>Nome do Utilizador:</label><input type="text" value={userName} onChange={e=>setUserName(e.target.value)} required className="mt-1 block w-full"/></div>
                            <div><label>Documento de Identificação:</label><input type="text" value={docId} onChange={e=>setDocId(e.target.value)} required className="mt-1 block w-full"/></div>
                            <div><label>Nº Contribuinte:</label><input type="text" value={nif} onChange={e=>setNif(e.target.value)} required className="mt-1 block w-full"/></div>
                            <div><label>Email:</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="mt-1 block w-full"/></div>
                            <div><label>Telefone:</label><input type="tel" value={telefone} onChange={e=>setTelefone(e.target.value)} required className="mt-1 block w-full"/></div>
                            <div><label>Declaração de Responsabilidade:</label><label htmlFor="declaracaoFile" className="flex-grow p-2 border rounded-md text-sm cursor-pointer hover:bg-gray-50 flex items-center mt-1"><UploadCloud className="h-4 w-4 mr-2"/> {declaracaoResp || "Carregar ficheiro"}</label><input type="file" id="declaracaoFile" className="hidden" onChange={handleFileUpload(setDeclaracaoResp)} /></div>
                        </div>
                        <div className="text-right"><button type="submit" className="action-button">Guardar Acesso</button></div>
                    </form>
                    <div className="mt-6 content-placeholder">Listagem de utilizadores com acessos e opções de edição/remoção.</div>
                </section>
            )}
            {activeTab === 'logAlteracoes' && (
                 <section className="subapp-section">
                    <h2 className="subapp-section-title">Consultar Log de Alterações da Aplicação</h2>
                    <form onSubmit={handleSearchLog} className="filters-grid mb-6">
                        <div><label>Data Início:</label><input type="date" value={logDateStart} onChange={e=>setLogDateStart(e.target.value)} /></div>
                        <div><label>Data Fim:</label><input type="date" value={logDateEnd} onChange={e=>setLogDateEnd(e.target.value)} /></div>
                        <div><label>Utilizador:</label><input type="text" placeholder="Todos" value={logUser} onChange={e=>setLogUser(e.target.value)} /></div>
                        <div><label>Aplicação:</label><input type="text" placeholder="Todas" value={logApp} onChange={e=>setLogApp(e.target.value)} /></div>
                        <div><label>Matrícula/Alocação:</label><input type="text" value={logMatricula} onChange={e=>setLogMatricula(e.target.value)} /></div>
                        <button type="submit" className="action-button self-end"><Search className="h-4 w-4 mr-1 inline"/> Pesquisar Log</button>
                    </form>
                    <div className="content-placeholder">Tabela com logs: Timestamp, Utilizador, Ação, Detalhes, Sub-aplicação, Tempo Gasto. (Acesso Super User)</div>
                </section>
            )}
        </div>
    );
};

const AuditoriasInternasSubAppPage = ({ appName, onNavigateToDashboard }) => {
    const [excelAuditFile, setExcelAuditFile] = useState('');
    const [jsonAuditFile, setJsonAuditFile] = useState('');
    const [audioAuditFile, setAudioAuditFile] = useState('');
    return (
        <div className="subapp-page w-full max-w-6xl mx-auto p-4">
            <div className="subapp-header"><h1 className="subapp-title">{appName}</h1><button onClick={onNavigateToDashboard} className="action-button secondary">Voltar</button></div>
            <section className="subapp-section">
                <h2 className="subapp-section-title">Carregar Ficheiros para Auditoria</h2>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Ficheiro Excel</label><label htmlFor="auditExcel" className="flex-grow p-2 border rounded-md text-sm cursor-pointer hover:bg-gray-50 flex items-center"><FileText className="h-4 w-4 mr-2"/> {excelAuditFile || "Escolher Excel"}</label><input type="file" id="auditExcel" className="hidden" accept=".xls,.xlsx" onChange={(e) => setExcelAuditFile(e.target.files && e.target.files[0] ? e.target.files[0].name : '')} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Ficheiro JSON</label><label htmlFor="auditJson" className="flex-grow p-2 border rounded-md text-sm cursor-pointer hover:bg-gray-50 flex items-center"><FileText className="h-4 w-4 mr-2"/> {jsonAuditFile || "Escolher JSON"}</label><input type="file" id="auditJson" className="hidden" accept=".json" onChange={(e) => setJsonAuditFile(e.target.files && e.target.files[0] ? e.target.files[0].name : '')} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Ficheiro Voz</label><label htmlFor="auditAudio" className="flex-grow p-2 border rounded-md text-sm cursor-pointer hover:bg-gray-50 flex items-center"><Mic className="h-4 w-4 mr-2"/> {audioAuditFile || "Escolher Áudio"}</label><input type="file" id="auditAudio" className="hidden" accept="audio/*" onChange={(e) => setAudioAuditFile(e.target.files && e.target.files[0] ? e.target.files[0].name : '')} /></div>
                </div>
                <div className="text-center"><button className="action-button">Processar Ficheiros de Auditoria</button></div>
            </section>
            <section className="subapp-section">
                <h2 className="subapp-section-title">Painel de Auditoria</h2>
                <div className="filters-grid mb-6">
                    <div><label>Datas:</label><div className="flex gap-2"><input type="date" /><input type="date" /></div></div>
                    <div><label>Condutor:</label><input type="text" placeholder="Todos"/></div>
                    <div><label>Reserva (ID/Matrícula):</label><input type="text"/></div>
                    <button className="action-button self-end"><Filter className="h-4 w-4 inline mr-1"/> Filtrar Auditoria</button>
                </div>
                <div className="content-placeholder">Dashboard com resultados: Movimentações de carros, velocidades, incidentes (toques), etc.</div>
            </section>
        </div>
    );
};

const ComentariosReclamacoesSubAppPage = ({ appName, onNavigateToDashboard }) => {
    const [fileCR, setFileCR] = useState('');
    return (
        <div className="subapp-page w-full max-w-6xl mx-auto p-4">
            <div className="subapp-header"><h1 className="subapp-title">{appName}</h1><button onClick={onNavigateToDashboard} className="action-button secondary">Voltar</button></div>
            <section className="subapp-section">
                <h2 className="subapp-section-title">Registar/Importar Comentário ou Reclamação</h2>
                <div className="content-placeholder mb-4">Formulário para registo manual (Cliente, Contacto, Descrição, Tipo, etc.)</div>
                <div className="flex items-center gap-4 mb-6">
                    <label className="block text-sm font-medium text-gray-700">Importar (Excel/JSON/Voz):</label>
                    <label htmlFor="fileCR" className="flex-grow p-2 border rounded-md text-sm cursor-pointer hover:bg-gray-50 flex items-center"><FileText className="h-4 w-4 mr-2"/> {fileCR || "Escolher Ficheiro"}</label>
                    <input type="file" id="fileCR" className="hidden" onChange={(e) => setFileCR(e.target.files && e.target.files[0] ? e.target.files[0].name : '')} />
                    <button className="action-button">Importar</button>
                </div>
                 <div className="flex items-center gap-4 mb-6">
                    <label className="block text-sm font-medium text-gray-700">Vídeos do Veículo (Entrada/Saída):</label>
                    <button className="action-button secondary"><DownloadCloud className="h-4 w-4 inline mr-1"/> Descarregar Vídeos (Placeholder)</button>
                </div>
            </section>
            <section className="subapp-section">
                <h2 className="subapp-section-title">Dashboard de Comentários e Reclamações (CRM)</h2>
                <div className="content-placeholder">
                    Listagem/Kanban de tickets. Filtros. Avisos de SLA (4 dias sem contacto, 1 mês sem resolução).
                    <ShieldAlert className="h-8 w-8 text-orange-500 my-2"/>
                    Placeholder para sistema de avisos.
                </div>
            </section>
        </div>
    );
};

const FormacaoApoioSubAppPage = ({ appName, onNavigateToDashboard }) => {
    const faqCategories = [
        { title: "Dashboard Multipark", qas: [{q: "Como aceder?", a:"..."}] },
        { title: "Backoffice Multipark", qas: [{q: "Onde gerir reservas?", a:"..."}] },
        { title: "Azul Multipark", qas: [] },
        { title: "Zelo Multipark", qas: [] },
        { title: "Regras de Vestuário e Comportamento", qas: [] },
        { title: "Proceder numa Reclamação", qas: [] },
        // ... mais categorias e FAQs
    ];
    const [activeFaq, setActiveFaq] = useState(null);

    return (
        <div className="subapp-page w-full max-w-6xl mx-auto p-4">
            <div className="subapp-header"><h1 className="subapp-title">{appName}</h1><button onClick={onNavigateToDashboard} className="action-button secondary">Voltar</button></div>
            <section className="subapp-section">
                <h2 className="subapp-section-title">Repositório de Documentos</h2>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Carregar PowerPoint:</label><input type="file" accept=".ppt,.pptx" className="p-2 border rounded-md text-sm w-full"/></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Carregar Excel:</label><input type="file" accept=".xls,.xlsx" className="p-2 border rounded-md text-sm w-full"/></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Carregar Word:</label><input type="file" accept=".doc,.docx" className="p-2 border rounded-md text-sm w-full"/></div>
                </div>
                <div className="content-placeholder">Listagem de documentos carregados, organizados por pastas/categorias.</div>
            </section>
            <section className="subapp-section">
                <h2 className="subapp-section-title">FAQ - Perguntas Frequentes</h2>
                <div className="space-y-2">
                    {faqCategories.map((cat, index) => (
                        <div key={index} className="border rounded-md">
                            <button onClick={() => setActiveFaq(activeFaq === index ? null : index)} className="w-full text-left p-3 font-medium hover:bg-gray-50 flex justify-between items-center">
                                {cat.title} <HelpCircle className={`h-5 w-5 transform transition-transform ${activeFaq === index ? 'rotate-180' : ''}`} />
                            </button>
                            {activeFaq === index && (
                                <div className="p-3 border-t bg-gray-50 text-sm">
                                    {cat.qas.length > 0 ? cat.qas.map((item, i) => <div key={i} className="mb-1"><strong>P: {item.q}</strong><p>R: {item.a}</p></div>) : <p>Sem FAQs nesta categoria ainda.</p>}
                                    <div className="content-placeholder mt-2">Conteúdo detalhado da formação aqui.</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

const PerdidosAchadosSubAppPage = ({ appName, onNavigateToDashboard }) => {
    return (
        <div className="subapp-page w-full max-w-6xl mx-auto p-4">
            <div className="subapp-header"><h1 className="subapp-title">{appName}</h1><button onClick={onNavigateToDashboard} className="action-button secondary">Voltar</button></div>
            <section className="subapp-section">
                <h2 className="subapp-section-title">Registar Item Perdido/Achado</h2>
                <div className="content-placeholder">Formulário para registo (Descrição, Data, Local, Cliente, Veículo, etc.). Importação de ficheiros (Excel, JSON, Voz).</div>
            </section>
            <section className="subapp-section">
                <h2 className="subapp-section-title">Investigação e Análise</h2>
                <div className="filters-grid mb-6">
                    <div><label>Condutor(es):</label><input type="text" placeholder="Nome(s) do(s) condutor(es)"/></div>
                    <div><label>Veículo (Matrícula/Alocação):</label><input type="text"/></div>
                    <div><label>Intervalo de Datas:</label><div className="flex gap-2"><input type="date" /><input type="date" /></div></div>
                    <button className="action-button self-end"><Search className="h-4 w-4 inline mr-1"/> Pesquisar</button>
                </div>
                <div className="content-placeholder">
                    Dashboard com resultados da investigação: Quem mexeu nos carros, condutores frequentes, cruzamento de dados.
                    <p className="text-sm mt-2">Avisos de SLA similares a reclamações.</p>
                </div>
            </section>
        </div>
    );
};


const GenericSubAppPage = ({ appName, onNavigateToDashboard }) => { return (<div className="subapp-page w-full max-w-4xl mx-auto p-4"><div className="subapp-header"><h1 className="subapp-title">{appName || "Sub-aplicação"}</h1><button onClick={onNavigateToDashboard} className="action-button secondary">Voltar ao Dashboard</button></div><div className="subapp-section"><div className="content-placeholder">Conteúdo para "{appName}" em desenvolvimento.</div></div></div>); };

// Componentes das Sub-Aplicações Operacionais
const RecolhasSubAppPage = ({ appName, onNavigateToDashboard }) => <OperacionalSubAppBase appName={appName} itemName="Recolha" onNavigateToDashboard={onNavigateToDashboard} />;
const EntregasSubAppPage = ({ appName, onNavigateToDashboard }) => <OperacionalSubAppBase appName={appName} itemName="Entrega" onNavigateToDashboard={onNavigateToDashboard} />;
const CancelamentosSubAppPage = ({ appName, onNavigateToDashboard }) => <OperacionalSubAppBase appName={appName} itemName="Cancelamento" onNavigateToDashboard={onNavigateToDashboard} />;
const CaixaMultiparkSubAppPage = ({ appName, onNavigateToDashboard }) => <OperacionalSubAppBase appName={appName} itemName="Movimento de Caixa" onNavigateToDashboard={onNavigateToDashboard} />;
const ConfirmacaoCaixaSubAppPage = ({ appName, onNavigateToDashboard }) => <OperacionalSubAppBase appName={appName} itemName="Confirmação" onNavigateToDashboard={onNavigateToDashboard} />;

// Componentes das Sub-Aplicações de Gestão
const DespesasSubAppPage = ({ appName, onNavigateToDashboard }) => <OperacionalSubAppBase appName={appName} itemName="Despesa" onNavigateToDashboard={onNavigateToDashboard} />;
const ProjetosSubAppPage = ({ appName, onNavigateToDashboard }) => <OperacionalSubAppBase appName={appName} itemName="Projeto" onNavigateToDashboard={onNavigateToDashboard} />;
const TarefasSubAppPage = ({ appName, onNavigateToDashboard }) => <OperacionalSubAppBase appName={appName} itemName="Tarefa" onNavigateToDashboard={onNavigateToDashboard} />;
const RecursosHumanosSubAppPage = ({ appName, onNavigateToDashboard }) => <OperacionalSubAppBase appName={appName} itemName="Funcionário" onNavigateToDashboard={onNavigateToDashboard} />;

// Componentes das Sub-Aplicações de Análises
const ComportamentosSubAppPage = ({ appName, onNavigateToDashboard }) => <OperacionalSubAppBase appName={appName} itemName="Comportamento" onNavigateToDashboard={onNavigateToDashboard} />;

// Componente Principal da Aplicação
export default function App() {
    const [currentPage, setCurrentPage] = useState('login'); 
    const [currentAppName, setCurrentAppName] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedPark, setSelectedPark] = useState(parks[0].value); 
    
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [messageModalContent, setMessageModalContent] = useState({ title: '', text: '' });
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    const handleLogin = (userData) => { setCurrentUser(userData); setCurrentPage('dashboard'); };
    const handleLogout = () => { setCurrentUser(null); setCurrentPage('login'); };
    const handleShowRegisterModal = () => setIsRegisterModalOpen(true);
    const handleCloseRegisterModal = () => setIsRegisterModalOpen(false);
    
    const handleRegisterSubmit = (formData) => { console.log("Dados do registo para 'enviar por email':", formData); setIsRegisterModalOpen(false); setMessageModalContent({ title: 'Pedido de Registo', text: 'O seu pedido de registo foi submetido. Será contactado após aprovação.' }); setIsMessageModalOpen(true); };
    const handleNavigateToApp = (appId, appName) => { setCurrentAppName(appName); setCurrentPage(`app/${appId}`); };
    const handleNavigateToDashboard = () => { setCurrentPage('dashboard'); setCurrentAppName(''); };
    
    useEffect(() => { /* console.log(`Parque selecionado: ${selectedPark}`); */ }, [selectedPark]);

    const GlobalStyles = () => (<style>{`body {font-family: 'Inter', sans-serif; background-color: #f0f2f5; color: #333; margin: 0; line-height: 1.6;} .app-container, .subapp-page {min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 1rem;} .main-content-container {background-color: #f0f2f5; padding: 1rem; border-radius: 0.5rem; width: 100%; max-width: 1200px; display: flex; flex-direction: column; align-items: center; margin-top: 2rem; margin-bottom: 2rem;} .login-box {background-color: #fff; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 100%; max-width: 400px;} .app-logo-styled {font-size: 1.85rem; font-weight: 700; color: #0A2B5C; margin-bottom: 2rem; text-align: center; display: flex; align-items: center; justify-content: center; letter-spacing: 0.5px;} .app-logo-styled .logo-p-icon {background-color: #0A2B5C; color: #fff; padding: 4px 10px; margin-right: 6px; border-radius: 4px; font-family: 'Arial Black', Gadget, sans-serif; font-size: 1.9rem; line-height: 1;} .app-logo-styled .logo-text-multipark {color: #0A2B5C;} .welcome-message {font-size: 1.25rem; font-weight: 600; color: #333; margin-bottom: 1rem; text-align: center;} #categoriesLayoutContainer {display: grid; grid-template-columns: repeat(1, 1fr); gap: 1.5rem; width: 100%; margin-bottom: 2rem;} @media (min-width: 768px) {#categoriesLayoutContainer {grid-template-columns: repeat(2, 1fr);}} .category-group {padding: 1rem; background-color: #fff; border-radius: 0.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; flex-direction: column; min-height: 200px;} .category-title {font-size: 1.1rem; font-weight: 600; color: #0A2B5C; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #0d6efd;} .dashboard-grid {display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.75rem; width: 100%; flex-grow: 1;} .subapp-button-dashboard {background-color: #fff; color: #0d6efd; border: 1px solid #0d6efd; border-radius: 0.375rem; padding: 0.75rem 0.5rem; text-align: center; cursor: pointer; transition: all 0.2s ease-in-out; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); font-size: 0.8rem; word-break: break-word; font-weight: 600; line-height: 1.2;} .subapp-button-dashboard:hover {background-color: #0d6efd; color: #fff; transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1);} .logout-button-container {width: 100%; max-width: 320px; margin-top: 1rem;} #logoutButton, .action-button {color: white; font-weight: 500; padding: 0.6rem 1.2rem; border-radius: 0.375rem; transition: background-color 0.2s; border: none; cursor: pointer; width: 100%;} #loginButton {background-color: #0d6efd; color: white; font-weight: 600; padding: 0.75rem; border-radius: 0.375rem;} #loginButton:hover {background-color: #0b5ed7;} #logoutButton { background-color: #dc3545; } #logoutButton:hover { background-color: #c82333; } .action-button { background-color: #0d6efd; width: auto; } .action-button:hover { background-color: #0b5ed7; } .action-button.secondary { background-color: #6c757d; } .action-button.secondary:hover { background-color: #5a6268; } .subapp-header {width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 1rem; background-color: #fff; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 1.5rem;} .subapp-title {font-size: 1.5rem; font-weight: 600; color: #0A2B5C;} .subapp-section {width: 100%; background-color: #fff; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 1.5rem;} .subapp-section-title {font-size: 1.1rem; font-weight: 600; color: #333; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee;} .filters-grid, .actions-container {display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem; align-items: flex-end;} .filters-grid > div {display: flex; flex-direction: column; flex-grow: 1; min-width: 150px;} .filters-grid label {font-size: 0.875rem; margin-bottom: 0.25rem; color: #555;} .filters-grid input[type="text"], .filters-grid input[type="date"], .filters-grid input[type="datetime-local"], .filters-grid select {padding: 0.5rem; border: 1px solid #ccc; border-radius: 0.25rem; font-size: 0.9rem; width: 100%;} .table-container { overflow-x: auto; margin-top: 1rem; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 0.9em; white-space: nowrap; } th { background-color: #f2f2f2; font-weight: 600; } .content-placeholder {min-height: 150px; display: flex; flex-direction:column; align-items: center; justify-content: center; border: 2px dashed #ddd; border-radius: 0.25rem; color: #777; text-align: center; padding: 1rem;} .form-modal-backdrop {position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1050;} .form-modal-dialog {background-color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 5px 15px rgba(0,0,0,0.3); width: 100%; max-width: 600px;} .modal-content {background-color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 5px 15px rgba(0,0,0,0.3); width: 100%; max-width: 400px; text-align: center;} .form-modal-header {display: flex; justify-content: space-between; align-items: center; padding-bottom: 0.75rem; margin-bottom: 1rem; border-bottom: 1px solid #eee;} .form-modal-title {font-size: 1.25rem; font-weight: 600;} .form-modal-body .form-group { margin-bottom: 1rem; } .form-modal-body .form-group label { display: block; margin-bottom: 0.3rem; font-size: 0.875rem; font-weight:500; } .form-modal-body .form-group input, .form-modal-body .form-group select, .form-modal-body .form-group textarea { width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 0.25rem; font-size: 0.9rem;} .form-modal-footer {padding-top: 1rem; margin-top: 1rem; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 0.75rem;} input, select {box-sizing: border-box;} `}</style>
    );

    return (
        <>
            <GlobalStyles />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <script src="https://cdn.tailwindcss.com"></script> 
            
            <MessageModal isOpen={isMessageModalOpen} title={messageModalContent.title} message={messageModalContent.text} onClose={() => setIsMessageModalOpen(false)} />
            <RegisterModal isOpen={isRegisterModalOpen} onClose={handleCloseRegisterModal} onSubmit={handleRegisterSubmit} />

            {currentPage === 'login' && <LoginPage onLogin={handleLogin} onShowRegister={handleShowRegisterModal} />}
            {currentPage === 'dashboard' && currentUser && (<DashboardPage user={currentUser} onLogout={handleLogout} onNavigateToApp={handleNavigateToApp} selectedPark={selectedPark} setSelectedPark={setSelectedPark} />)}
            
            {currentPage.startsWith('app/') && (
                (() => {
                    const appId = currentPage.split('/')[1];
                    // Routing para as sub-aplicações
                    if (appId === 'reservas') return <ReservasSubAppPage appName={currentAppName} onNavigateToDashboard={handleNavigateToDashboard} />;
                    if (appId === 'recolhas') return <RecolhasSubAppPage appName={currentAppName} onNavigateToDashboard={handleNavigateToDashboard} />;
                    if (appId === 'entregas') return <EntregasSubAppPage appName={currentAppName} onNavigateToDashboard={handleNavigateToDashboard} />;
                    if (appId === 'cancelamentos') return <CancelamentosSubAppPage appName={currentAppName} onNavigateToDashboard={handleNavigateToDashboard} />;
                    if (appId === 'caixa_multipark') return <CaixaMultiparkSubAppPage appName={currentAppName} onNavigateToDashboard={handleNavigateToDashboard} />;
                    if (appId === 'confirmacao_caixa') return <ConfirmacaoCaixaSubAppPage appName={currentAppName} onNavigateToDashboard={handleNavigateToDashboard} />;
                    if (appId === 'despesas') return <DespesasSubAppPage appName={currentAppName} onNavigateToDashboard={handleNavigateToDashboard} />;
                    if (appId === 'projetos') return <ProjetosSubAppPage appName={currentAppName} onNavigateToDashboard={handleNavigateToDashboard} />;
                    if (appId === 'tarefas') return <TarefasSubAppPage appName={currentAppName} onNavigateToDashboard={handleNavigateToDashboard} />;
                    if (appId === 'recursos_humanos') return <RecursosHumanosSubAppPage appName={currentAppName} onNavigateToDashboard={handleNavigateToDashboard} />;
                    if (appId === 'comportamentos') return <ComportamentosSubAppPage appName={currentAppName} onNavigateToDashboard={handleNavigateToDashboard} />;
                    if (appId === 'mapa_ocupacao') return <MapaOcupacaoSubAppPage appName={currentAppName} onNavigateToDashboard={handleNavigateToDashboard} />;
                    if (appId === 'produtividade_condutores') return <ProdutividadeCondutoresSubAppPage appName={currentAppName} onNavigateToDashboard={handleNavigateToDashboard} />;
                    if (appId === 'relatorios') return <RelatoriosSubAppPage appName={currentAppName} onNavigateToDashboard={handleNavigateToDashboard} />;
                    if (appId === 'marketing') return <MarketingSubAppPage appName={currentAppName} onNavigateToDashboard={handleNavigateToDashboard} />;
                    
                    // Novas páginas de Administração e Suporte
                    if (appId === 'acessos_alteracoes') return <AcessosAlteracoesSubAppPage appName={currentAppName} onNavigateToDashboard={handleNavigateToDashboard} />;
                    if (appId === 'auditorias_internas') return <AuditoriasInternasSubAppPage appName={currentAppName} onNavigateToDashboard={handleNavigateToDashboard} />;
                    if (appId === 'comentarios_reclamacoes') return <ComentariosReclamacoesSubAppPage appName={currentAppName} onNavigateToDashboard={handleNavigateToDashboard} />;
                    if (appId === 'formacao_apoio') return <FormacaoApoioSubAppPage appName={currentAppName} onNavigateToDashboard={handleNavigateToDashboard} />;
                    if (appId === 'perdidos_achados') return <PerdidosAchadosSubAppPage appName={currentAppName} onNavigateToDashboard={handleNavigateToDashboard} />;

                    return <GenericSubAppPage appName={currentAppName} onNavigateToDashboard={handleNavigateToDashboard} />;
                })()
            )}
        </>
    );
}
