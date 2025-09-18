import React, { useState, useEffect } from 'react';
import { useReservas } from '../../hooks/useFirebase';
import { Filter, CalendarDays, Users, DollarSign } from '../../assets/icons';

const ReservasFirebaseSubAppPage = ({ appName, onNavigateToDashboard }) => {
  // Estados para filtros
  const [selectedProject, setSelectedProject] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [clientName, setClientName] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [selectedPark, setSelectedPark] = useState('');

  // Construir filtros para o Firebase
  const [filters, setFilters] = useState({});

  // Hook para obter reservas do Firebase
  const { data: reservas, loading, error, refetch } = useReservas(filters);

  // Aplicar filtros
  const handleApplyFilters = () => {
    const newFilters = {};
    
    if (selectedProject) newFilters.projeto = selectedProject;
    if (startDate) newFilters.dataInicio = new Date(startDate);
    if (endDate) newFilters.dataFim = new Date(endDate);
    if (clientName) newFilters.cliente = clientName;
    if (vehiclePlate) newFilters.matricula = vehiclePlate;
    if (selectedPark) newFilters.parque = selectedPark;
    
    setFilters(newFilters);
  };

  // Limpar filtros
  const handleClearFilters = () => {
    setSelectedProject('');
    setStartDate('');
    setEndDate('');
    setClientName('');
    setVehiclePlate('');
    setSelectedPark('');
    setFilters({});
  };

  // Estatísticas das reservas
  const stats = {
    total: reservas.length,
    pendentes: reservas.filter(r => r.estado === 'Pendente').length,
    confirmadas: reservas.filter(r => r.estado === 'Confirmada').length,
    canceladas: reservas.filter(r => r.estado === 'Cancelada').length,
    valorTotal: reservas.reduce((sum, r) => sum + (r.valor || 0), 0)
  };

  return (
    <div className="subapp-page w-full max-w-6xl mx-auto p-4">
      <div className="subapp-header">
        <h1 className="subapp-title">{appName}</h1>
        <button onClick={onNavigateToDashboard} className="action-button secondary">
          Voltar
        </button>
      </div>

      {/* Estatísticas */}
      <section className="subapp-section">
        <h2 className="subapp-section-title">Resumo das Reservas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <CalendarDays className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <Users className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{stats.pendentes}</div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <CalendarDays className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{stats.confirmadas}</div>
            <div className="text-sm text-gray-600">Confirmadas</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <DollarSign className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">€{stats.valorTotal.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Valor Total</div>
          </div>
        </div>
      </section>

      {/* Filtros de Pesquisa */}
      <section className="subapp-section">
        <h2 className="subapp-section-title">Filtros de Pesquisa</h2>
        <div className="filters-grid mb-6">
          <div>
            <label>Projeto:</label>
            <select 
              value={selectedProject} 
              onChange={e => setSelectedProject(e.target.value)}
            >
              <option value="">Todos os Projetos</option>
              <option value="proj1">Projeto Alpha</option>
              <option value="proj2">Projeto Beta</option>
              <option value="proj3">Manutenção Geral</option>
            </select>
          </div>
          <div>
            <label>Parque:</label>
            <select 
              value={selectedPark} 
              onChange={e => setSelectedPark(e.target.value)}
            >
              <option value="">Todos os Parques</option>
              <option value="lisboa">Lisboa</option>
              <option value="porto">Porto</option>
              <option value="faro">Faro</option>
            </select>
          </div>
          <div>
            <label>Data Início:</label>
            <input 
              type="datetime-local" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)} 
            />
          </div>
          <div>
            <label>Data Fim:</label>
            <input 
              type="datetime-local" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)} 
            />
          </div>
          <div>
            <label>Nome do Cliente:</label>
            <input 
              type="text" 
              placeholder="Nome do cliente" 
              value={clientName} 
              onChange={e => setClientName(e.target.value)} 
            />
          </div>
          <div>
            <label>Matrícula do Veículo:</label>
            <input 
              type="text" 
              placeholder="XX-XX-XX" 
              value={vehiclePlate} 
              onChange={e => setVehiclePlate(e.target.value)} 
            />
          </div>
          <button 
            className="action-button self-end" 
            onClick={handleApplyFilters}
          >
            <Filter className="h-4 w-4 inline mr-1"/> Aplicar Filtros
          </button>
          <button 
            className="action-button secondary self-end" 
            onClick={handleClearFilters}
          >
            Limpar
          </button>
        </div>
      </section>

      {/* Resultados das Reservas */}
      <section className="subapp-section">
        <h2 className="subapp-section-title">
          Resultados das Reservas 
          {loading && <span className="text-sm text-gray-500 ml-2">(Carregando...)</span>}
          {error && <span className="text-sm text-red-500 ml-2">(Erro: {error})</span>}
        </h2>
        
        {loading ? (
          <div className="content-placeholder">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4">Carregando reservas do Firebase...</p>
          </div>
        ) : error ? (
          <div className="content-placeholder">
            <div className="text-red-500 mb-4">
              <p className="font-semibold">Erro ao carregar dados:</p>
              <p className="text-sm">{error}</p>
            </div>
            
            {error.includes('index') && (
              <div className="bg-yellow-50 p-4 rounded-lg text-left mb-4">
                <h4 className="font-semibold mb-2">🔧 Solução para Índices:</h4>
                <p className="text-sm mb-2">
                  O Firebase precisa de índices para consultas complexas. 
                  Isto é normal e pode ser resolvido:
                </p>
                <ol className="list-decimal list-inside text-sm space-y-1">
                  <li>Usar filtros mais simples (um de cada vez)</li>
                  <li>Criar índices no Firebase Console (link no erro)</li>
                  <li>Aguardar alguns minutos após criar os índices</li>
                </ol>
              </div>
            )}
            
            <div className="flex gap-2">
              <button onClick={refetch} className="action-button">
                Tentar Novamente
              </button>
              <button onClick={handleClearFilters} className="action-button secondary">
                Limpar Filtros
              </button>
            </div>
          </div>
        ) : reservas.length === 0 ? (
          <div className="content-placeholder">
            <div className="text-center">
              <p className="mb-4">Nenhuma reserva encontrada com os filtros aplicados.</p>
              
              <div className="bg-blue-50 p-4 rounded-lg text-left mb-4">
                <h4 className="font-semibold mb-2">💡 Sugestões:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Verificar se existem dados na coleção 'reservas'</li>
                  <li>Tentar com filtros diferentes ou mais amplos</li>
                  <li>Limpar todos os filtros para ver todos os dados</li>
                </ul>
              </div>
              
              <div className="flex gap-2 justify-center">
                <button onClick={handleClearFilters} className="action-button">
                  Limpar Filtros
                </button>
                <button onClick={() => window.location.reload()} className="action-button secondary">
                  Recarregar Página
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Veículo</th>
                  <th>Data/Hora</th>
                  <th>Parque</th>
                  <th>Projeto</th>
                  <th>Estado</th>
                  <th>Valor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map(reserva => (
                  <tr key={reserva.id}>
                    <td>{reserva.id}</td>
                    <td>{reserva.cliente || 'N/A'}</td>
                    <td>{reserva.matricula || 'N/A'}</td>
                    <td>
                      {reserva.data ? 
                        new Date(reserva.data.seconds * 1000).toLocaleString('pt-PT') : 
                        'N/A'
                      }
                    </td>
                    <td>{reserva.parque || 'N/A'}</td>
                    <td>{reserva.projeto || 'N/A'}</td>
                    <td>
                      <span className={`px-2 py-1 rounded text-xs ${
                        reserva.estado === 'Confirmada' ? 'bg-green-100 text-green-800' :
                        reserva.estado === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                        reserva.estado === 'Cancelada' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {reserva.estado || 'N/A'}
                      </span>
                    </td>
                    <td>€{(reserva.valor || 0).toFixed(2)}</td>
                    <td>
                      <button className="action-button mr-2 text-xs px-2 py-1">
                        Ver
                      </button>
                      <button className="action-button secondary text-xs px-2 py-1">
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default ReservasFirebaseSubAppPage;
