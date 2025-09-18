import React, { useState } from 'react';
import { useFirebaseData } from '../../hooks/useFirebaseData';
import { RESERVAS_FIELDS } from '../../config/firebaseMapping';
import AdvancedFilters from '../filters/AdvancedFilters';
import DataTable from '../tables/DataTable';
import { CalendarDays, Users, DollarSign, Filter } from '../../assets/icons';

// Componente completo de Recolhas
const RecolhasCompleteSubAppPage = ({ appName, onNavigateToDashboard }) => {
  const [filters, setFilters] = useState({});
  
  // Hook para buscar recolhas
  const { 
    data: recolhas, 
    loading, 
    error, 
    applyFilters, 
    clearFilters, 
    refetch,
    lastFetch 
  } = useFirebaseData('recolhas', filters);

  // Calcular estatísticas das recolhas
  const stats = {
    total: recolhas.length,
    concluidas: recolhas.filter(r => r[RESERVAS_FIELDS.stats] === 'recolhido').length,
    pendentes: recolhas.filter(r => r[RESERVAS_FIELDS.stats] !== 'recolhido').length,
    
    // Por condutor (baseado no campo 'user')
    porCondutor: recolhas.reduce((acc, r) => {
      const condutor = r[RESERVAS_FIELDS.user] || 'Sem condutor';
      acc[condutor] = (acc[condutor] || 0) + 1;
      return acc;
    }, {}),
    
    // Por parque
    porParque: recolhas.reduce((acc, r) => {
      const parque = r[RESERVAS_FIELDS.park] || 'Sem parque';
      acc[parque] = (acc[parque] || 0) + 1;
      return acc;
    }, {}),
    
    // Recolhas de hoje
    hoje: recolhas.filter(r => {
      const dataRecolha = new Date(r[RESERVAS_FIELDS.checkinDate] || r[RESERVAS_FIELDS.historyDate]);
      const hoje = new Date();
      return dataRecolha.toDateString() === hoje.toDateString();
    }).length
  };

  // Configuração das colunas da tabela
  const tableColumns = [
    { field: RESERVAS_FIELDS.id, label: 'ID', type: 'text' },
    { 
      field: 'customer', 
      label: 'Cliente', 
      type: 'customer', 
      sortable: false,
      render: (value, row) => (
        <div>
          <div className="font-medium">{row[RESERVAS_FIELDS.name]} {row[RESERVAS_FIELDS.lastName]}</div>
          <div className="text-xs text-gray-500">{row[RESERVAS_FIELDS.phoneNumber]}</div>
        </div>
      )
    },
    { field: RESERVAS_FIELDS.licensePlate, label: 'Matrícula', type: 'license' },
    { field: RESERVAS_FIELDS.veiculo, label: 'Veículo', type: 'vehicle' },
    { 
      field: RESERVAS_FIELDS.park, 
      label: 'Localização', 
      type: 'text',
      render: (value, row) => (
        <div>
          <div className="font-medium flex items-center gap-1">
            <CalendarDays className="h-4 w-4 text-gray-400" />
            {value}
          </div>
          {row[RESERVAS_FIELDS.alocation] && (
            <div className="text-xs text-gray-500">Alocação: {row[RESERVAS_FIELDS.alocation]}</div>
          )}
          {row[RESERVAS_FIELDS.row] && row[RESERVAS_FIELDS.spot] && (
            <div className="text-xs text-gray-500">Fila {row[RESERVAS_FIELDS.row]}, Lugar {row[RESERVAS_FIELDS.spot]}</div>
          )}
        </div>
      )
    },
    { 
      field: RESERVAS_FIELDS.user, 
      label: 'Condutor', 
      type: 'text',
      render: (value) => (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{value?.split('@')[0] || 'N/A'}</span>
        </div>
      )
    },
    { field: RESERVAS_FIELDS.stats, label: 'Estado', type: 'status' },
    { 
      field: RESERVAS_FIELDS.checkinDate, 
      label: 'Data Recolha', 
      type: 'date',
      render: (value, row) => (
        <div>
          <div className="text-sm">{row[RESERVAS_FIELDS.checkIn]}</div>
          <div className="text-xs text-gray-500">{value}</div>
        </div>
      )
    },
    { field: RESERVAS_FIELDS.remarks, label: 'Observações', type: 'text' }
  ];

  // Função para exportar dados
  const handleExport = (data) => {
    const csvContent = [
      // Cabeçalho
      ['ID', 'Cliente', 'Matrícula', 'Veículo', 'Parque', 'Condutor', 'Estado', 'Data', 'Observações'].join(','),
      // Dados
      ...data.map(row => [
        row[RESERVAS_FIELDS.id],
        `"${row[RESERVAS_FIELDS.name]} ${row[RESERVAS_FIELDS.lastName]}"`,
        row[RESERVAS_FIELDS.licensePlate],
        `"${row[RESERVAS_FIELDS.veiculo]}"`,
        row[RESERVAS_FIELDS.park],
        `"${row[RESERVAS_FIELDS.user]}"`,
        row[RESERVAS_FIELDS.stats],
        row[RESERVAS_FIELDS.checkinDate],
        `"${row[RESERVAS_FIELDS.remarks] || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `recolhas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Função para ver detalhes de uma recolha
  const handleRowClick = (recolha) => {
    console.log('Ver detalhes da recolha:', recolha);
    // Aqui pode abrir um modal ou navegar para página de detalhes
  };

  return (
    <div className="subapp-page w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Cabeçalho */}
      <div className="subapp-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="subapp-title flex items-center gap-2">
              <CalendarDays className="h-6 w-6" />
              {appName}
            </h1>
            <p className="text-gray-600 mt-1">Gestão de recolhas e movimentações de veículos</p>
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
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Recolhas</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <CalendarDays className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Concluídas</p>
              <p className="text-2xl font-bold">{stats.concluidas}</p>
            </div>
            <Users className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pendentes</p>
              <p className="text-2xl font-bold">{stats.pendentes}</p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Hoje</p>
              <p className="text-2xl font-bold">{stats.hoje}</p>
            </div>
            <Filter className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </section>

      {/* Estatísticas por Condutor */}
      {Object.keys(stats.porCondutor).length > 0 && (
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Produtividade por Condutor
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.porCondutor)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 6)
              .map(([condutor, count]) => (
                <div key={condutor} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{condutor.split('@')[0]}</div>
                    <div className="text-sm text-gray-600">{count} recolhas</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{count}</div>
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
        showFilters={['park', 'parkBrand', 'city', 'stats', 'dates', 'search']}
      />

      {/* Tabela de Dados */}
      <DataTable
        data={recolhas}
        columns={tableColumns}
        loading={loading}
        error={error}
        onRowClick={handleRowClick}
        onExport={handleExport}
        showActions={true}
        pageSize={25}
      />

      {/* Informações adicionais */}
      {!loading && !error && recolhas.length > 0 && (
        <section className="bg-gray-50 p-4 rounded-lg">
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <strong>Filtros ativos:</strong> {Object.keys(filters).length || 'Nenhum'}
            </div>
            <div>
              <strong>Taxa de conclusão:</strong> {stats.total > 0 ? ((stats.concluidas / stats.total) * 100).toFixed(1) : 0}%
            </div>
            <div>
              <strong>Condutores ativos:</strong> {Object.keys(stats.porCondutor).length}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default RecolhasCompleteSubAppPage;
