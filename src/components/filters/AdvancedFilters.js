import React, { useState, useEffect } from 'react';
import { FILTER_OPTIONS } from '../../config/firebaseMapping';
import { Filter, Search, Calendar, X } from '../../assets/icons';

// Componente de filtros avançados reutilizável
const AdvancedFilters = ({ 
  onApplyFilters, 
  onClearFilters, 
  initialFilters = {},
  showFilters = ['park', 'parkBrand', 'city', 'stats', 'action', 'dates', 'search'],
  className = ''
}) => {
  // Estados dos filtros
  const [filters, setFilters] = useState({
    park: '',
    parkBrand: '',
    city: '',
    stats: '',
    action: '',
    paymentMethod: '',
    deliveryType: '',
    startDate: '',
    endDate: '',
    cliente: '',
    matricula: '',
    email: '',
    telefone: '',
    ...initialFilters
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  // Verificar se há filtros ativos
  useEffect(() => {
    const activeFilters = Object.values(filters).some(value => value !== '');
    setHasActiveFilters(activeFilters);
  }, [filters]);

  // Atualizar filtro individual
  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Aplicar filtros
  const handleApplyFilters = () => {
    // Remover filtros vazios
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== '') {
        // Converter datas para objetos Date
        if (key === 'startDate' || key === 'endDate') {
          acc[key === 'startDate' ? 'dataInicio' : 'dataFim'] = new Date(value);
        } else {
          acc[key] = value;
        }
      }
      return acc;
    }, {});

    console.log('🔍 Aplicando filtros:', cleanFilters);
    onApplyFilters(cleanFilters);
  };

  // Limpar filtros
  const handleClearFilters = () => {
    const emptyFilters = Object.keys(filters).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {});
    
    setFilters(emptyFilters);
    onClearFilters();
  };

  // Filtros rápidos predefinidos
  const quickFilters = [
    { label: 'Entregues Hoje', filters: { stats: 'Entregue', startDate: new Date().toISOString().split('T')[0] } },
    { label: 'Recolhidos', filters: { stats: 'recolhido' } },
    { label: 'Cancelados', filters: { stats: 'cancelado' } },
    { label: 'Lisboa', filters: { city: 'lisbon' } },
    { label: 'Porto', filters: { city: 'porto' } },
    { label: 'SkyPark', filters: { parkBrand: 'skypark' } }
  ];

  const applyQuickFilter = (quickFilter) => {
    const newFilters = { ...filters };
    Object.entries(quickFilter.filters).forEach(([key, value]) => {
      if (key === 'startDate') {
        newFilters.startDate = value;
      } else {
        newFilters[key] = value;
      }
    });
    setFilters(newFilters);
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Cabeçalho dos filtros */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-gray-900">Filtros Avançados</h3>
            {hasActiveFilters && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Ativos
              </span>
            )}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? 'Recolher' : 'Expandir'}
          </button>
        </div>

        {/* Filtros rápidos */}
        <div className="mt-3 flex flex-wrap gap-2">
          {quickFilters.map((quickFilter, index) => (
            <button
              key={index}
              onClick={() => applyQuickFilter(quickFilter)}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
            >
              {quickFilter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filtros expandidos */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Filtros de localização */}
          {(showFilters.includes('park') || showFilters.includes('parkBrand') || showFilters.includes('city')) && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">📍 Localização</h4>
              <div className="grid md:grid-cols-3 gap-3">
                {showFilters.includes('park') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parque:</label>
                    <select 
                      value={filters.park} 
                      onChange={e => updateFilter('park', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Todos os Parques</option>
                      {FILTER_OPTIONS.PARKS.map(park => (
                        <option key={park.value} value={park.value}>{park.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {showFilters.includes('parkBrand') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marca:</label>
                    <select 
                      value={filters.parkBrand} 
                      onChange={e => updateFilter('parkBrand', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Todas as Marcas</option>
                      {FILTER_OPTIONS.PARK_BRANDS.map(brand => (
                        <option key={brand.value} value={brand.value}>{brand.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {showFilters.includes('city') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cidade:</label>
                    <select 
                      value={filters.city} 
                      onChange={e => updateFilter('city', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Todas as Cidades</option>
                      {FILTER_OPTIONS.CITIES.map(city => (
                        <option key={city.value} value={city.value}>{city.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Filtros de estado e ação */}
          {(showFilters.includes('stats') || showFilters.includes('action')) && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">📊 Estado e Ação</h4>
              <div className="grid md:grid-cols-2 gap-3">
                {showFilters.includes('stats') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado:</label>
                    <select 
                      value={filters.stats} 
                      onChange={e => updateFilter('stats', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Todos os Estados</option>
                      {FILTER_OPTIONS.STATS.map(stat => (
                        <option key={stat.value} value={stat.value}>{stat.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {showFilters.includes('action') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ação:</label>
                    <select 
                      value={filters.action} 
                      onChange={e => updateFilter('action', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Todas as Ações</option>
                      {FILTER_OPTIONS.ACTIONS.map(action => (
                        <option key={action.value} value={action.value}>{action.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Filtros de data */}
          {showFilters.includes('dates') && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">📅 Período</h4>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Início:</label>
                  <input 
                    type="date" 
                    value={filters.startDate} 
                    onChange={e => updateFilter('startDate', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim:</label>
                  <input 
                    type="date" 
                    value={filters.endDate} 
                    onChange={e => updateFilter('endDate', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Filtros de pesquisa */}
          {showFilters.includes('search') && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🔍 Pesquisa</h4>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cliente:</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Nome ou email do cliente" 
                      value={filters.cliente} 
                      onChange={e => updateFilter('cliente', e.target.value)}
                      className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula:</label>
                  <input 
                    type="text" 
                    placeholder="XX-XX-XX" 
                    value={filters.matricula} 
                    onChange={e => updateFilter('matricula', e.target.value.toUpperCase())}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button 
              onClick={handleApplyFilters}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Aplicar Filtros
            </button>
            <button 
              onClick={handleClearFilters}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Limpar
            </button>
          </div>
        </div>
      )}

      {/* Resumo dos filtros ativos (quando recolhido) */}
      {!isExpanded && hasActiveFilters && (
        <div className="p-3 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (value === '') return null;
              
              return (
                <span key={key} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {key}: {value}
                  <button
                    onClick={() => updateFilter(key, '')}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
