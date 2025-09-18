import React, { useState } from 'react';
import { useReservas, useFirebaseCRUD } from '../../hooks/useFirebase';
import { FILTER_OPTIONS, RESERVAS_FIELDS, FirebaseUtils } from '../../config/firebaseMapping';
import { Filter, CalendarDays, Users, DollarSign, Search } from '../../assets/icons';

const ReservasFirebaseRealSubAppPage = ({ appName, onNavigateToDashboard }) => {
  // Estados para filtros (usando nomes reais dos campos)
  const [selectedPark, setSelectedPark] = useState('');
  const [selectedParkBrand, setSelectedParkBrand] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStats, setSelectedStats] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [cliente, setCliente] = useState('');
  const [matricula, setMatricula] = useState('');

  // Construir filtros para o Firebase
  const [filters, setFilters] = useState({});

  // Hooks Firebase
  const { data: reservas, loading, error, refetch } = useReservas(filters);
  const { addDocument, loading: addLoading } = useFirebaseCRUD('reservas');

  // Aplicar filtros
  const handleApplyFilters = () => {
    const newFilters = {};
    
    if (selectedPark) newFilters.park = selectedPark;
    if (selectedParkBrand) newFilters.parkBrand = selectedParkBrand;
    if (selectedCity) newFilters.city = selectedCity;
    if (selectedStats) newFilters.stats = selectedStats;
    if (selectedAction) newFilters.action = selectedAction;
    if (startDate) newFilters.dataInicio = new Date(startDate);
    if (endDate) newFilters.dataFim = new Date(endDate);
    if (cliente) newFilters.cliente = cliente;
    if (matricula) newFilters.matricula = matricula;
    
    console.log('🔍 Aplicando filtros:', newFilters);
    setFilters(newFilters);
  };

  // Limpar filtros
  const handleClearFilters = () => {
    setSelectedPark('');
    setSelectedParkBrand('');
    setSelectedCity('');
    setSelectedStats('');
    setSelectedAction('');
    setStartDate('');
    setEndDate('');
    setCliente('');
    setMatricula('');
    setFilters({});
  };

  // Estatísticas das reservas
  const stats = {
    total: reservas.length,
    entregues: reservas.filter(r => r[RESERVAS_FIELDS.stats] === 'Entregue').length,
    recolhidos: reservas.filter(r => r[RESERVAS_FIELDS.stats] === 'recolhido').length,
    cancelados: reservas.filter(r => r[RESERVAS_FIELDS.stats] === 'cancelado').length,
    valorTotal: reservas.reduce((sum, r) => {
      const preco = parseFloat((r[RESERVAS_FIELDS.bookingPrice] || '0').replace(',', '.'));
      return sum + (isNaN(preco) ? 0 : preco);
    }, 0)
  };

  return (
    <div className="subapp-page w-full max-w-6xl mx-auto p-4">
      <div className="subapp-header">
        <h1 className="subapp-title">{appName} - Dados Reais Firebase</h1>
        <div className="flex gap-2">
          <button onClick={onNavigateToDashboard} className="action-button secondary">
            Voltar
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <section className="subapp-section">
        <h2 className="subapp-section-title">📊 Resumo das Reservas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <CalendarDays className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{stats.entregues}</div>
            <div className="text-sm text-gray-600">Entregues</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <CalendarDays className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{stats.recolhidos}</div>
            <div className="text-sm text-gray-600">Recolhidos</div>
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
        <h2 className="subapp-section-title">🔍 Filtros de Pesquisa</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parque:</label>
            <select 
              value={selectedPark} 
              onChange={e => setSelectedPark(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Todos os Parques</option>
              {FILTER_OPTIONS.PARKS.map(park => (
                <option key={park.value} value={park.value}>{park.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marca do Parque:</label>
            <select 
              value={selectedParkBrand} 
              onChange={e => setSelectedParkBrand(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Todas as Marcas</option>
              {FILTER_OPTIONS.PARK_BRANDS.map(brand => (
                <option key={brand.value} value={brand.value}>{brand.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cidade:</label>
            <select 
              value={selectedCity} 
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Todas as Cidades</option>
              {FILTER_OPTIONS.CITIES.map(city => (
                <option key={city.value} value={city.value}>{city.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado:</label>
            <select 
              value={selectedStats} 
              onChange={e => setSelectedStats(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Todos os Estados</option>
              {FILTER_OPTIONS.STATS.map(stat => (
                <option key={stat.value} value={stat.value}>{stat.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ação:</label>
            <select 
              value={selectedAction} 
              onChange={e => setSelectedAction(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Todas as Ações</option>
              {FILTER_OPTIONS.ACTIONS.map(action => (
                <option key={action.value} value={action.value}>{action.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Início:</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim:</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente:</label>
            <input 
              type="text" 
              placeholder="Nome ou email" 
              value={cliente} 
              onChange={e => setCliente(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula:</label>
            <input 
              type="text" 
              placeholder="XX-XX-XX" 
              value={matricula} 
              onChange={e => setMatricula(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            className="action-button" 
            onClick={handleApplyFilters}
          >
            <Filter className="h-4 w-4 inline mr-1"/> Aplicar Filtros
          </button>
          <button 
            className="action-button secondary" 
            onClick={handleClearFilters}
          >
            Limpar Filtros
          </button>
        </div>
      </section>

      {/* Resultados das Reservas */}
      <section className="subapp-section">
        <h2 className="subapp-section-title">
          📋 Resultados das Reservas 
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
              
              <div className="flex gap-2 justify-center">
                <button onClick={handleClearFilters} className="action-button">
                  Limpar Filtros
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
                  <th>Matrícula</th>
                  <th>Veículo</th>
                  <th>Parque</th>
                  <th>Estado</th>
                  <th>Ação</th>
                  <th>Preço</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Entrega</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map(reserva => (
                  <tr key={reserva.id}>
                    <td>{reserva[RESERVAS_FIELDS.id]}</td>
                    <td>
                      <div>
                        <div className="font-medium">
                          {reserva[RESERVAS_FIELDS.name]} {reserva[RESERVAS_FIELDS.lastName]}
                        </div>
                        <div className="text-xs text-gray-500">
                          {reserva[RESERVAS_FIELDS.email]}
                        </div>
                      </div>
                    </td>
                    <td className="font-mono">{reserva[RESERVAS_FIELDS.licensePlate]}</td>
                    <td>
                      <div className="text-sm">
                        <div>{reserva[RESERVAS_FIELDS.brand]} {reserva[RESERVAS_FIELDS.model]}</div>
                        <div className="text-gray-500">{reserva[RESERVAS_FIELDS.color]}</div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="font-medium">{reserva[RESERVAS_FIELDS.park]}</div>
                        {reserva[RESERVAS_FIELDS.parkBrand] && (
                          <div className="text-xs text-gray-500">{reserva[RESERVAS_FIELDS.parkBrand]}</div>
                        )}
                        {reserva[RESERVAS_FIELDS.city] && (
                          <div className="text-xs text-gray-500">{reserva[RESERVAS_FIELDS.city]}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded text-xs ${
                        reserva[RESERVAS_FIELDS.stats] === 'Entregue' ? 'bg-green-100 text-green-800' :
                        reserva[RESERVAS_FIELDS.stats] === 'recolhido' ? 'bg-blue-100 text-blue-800' :
                        reserva[RESERVAS_FIELDS.stats] === 'cancelado' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {reserva[RESERVAS_FIELDS.stats]}
                      </span>
                    </td>
                    <td>{reserva[RESERVAS_FIELDS.action]}</td>
                    <td className="font-medium">€{reserva[RESERVAS_FIELDS.bookingPrice]}</td>
                    <td className="text-sm">{reserva[RESERVAS_FIELDS.checkIn]}</td>
                    <td className="text-sm">{reserva[RESERVAS_FIELDS.checkOut]}</td>
                    <td className="text-sm">{reserva[RESERVAS_FIELDS.delivery]}</td>
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

export default ReservasFirebaseRealSubAppPage;
