import React, { useState, useMemo } from 'react';
import { RESERVAS_FIELDS, FirebaseUtils } from '../../config/firebaseMapping';
import { CalendarDays, Users, DollarSign, Filter, Search, X } from '../../assets/icons';

// Componente de tabela de dados avançada
const DataTable = ({ 
  data = [], 
  columns = [], 
  loading = false,
  error = null,
  onRowClick = null,
  onEdit = null,
  onDelete = null,
  onExport = null,
  showActions = true,
  pageSize = 20,
  className = ''
}) => {
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Ordenação dos dados
  const sortedData = useMemo(() => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Tratamento especial para datas
      if (sortField.includes('Date') || sortField.includes('date')) {
        aValue = FirebaseUtils.parseFirebaseDate(aValue) || new Date(0);
        bValue = FirebaseUtils.parseFirebaseDate(bValue) || new Date(0);
      }

      // Tratamento especial para números
      if (sortField === RESERVAS_FIELDS.bookingPrice) {
        aValue = parseFloat((aValue || '0').replace(',', '.')) || 0;
        bValue = parseFloat((bValue || '0').replace(',', '.')) || 0;
      }

      // Comparação
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);

  // Paginação
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Função para ordenar
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Seleção de linhas
  const handleRowSelect = (rowId) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map(row => row.id)));
    }
  };

  // Renderizar célula
  const renderCell = (row, column) => {
    const value = row[column.field];

    switch (column.type) {
      case 'date':
        const date = FirebaseUtils.parseFirebaseDate(value);
        return date ? date.toLocaleDateString('pt-PT') : '-';
      
      case 'datetime':
        return value || '-';
      
      case 'price':
        return FirebaseUtils.formatPrice(value);
      
      case 'status':
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            value === 'Entregue' ? 'bg-green-100 text-green-800' :
            value === 'recolhido' ? 'bg-blue-100 text-blue-800' :
            value === 'cancelado' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {value || '-'}
          </span>
        );
      
      case 'email':
        return value ? (
          <a href={`mailto:${value}`} className="text-blue-600 hover:text-blue-800">
            {value}
          </a>
        ) : '-';
      
      case 'phone':
        return value ? (
          <a href={`tel:${value}`} className="text-blue-600 hover:text-blue-800">
            {value}
          </a>
        ) : '-';
      
      case 'license':
        return value ? (
          <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
            {value}
          </span>
        ) : '-';
      
      case 'link':
        return value ? (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Search className="h-4 w-4" />
            Ver
          </a>
        ) : '-';
      
      case 'vehicle':
        const vehicleInfo = FirebaseUtils.parseVehicleInfo(value);
        return (
          <div className="text-sm">
            <div className="font-medium">{vehicleInfo.brand} {vehicleInfo.model}</div>
            <div className="text-gray-500">{vehicleInfo.color}</div>
          </div>
        );
      
      case 'customer':
        return (
          <div className="text-sm">
            <div className="font-medium">{row[RESERVAS_FIELDS.name]} {row[RESERVAS_FIELDS.lastName]}</div>
            <div className="text-gray-500">{row[RESERVAS_FIELDS.email]}</div>
          </div>
        );
      
      default:
        return value || '-';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Carregando dados...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8">
        <div className="text-center text-red-600">
          <p className="font-medium">Erro ao carregar dados</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center text-gray-500">
          <p className="font-medium">Nenhum dado encontrado</p>
          <p className="text-sm mt-1">Tente ajustar os filtros ou adicionar novos registos</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Cabeçalho da tabela */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="font-medium text-gray-900">
            {sortedData.length} registos encontrados
          </h3>
          {selectedRows.size > 0 && (
            <span className="text-sm text-blue-600">
              {selectedRows.size} selecionados
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {onExport && (
            <button
              onClick={() => onExport(selectedRows.size > 0 ? 
                sortedData.filter(row => selectedRows.has(row.id)) : 
                sortedData
              )}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            >
            <DollarSign className="h-4 w-4" />
            Exportar
            </button>
          )}
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {showActions && (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              {columns.map(column => (
                <th 
                  key={column.field}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => column.sortable !== false && handleSort(column.field)}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {sortField === column.field && (
                      sortDirection === 'asc' ? 
                        <CalendarDays className="h-4 w-4" /> : 
                        <Users className="h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
              {showActions && (
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map(row => (
              <tr 
                key={row.id}
                className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''} ${
                  selectedRows.has(row.id) ? 'bg-blue-50' : ''
                }`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {showActions && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                )}
                {columns.map(column => (
                  <td key={column.field} className="px-4 py-3 text-sm text-gray-900">
                    {renderCell(row, column)}
                  </td>
                ))}
                {showActions && (
                  <td className="px-4 py-3 text-right text-sm">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRowClick && onRowClick(row);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 rounded"
                        title="Ver detalhes"
                      >
                        <Search className="h-4 w-4" />
                      </button>
                      {onEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(row);
                          }}
                          className="p-1 text-gray-400 hover:text-green-600 rounded"
                          title="Editar"
                        >
                          <Filter className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(row);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                          title="Eliminar"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {((currentPage - 1) * pageSize) + 1} a {Math.min(currentPage * pageSize, sortedData.length)} de {sortedData.length} registos
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
