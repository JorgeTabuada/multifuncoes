import React, { useState, useEffect } from 'react';
import { MultiparkDataService } from '../../services/firebaseService';

// Componente simples de Reservas - mostra TODOS os dados reais
const ReservasSimples = ({ appName, onNavigateToDashboard }) => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filtros simples
  const [dataInicio, setDataInicio] = useState(new Date().toISOString().split('T')[0]); // Hoje por defeito
  const [dataFim, setDataFim] = useState('');

  // Buscar reservas (tudo que tem bookingDate)
  const buscarReservas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Buscando TODAS as reservas...');
      
      // Buscar tudo da coleção reservas
      const result = await MultiparkDataService.getReservas({});
      
      // Filtrar apenas os que têm bookingDate (são reservas)
      const reservasReais = result.filter(item => item.bookingDate);
      
      // Aplicar filtro de data se especificado
      let reservasFiltradas = reservasReais;
      if (dataInicio) {
        reservasFiltradas = reservasFiltradas.filter(r => {
          const bookingDate = new Date(r.bookingDate);
          const inicio = new Date(dataInicio);
          return bookingDate >= inicio;
        });
      }
      if (dataFim) {
        reservasFiltradas = reservasFiltradas.filter(r => {
          const bookingDate = new Date(r.bookingDate);
          const fim = new Date(dataFim);
          return bookingDate <= fim;
        });
      }
      
      console.log(`✅ Encontradas ${reservasFiltradas.length} reservas`);
      setReservas(reservasFiltradas);
      
    } catch (err) {
      console.error('❌ Erro ao buscar reservas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Buscar dados na inicialização
  useEffect(() => {
    buscarReservas();
  }, [dataInicio, dataFim]);

  // Mostrar todos os campos de uma reserva
  const mostrarTodosCampos = (reserva) => {
    const campos = Object.keys(reserva).sort();
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-bold mb-2">Todos os Campos da Reserva {reserva.id}:</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {campos.map(campo => (
            <div key={campo} className="bg-white p-2 rounded border">
              <strong>{campo}:</strong> {String(reserva[campo] || 'N/A')}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{appName}</h1>
          <p className="text-gray-600">Todas as reservas (com bookingDate) - DADOS REAIS</p>
        </div>
        <button onClick={onNavigateToDashboard} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Voltar
        </button>
      </div>

      {/* Filtros simples */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-medium mb-3">Filtros por Data de Booking:</h3>
        <div className="flex gap-4 items-center">
          <div>
            <label className="block text-sm font-medium mb-1">Data Início:</label>
            <input 
              type="date" 
              value={dataInicio} 
              onChange={e => setDataInicio(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data Fim:</label>
            <input 
              type="date" 
              value={dataFim} 
              onChange={e => setDataFim(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <button 
            onClick={buscarReservas}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-6"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando reservas...</p>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Erro: {error}</p>
        </div>
      )}

      {/* Estatísticas simples */}
      {!loading && !error && (
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-2">Estatísticas:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{reservas.length}</div>
              <div className="text-sm text-gray-600">Total Reservas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {reservas.filter(r => r.stats === 'Entregue').length}
              </div>
              <div className="text-sm text-gray-600">Entregues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {reservas.filter(r => r.stats === 'recolhido').length}
              </div>
              <div className="text-sm text-gray-600">Recolhidos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {reservas.filter(r => r.stats === 'cancelado').length}
              </div>
              <div className="text-sm text-gray-600">Cancelados</div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de reservas - TODOS OS CAMPOS */}
      {!loading && !error && reservas.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Reservas Encontradas ({reservas.length}):</h3>
          
          {/* Tabela simples com campos principais */}
          <div className="bg-white rounded-lg border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">bookingDate</th>
                  <th className="px-4 py-2 text-left">checkinDate</th>
                  <th className="px-4 py-2 text-left">checkoutDate</th>
                  <th className="px-4 py-2 text-left">name</th>
                  <th className="px-4 py-2 text-left">licensePlate</th>
                  <th className="px-4 py-2 text-left">park</th>
                  <th className="px-4 py-2 text-left">parkBrand</th>
                  <th className="px-4 py-2 text-left">city</th>
                  <th className="px-4 py-2 text-left">stats</th>
                  <th className="px-4 py-2 text-left">action</th>
                  <th className="px-4 py-2 text-left">actionDate</th>
                  <th className="px-4 py-2 text-left">Ver Tudo</th>
                </tr>
              </thead>
              <tbody>
                {reservas.slice(0, 50).map((reserva, index) => (
                  <tr key={reserva.id || index} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{reserva.id || 'N/A'}</td>
                    <td className="px-4 py-2">{reserva.bookingDate || 'N/A'}</td>
                    <td className="px-4 py-2">{reserva.checkinDate || 'N/A'}</td>
                    <td className="px-4 py-2">{reserva.checkoutDate || 'N/A'}</td>
                    <td className="px-4 py-2">{reserva.name || 'N/A'}</td>
                    <td className="px-4 py-2 font-mono">{reserva.licensePlate || 'N/A'}</td>
                    <td className="px-4 py-2">{reserva.park || 'N/A'}</td>
                    <td className="px-4 py-2">{reserva.parkBrand || 'N/A'}</td>
                    <td className="px-4 py-2">{reserva.city || 'N/A'}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        reserva.stats === 'Entregue' ? 'bg-green-100 text-green-800' :
                        reserva.stats === 'recolhido' ? 'bg-blue-100 text-blue-800' :
                        reserva.stats === 'cancelado' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {reserva.stats || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-2">{reserva.action || 'N/A'}</td>
                    <td className="px-4 py-2">{reserva.actionDate || 'N/A'}</td>
                    <td className="px-4 py-2">
                      <button 
                        onClick={() => {
                          const detalhes = document.getElementById(`detalhes-${index}`);
                          detalhes.style.display = detalhes.style.display === 'none' ? 'block' : 'none';
                        }}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                      >
                        Ver Todos
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detalhes completos (ocultos por defeito) */}
          {reservas.slice(0, 10).map((reserva, index) => (
            <div key={`detalhes-${index}`} id={`detalhes-${index}`} style={{display: 'none'}}>
              {mostrarTodosCampos(reserva)}
            </div>
          ))}

          {reservas.length > 50 && (
            <p className="text-gray-600 text-center">
              Mostrando primeiras 50 reservas de {reservas.length} encontradas
            </p>
          )}
        </div>
      )}

      {/* Sem dados */}
      {!loading && !error && reservas.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">Nenhuma reserva encontrada para o período selecionado</p>
        </div>
      )}

      {/* Debug - Campos encontrados */}
      {!loading && !error && reservas.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium mb-2">🔍 Campos encontrados na primeira reserva:</h4>
          <div className="text-sm text-gray-700">
            {Object.keys(reservas[0]).sort().join(', ')}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservasSimples;
