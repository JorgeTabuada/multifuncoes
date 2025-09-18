import React from 'react';

// Componente para mostrar quando não há dados no Firebase
export const NoDataFallback = ({ message = "Nenhum dado encontrado", onCreateSample }) => (
  <div className="content-placeholder">
    <div className="text-center">
      <div className="text-gray-500 mb-4">
        <svg className="h-16 w-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3"></path>
        </svg>
        <p className="text-lg font-medium">{message}</p>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg text-left mb-4">
        <h4 className="font-semibold mb-2">💡 Possíveis Soluções:</h4>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Verificar se a coleção existe no Firestore</li>
          <li>Confirmar as regras de segurança do Firebase</li>
          <li>Tentar com filtros diferentes</li>
          <li>Criar dados de exemplo para testar</li>
        </ul>
      </div>
      
      {onCreateSample && (
        <button onClick={onCreateSample} className="action-button">
          Criar Dados de Exemplo
        </button>
      )}
    </div>
  </div>
);

// Componente para erros de Firebase
export const FirebaseErrorFallback = ({ error, onRetry }) => (
  <div className="content-placeholder">
    <div className="text-center">
      <div className="text-red-500 mb-4">
        <svg className="h-16 w-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <p className="text-lg font-medium mb-2">Erro ao carregar dados</p>
        <p className="text-sm text-gray-600 mb-4">{error}</p>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg text-left mb-4">
        <h4 className="font-semibold mb-2">🔧 Soluções Comuns:</h4>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li><strong>Índices em falta:</strong> Criar índices no Firebase Console</li>
          <li><strong>Regras de segurança:</strong> Verificar permissões de leitura</li>
          <li><strong>Conectividade:</strong> Verificar ligação à internet</li>
          <li><strong>Configuração:</strong> Confirmar credenciais Firebase</li>
        </ul>
      </div>
      
      {onRetry && (
        <button onClick={onRetry} className="action-button">
          Tentar Novamente
        </button>
      )}
    </div>
  </div>
);

// Componente para criar dados de exemplo
export const CreateSampleData = ({ collectionName, onCreateSample }) => {
  const sampleData = {
    reservas: [
      {
        cliente: "João Silva",
        matricula: "AA-11-BB",
        parque: "lisboa",
        estado: "Confirmada",
        valor: 25.50,
        data: new Date(),
        projeto: "Multipark Lisboa"
      },
      {
        cliente: "Maria Santos",
        matricula: "CC-22-DD",
        parque: "porto",
        estado: "Pendente",
        valor: 30.00,
        data: new Date(),
        projeto: "Multipark Porto"
      }
    ],
    recolhas: [
      {
        condutor: "Pedro Costa",
        matricula: "EE-33-FF",
        parque: "lisboa",
        estado: "Concluída",
        valor: 15.00,
        data: new Date(),
        detalhes: "Recolha normal"
      }
    ],
    entregas: [
      {
        condutor: "Ana Ferreira",
        matricula: "GG-44-HH",
        cliente: "Carlos Mendes",
        parque: "faro",
        estado: "Entregue",
        data: new Date()
      }
    ]
  };

  const handleCreateSample = () => {
    if (onCreateSample && sampleData[collectionName]) {
      onCreateSample(sampleData[collectionName]);
    }
  };

  return (
    <div className="bg-green-50 p-4 rounded-lg">
      <h4 className="font-semibold mb-2">🚀 Criar Dados de Exemplo</h4>
      <p className="text-sm mb-4">
        Criar alguns registos de exemplo para testar a aplicação?
      </p>
      <button onClick={handleCreateSample} className="action-button">
        Criar {sampleData[collectionName]?.length || 0} registos de exemplo
      </button>
    </div>
  );
};

export default {
  NoDataFallback,
  FirebaseErrorFallback,
  CreateSampleData
};
