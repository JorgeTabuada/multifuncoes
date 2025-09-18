import React, { useState, useEffect } from 'react';
import { MultiparkDataService } from '../../services/firebaseService';

// Componente para mostrar TODOS os campos encontrados no Firebase
const CamposCompletos = ({ onNavigateToDashboard }) => {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [camposUnicos, setCamposUnicos] = useState(new Set());
  const [estatisticas, setEstatisticas] = useState({});

  // Buscar TODOS os dados
  const buscarTodosDados = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Buscando TODOS os dados da coleção reservas...');
      
      // Buscar tudo sem filtros
      const result = await MultiparkDataService.getReservas({});
      
      console.log(`✅ Encontrados ${result.length} registos`);
      setDados(result);
      
      // Analisar todos os campos únicos
      const campos = new Set();
      const stats = {};
      
      result.forEach(item => {
        Object.keys(item).forEach(campo => {
          campos.add(campo);
          
          // Contar valores únicos por campo
          if (!stats[campo]) {
            stats[campo] = new Set();
          }
          if (item[campo] !== null && item[campo] !== undefined && item[campo] !== '') {
            stats[campo].add(String(item[campo]));
          }
        });
      });
      
      setCamposUnicos(campos);
      
      // Converter Sets para arrays para mostrar
      const estatisticasFinais = {};
      Object.keys(stats).forEach(campo => {
        estatisticasFinais[campo] = {
          valoresUnicos: stats[campo].size,
          exemplos: Array.from(stats[campo]).slice(0, 5)
        };
      });
      
      setEstatisticas(estatisticasFinais);
      
    } catch (err) {
      console.error('❌ Erro ao buscar dados:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Buscar dados na inicialização
  useEffect(() => {
    buscarTodosDados();
  }, []);

  // Analisar tipos de registos
  const analisarTipos = () => {
    const tipos = {
      comBookingDate: dados.filter(d => d.bookingDate).length,
      comCheckinDate: dados.filter(d => d.checkinDate).length,
      comCheckoutDate: dados.filter(d => d.checkoutDate).length,
      reservados: dados.filter(d => d.stats === 'reservado').length,
      recolhidos: dados.filter(d => d.stats === 'recolhido').length,
      entregues: dados.filter(d => d.stats === 'Entregue').length,
      cancelados: dados.filter(d => d.stats === 'cancelado').length,
      comAction: dados.filter(d => d.action).length,
      comCondutorRecolha: dados.filter(d => d.condutorRecolha).length,
      comParkBrand: dados.filter(d => d.parkBrand).length,
      comCity: dados.filter(d => d.city).length,
      comCampaign: dados.filter(d => d.campaign).length,
      comExtraServices: dados.filter(d => d.extraServices).length,
      comOnlinePayment: dados.filter(d => d.hasOnlinePayment).length,
      comOcorrenceType: dados.filter(d => d.ocorrenceType).length,
      comReturnFlight: dados.filter(d => d.returnFlight).length
    };
    
    return tipos;
  };

  const tipos = dados.length > 0 ? analisarTipos() : {};

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Análise Completa dos Dados Firebase</h1>
          <p className="text-gray-600">TODOS os campos e valores encontrados na coleção reservas</p>
        </div>
        <button onClick={onNavigateToDashboard} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Voltar
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Analisando todos os dados...</p>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Erro: {error}</p>
        </div>
      )}

      {/* Estatísticas gerais */}
      {!loading && !error && dados.length > 0 && (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="font-bold text-lg mb-4">📊 Estatísticas Gerais</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{dados.length}</div>
              <div className="text-sm text-gray-600">Total Registos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{camposUnicos.size}</div>
              <div className="text-sm text-gray-600">Campos Únicos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{tipos.comBookingDate}</div>
              <div className="text-sm text-gray-600">Com bookingDate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{tipos.reservados}</div>
              <div className="text-sm text-gray-600">Reservados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{tipos.recolhidos}</div>
              <div className="text-sm text-gray-600">Recolhidos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{tipos.entregues}</div>
              <div className="text-sm text-gray-600">Entregues</div>
            </div>
          </div>
        </div>
      )}

      {/* Análise por tipo de registo */}
      {!loading && !error && dados.length > 0 && (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="font-bold text-lg mb-4">🔍 Análise por Tipo de Registo</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
            {Object.entries(tipos).map(([tipo, count]) => (
              <div key={tipo} className="bg-gray-50 p-3 rounded">
                <div className="font-medium">{tipo}:</div>
                <div className="text-lg font-bold text-blue-600">{count}</div>
                <div className="text-xs text-gray-500">
                  {((count / dados.length) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista completa de campos */}
      {!loading && !error && camposUnicos.size > 0 && (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="font-bold text-lg mb-4">📋 TODOS os Campos Encontrados ({camposUnicos.size})</h3>
          <div className="space-y-3">
            {Array.from(camposUnicos).sort().map(campo => (
              <div key={campo} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono font-medium text-blue-800">{campo}</span>
                    <span className="ml-2 text-sm text-gray-600">
                      ({estatisticas[campo]?.valoresUnicos || 0} valores únicos)
                    </span>
                  </div>
                </div>
                {estatisticas[campo]?.exemplos && (
                  <div className="mt-1 text-xs text-gray-600">
                    <strong>Exemplos:</strong> {estatisticas[campo].exemplos.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campos importantes que mencionou */}
      {!loading && !error && dados.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-bold text-lg mb-4">⭐ Campos Importantes que Mencionou</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
            {[
              'parkingType', 'actionDate', 'parkBrand', 'city', 'bookingDate', 
              'condutorRecolha', 'checkoutDate', 'checkinDate', 'campaignPay', 
              'carLocation', 'campaign', 'extraServices', 'campaignId', 'action', 
              'returnFlight', 'stats', 'checkIn', 'hasOnlinePayment', 'ocorrenceType', 
              'checkOut'
            ].map(campo => (
              <div key={campo} className={`p-2 rounded ${
                camposUnicos.has(campo) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <div className="font-mono text-xs">{campo}</div>
                <div className="text-xs">
                  {camposUnicos.has(campo) ? 
                    `✅ ${estatisticas[campo]?.valoresUnicos || 0} valores` : 
                    '❌ Não encontrado'
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Primeiros registos para análise */}
      {!loading && !error && dados.length > 0 && (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="font-bold text-lg mb-4">🔬 Primeiros 3 Registos (para análise)</h3>
          {dados.slice(0, 3).map((registo, index) => (
            <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Registo {index + 1} (ID: {registo.id || 'N/A'}):</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
                {Object.entries(registo).sort().map(([campo, valor]) => (
                  <div key={campo} className="bg-white p-2 rounded border">
                    <div className="font-mono font-medium text-blue-700">{campo}:</div>
                    <div className="text-gray-800 break-words">
                      {valor === null || valor === undefined ? 'null' : String(valor)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sem dados */}
      {!loading && !error && dados.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">Nenhum dado encontrado na coleção</p>
        </div>
      )}
    </div>
  );
};

export default CamposCompletos;
