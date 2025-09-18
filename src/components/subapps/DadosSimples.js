import React, { useState, useEffect } from 'react';
import { MultiparkDataService } from '../../services/firebaseService';

// Componente super simples - só filtro por cidade
const DadosSimples = ({ appName, onNavigateToDashboard }) => {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cidadeSelecionada, setCidadeSelecionada] = useState('');

  // Buscar dados por cidade
  const buscarDados = async (cidade) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔍 Buscando dados para: ${cidade || 'TODOS'}`);
      
      // Buscar tudo da coleção reservas
      const result = await MultiparkDataService.getReservas({});
      
      let dadosFiltrados;
      if (cidade) {
        // Filtrar por cidade
        dadosFiltrados = result.filter(item => 
          item.city && item.city.toLowerCase() === cidade.toLowerCase()
        );
      } else {
        dadosFiltrados = result;
      }
      
      console.log(`✅ Encontrados ${dadosFiltrados.length} registos`);
      setDados(dadosFiltrados);
      
    } catch (err) {
      console.error('❌ Erro ao buscar dados:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Buscar todos os dados na inicialização
  useEffect(() => {
    buscarDados('');
  }, []);

  // Filtrar por cidade
  const handleCidadeClick = (cidade) => {
    setCidadeSelecionada(cidade);
    buscarDados(cidade);
  };

  // Mostrar todos os campos de um registo
  const mostrarTodosCampos = (registo) => {
    const campos = Object.keys(registo).sort();
    return (
      <div className="bg-gray-50 p-4 rounded-lg mt-2">
        <h4 className="font-bold mb-2">Todos os Campos do Registo {registo.id}:</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {campos.map(campo => (
            <div key={campo} className="bg-white p-2 rounded border">
              <strong>{campo}:</strong> {String(registo[campo] || 'N/A')}
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
          <h1 className="text-2xl font-bold text-gray-900">Dados por Cidade</h1>
          <p className="text-gray-600">Filtro simples por cidade - só para ver se os dados estão lá</p>
        </div>
        <button onClick={onNavigateToDashboard} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Voltar
        </button>
      </div>

      {/* Filtros por cidade - 3 botões simples */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="font-medium mb-4">Escolha a Cidade:</h3>
        <div className="flex gap-4 flex-wrap">
          <button 
            onClick={() => handleCidadeClick('')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              cidadeSelecionada === '' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            TODOS ({dados.length})
          </button>
          <button 
            onClick={() => handleCidadeClick('lisbon')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              cidadeSelecionada === 'lisbon' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            LISBOA
          </button>
          <button 
            onClick={() => handleCidadeClick('porto')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              cidadeSelecionada === 'porto' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            PORTO
          </button>
          <button 
            onClick={() => handleCidadeClick('faro')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              cidadeSelecionada === 'faro' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            FARO
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando dados...</p>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Erro: {error}</p>
        </div>
      )}

      {/* Resultado */}
      {!loading && !error && (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="font-bold text-lg mb-4">
            Resultados {cidadeSelecionada ? `para ${cidadeSelecionada.toUpperCase()}` : '(TODOS)'}:
          </h3>
          
          <div className="text-2xl font-bold text-blue-600 mb-4">
            {dados.length} registos encontrados
          </div>

          {dados.length > 0 && (
            <>
              {/* Tabela simples */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm border-collapse border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">city</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">name</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">licensePlate</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">park</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">parkBrand</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">stats</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">bookingDate</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Ver Tudo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dados.slice(0, 20).map((registo, index) => (
                      <tr key={registo.id || index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{registo.id || 'N/A'}</td>
                        <td className="border border-gray-300 px-4 py-2 font-bold">
                          {registo.city || 'N/A'}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{registo.name || 'N/A'}</td>
                        <td className="border border-gray-300 px-4 py-2 font-mono">
                          {registo.licensePlate || 'N/A'}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{registo.park || 'N/A'}</td>
                        <td className="border border-gray-300 px-4 py-2">{registo.parkBrand || 'N/A'}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            registo.stats === 'Entregue' ? 'bg-green-100 text-green-800' :
                            registo.stats === 'recolhido' ? 'bg-blue-100 text-blue-800' :
                            registo.stats === 'reservado' ? 'bg-yellow-100 text-yellow-800' :
                            registo.stats === 'cancelado' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {registo.stats || 'N/A'}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{registo.bookingDate || 'N/A'}</td>
                        <td className="border border-gray-300 px-4 py-2">
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
              {dados.slice(0, 10).map((registo, index) => (
                <div key={`detalhes-${index}`} id={`detalhes-${index}`} style={{display: 'none'}}>
                  {mostrarTodosCampos(registo)}
                </div>
              ))}

              {dados.length > 20 && (
                <p className="text-gray-600 text-center mt-4">
                  Mostrando primeiros 20 registos de {dados.length} encontrados
                </p>
              )}
            </>
          )}

          {dados.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">
                {cidadeSelecionada 
                  ? `Nenhum registo encontrado para ${cidadeSelecionada.toUpperCase()}`
                  : 'Nenhum registo encontrado'
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* Resumo das cidades encontradas */}
      {!loading && !error && dados.length > 0 && !cidadeSelecionada && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium mb-2">🏙️ Cidades encontradas nos dados:</h4>
          <div className="text-sm">
            {Array.from(new Set(dados.map(d => d.city).filter(Boolean))).sort().map(cidade => {
              const count = dados.filter(d => d.city === cidade).length;
              return (
                <span key={cidade} className="inline-block bg-white px-2 py-1 rounded mr-2 mb-1">
                  <strong>{cidade}:</strong> {count} registos
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DadosSimples;
