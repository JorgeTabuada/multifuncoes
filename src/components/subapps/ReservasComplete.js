import React, { useState } from 'react';
import { useReservasWithStats } from '../../hooks/useFirebaseData';
import { RESERVAS_FIELDS } from '../../config/firebaseMapping';
import AdvancedFilters from '../filters/AdvancedFilters';
import DataTable from '../tables/DataTable';
import { CalendarDays, Users, DollarSign, Filter } from '../../assets/icons';

// Componente completo de Reservas com todos os recursos
const ReservasCompleteSubAppPage = ({ appName, onNavigateToDashboard }) => {
  const [filters, setFilters] = useState({});
  
  // Hook personalizado com estatísticas
  const { 
    reservas, 
    stats, 
    loading, 
    error, 
    applyFilters, 
    clearFilters, 
    refetch,
    lastFetch 
  } = useReservasWithStats(filters);

  // Configuração das colunas da tabela
  const tableColumns = [
    { field: RESERVAS_FIELDS.id, label: 'ID', type: 'text' },
    { field: 'customer', label: 'Cliente', type: 'customer', sortable: false },
    { field: RESERVAS_FIELDS.licensePlate, label: 'Matrícula', type: 'license' },
    { field: RESERVAS_FIELDS.veiculo, label: 'Veículo', type: 'vehicle' },
    { 
      field: RESERVAS_FIELDS.park, 
      label: 'Parque', 
      type: 'text',
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          {row[RESERVAS_FIELDS.parkBrand] && (
            <div className="text-xs text-gray-500">{row[RESERVAS_FIELDS.parkBrand]}</div>
          )}
          {row[RESERVAS_FIELDS.city] && (
            <div className="text-xs text-gray-500">{row[RESERVAS_FIELDS.city]}</div>
          )}
        </div>
      )
    },
    { field: RESERVAS_FIELDS.stats, label: 'Estado', type: 'status' },
    { field: RESERVAS_FIELDS.action, label: 'Ação', type: 'text' },
    { field: RESERVAS_FIELDS.bookingPrice, label: 'Preço', type: 'price' },
    { field: RESERVAS_FIELDS.checkIn, label: 'Check-in', type: 'datetime' },
    { field: RESERVAS_FIELDS.checkOut, label: 'Check-out', type: 'datetime' },
    { field: RESERVAS_FIELDS.delivery, label: 'Entrega', type: 'text' }
  ];

  // Função para exportar dados
  const handleExport = (data) => {
    const csvContent = [
      // Cabeçalho
      tableColumns.map(col => col.label).join(','),
      // Dados
      ...data.map(row => 
        tableColumns.map(col => {
          const value = row[col.field] || '';
          return `"${value.toString().replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reservas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Função para ver detalhes de uma reserva
  const handleRowClick = (reserva) => {
    console.log('Ver detalhes da reserva:', reserva);
    // Aqui pode abrir um modal ou navegar para página de detalhes
  };

  return (
    <div className="subapp-page w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Cabeçalho */}
      <div className="subapp-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="subapp-title">{appName}</h1>
            <p className="text-gray-600 mt-1">Gestão completa de reservas com dados em tempo real</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={refetch}
              disabled={loading}
              className="action-button secondary flex items-center gap-2"
            >
              <CalendarDays className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
            <button onClick={onNavigateToDashboard} className="action-button secondary">
              Voltar
            </button>
          </div>
        </div>
        
        {lastFetch && (
          <div className="text-sm text-gray-500 mt-2">
            Última atualização: {lastFetch.toLocaleString('pt-PT')}
          </div>
        )}
      </div>

      {/* Estatísticas */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <CalendarDays className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Entregues</p>
              <p className="text-2xl font-bold">{stats.entregues}</p>
            </div>
            <Users className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Recolhidos</p>
              <p className="text-2xl font-bold">{stats.recolhidos}</p>
            </div>
            <Users className="h-8 w-8 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Cancelados</p>
              <p className="text-2xl font-bold">{stats.cancelados}</p>
            </div>
            <Filter className="h-8 w-8 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Pendentes</p>
              <p className="text-2xl font-bold">{stats.pendentes}</p>
            </div>
            <CalendarDays className="h-8 w-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Valor Total</p>
              <p className="text-2xl font-bold">€{stats.valorTotal.toFixed(0)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-indigo-200" />
          </div>
        </div>
      </section>

      {/* Estatísticas por Parque */}
      {Object.keys(stats.porParque).length > 0 && (
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Distribuição por Parque
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.porParque).map(([parque, count]) => (
              <div key={parque} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600">{parque}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Filtros Avançados */}
      <AdvancedFilters
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        initialFilters={filters}
        showFilters={['park', 'parkBrand', 'city', 'stats', 'action', 'dates', 'search']}
      />

      {/* Tabela de Dados */}
      <DataTable
        data={reservas}
        columns={tableColumns}
        loading={loading}
        error={error}
        onRowClick={handleRowClick}
        onExport={handleExport}
        showActions={true}
        pageSize={25}
      />

      {/* Informações adicionais */}
      {!loading && !error && reservas.length > 0 && (
        <section className="bg-gray-50 p-4 rounded-lg">
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <strong>Filtros ativos:</strong> {Object.keys(filters).length || 'Nenhum'}
            </div>
            <div>
              <strong>Registos mostrados:</strong> {reservas.length} de {stats.total}
            </div>
            <div>
              <strong>Taxa de entrega:</strong> {stats.total > 0 ? ((stats.entregues / stats.total) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ReservasCompleteSubAppPage;
