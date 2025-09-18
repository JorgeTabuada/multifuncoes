import React, { useState, useEffect } from 'react';
import { MultiparkDataService } from '../../services/firebaseService';

// Componente simples de Recolhas - filtra reservados por check-in
const RecolhasSimples = ({ appName, onNavigateToDashboard }) => {
  const [recolhas, setRecolhas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filtros simples
  const [dataCheckin, setDataCheckin] = useState(new Date().toISOString().split('T')[0]); // Hoje por defeito
  const [mostrarTodos, setMostrarTodos] = useState(false);

  // Buscar recolhas (reservados com check-in próximo)
  const buscarRecolhas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Buscando recolhas (reservados)...');
      
      // Buscar tudo da coleção reservas
      const result = await MultiparkDataService.getReservas({});
      
      let recolhasReais;
      
      if (mostrarTodos) {
        // Mostrar todos os reservados
        recolhasReais = result.filter(item => 
          item.stats === 'reservado' || 
          item.stats === 'recolhido' ||
          item.action === 'Recolha' ||
          item.condutorRecolha
        );
      } else {
        // Filtrar reservados para o dia selecionado (por checkinDate)
        recolhasReais = result.filter(item => {
          const isReservado = item.stats === 'reservado' || item.stats === 'recolhido' || item.action === 'Recolha';
          
          if (!isReservado) return false;
          
          if (dataCheckin) {
            const checkinDate = new Date(item.checkinDate || item.checkIn);
            const dataFiltro = new Date(dataCheckin);
            
            // Verificar se é do mesmo dia
            return checkinDate.toDateString() === dataFiltro.toDateString();
          }
          
          return true;
        });
      }
      
      console.log(`✅ Encontradas ${recolhasReais.length} recolhas`);
      setRecolhas(recolhasReais);
      
    } catch (err) {
      console.error('❌ Erro ao buscar recolhas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Buscar dados na inicialização
  useEffect(() => {
    buscarRecolhas();
  }, [dataCheckin, mostrarTodos]);

  // Mostrar todos os campos de uma recolha
  const mostrarTodosCampos = (recolha) => {
    const campos = Object.keys(recolha).sort();
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-bold mb-2">Todos os Campos da Recolha {recolha.id}:</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {campos.map(campo => (
            <div key={campo} className="bg-white p-2 rounded border">
              <strong>{campo}:</strong> {String(recolha[campo] || 'N/A')}
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
          <p className="text-gray-600">Recolhas (reservados) por data de check-in - DADOS REAIS</p>
        </div>
        <button onClick={onNavigateToDashboard} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Voltar
        </button>
      </div>

      {/* Filtros simples */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-medium mb-3">Filtros para Recolhas:</h3>
        <div className="flex gap-4 items-center flex-wrap">
          <div>
            <label className="block text-sm font-medium mb-1">Data Check-in:</label>
            <input 
              type="date" 
              value={dataCheckin} 
              onChange={e => setDataCheckin(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
              disabled={mostrarTodos}
            />
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="mostrarTodos"
              checked={mostrarTodos}
              onChange={e => setMostrarTodos(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="mostrarTodos" className="text-sm">Mostrar todos os reservados</label>
          </div>
          <button 
            onClick={buscarRecolhas}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando recolhas...</p>
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
              <div className="text-2xl font-bold text-blue-600">{recolhas.length}</div>
              <div className="text-sm text-gray-600">Total Recolhas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {recolhas.filter(r => r.stats === 'reservado').length}
              </div>
              <div className="text-sm text-gray-600">Reservados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {recolhas.filter(r => r.stats === 'recolhido').length}
              </div>
              <div className="text-sm text-gray-600">Recolhidos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {recolhas.filter(r => r.condutorRecolha).length}
              </div>
              <div className="text-sm text-gray-600">Com Condutor</div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de recolhas - TODOS OS CAMPOS */}
      {!loading && !error && recolhas.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Recolhas Encontradas ({recolhas.length}):</h3>
          
          {/* Tabela simples com campos principais */}
          <div className="bg-white rounded-lg border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">checkinDate</th>
                  <th className="px-4 py-2 text-left">checkIn</th>
                  <th className="px-4 py-2 text-left">name</th>
                  <th className="px-4 py-2 text-left">licensePlate</th>
                  <th className="px-4 py-2 text-left">park</th>
                  <th className="px-4 py-2 text-left">parkBrand</th>
                  <th className="px-4 py-2 text-left">city</th>
                  <th className="px-4 py-2 text-left">stats</th>
                  <th className="px-4 py-2 text-left">action</th>
                  <th className="px-4 py-2 text-left">condutorRecolha</th>
                  <th className="px-4 py-2 text-left">carLocation</th>
                  <th className="px-4 py-2 text-left">Ver Tudo</th>
                </tr>
              </thead>
              <tbody>
                {recolhas.slice(0, 50).map((recolha, index) => (
                  <tr key={recolha.id || index} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{recolha.id || 'N/A'}</td>
                    <td className="px-4 py-2">{recolha.checkinDate || 'N/A'}</td>
                    <td className="px-4 py-2">{recolha.checkIn || 'N/A'}</td>
                    <td className="px-4 py-2">{recolha.name || 'N/A'}</td>
                    <td className="px-4 py-2 font-mono">{recolha.licensePlate || 'N/A'}</td>
                    <td className="px-4 py-2">{recolha.park || 'N/A'}</td>
                    <td className="px-4 py-2">{recolha.parkBrand || 'N/A'}</td>
                    <td className="px-4 py-2">{recolha.city || 'N/A'}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        recolha.stats === 'recolhido' ? 'bg-green-100 text-green-800' :
                        recolha.stats === 'reservado' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {recolha.stats || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-2">{recolha.action || 'N/A'}</td>
                    <td className="px-4 py-2">{recolha.condutorRecolha || 'N/A'}</td>
                    <td className="px-4 py-2">{recolha.carLocation || 'N/A'}</td>
                    <td className="px-4 py-2">
                      <button 
                        onClick={() => {
                          const detalhes = document.getElementById(`detalhes-recolha-${index}`);
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
          {recolhas.slice(0, 10).map((recolha, index) => (
            <div key={`detalhes-recolha-${index}`} id={`detalhes-recolha-${index}`} style={{display: 'none'}}>
              {mostrarTodosCampos(recolha)}
            </div>
          ))}

          {recolhas.length > 50 && (
            <p className="text-gray-600 text-center">
              Mostrando primeiras 50 recolhas de {recolhas.length} encontradas
            </p>
          )}
        </div>
      )}

      {/* Sem dados */}
      {!loading && !error && recolhas.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">Nenhuma recolha encontrada para o período selecionado</p>
        </div>
      )}

      {/* Debug - Campos encontrados */}
      {!loading && !error && recolhas.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium mb-2">🔍 Campos encontrados na primeira recolha:</h4>
          <div className="text-sm text-gray-700">
            {Object.keys(recolhas[0]).sort().join(', ')}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecolhasSimples;
