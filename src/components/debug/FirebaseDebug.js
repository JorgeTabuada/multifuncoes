import React, { useState, useEffect } from 'react';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../../config/firebase';

// Componente para diagnosticar e mapear dados reais do Firebase
const FirebaseDebugger = ({ collectionName = 'reservas' }) => {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldMapping, setFieldMapping] = useState({});

  const fetchRawData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔍 Buscando dados da coleção: ${collectionName}`);
      
      // Buscar apenas os primeiros 5 documentos para análise
      const q = query(collection(db, collectionName), limit(5));
      const querySnapshot = await getDocs(q);
      
      const documents = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`📄 Documento ${doc.id}:`, data);
        documents.push({
          id: doc.id,
          ...data
        });
      });
      
      setRawData(documents);
      
      // Analisar campos disponíveis
      if (documents.length > 0) {
        const allFields = new Set();
        documents.forEach(doc => {
          Object.keys(doc).forEach(field => allFields.add(field));
        });
        
        const mapping = {};
        allFields.forEach(field => {
          mapping[field] = typeof documents[0][field];
        });
        
        setFieldMapping(mapping);
        console.log('🗺️ Mapeamento de campos:', mapping);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('❌ Erro ao buscar dados:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRawData();
  }, [collectionName]);

  return (
    <div className="subapp-section">
      <h2 className="subapp-section-title">
        🔍 Diagnóstico Firebase - Coleção: {collectionName}
      </h2>
      
      <div className="mb-4">
        <button onClick={fetchRawData} className="action-button" disabled={loading}>
          {loading ? 'Analisando...' : 'Analisar Dados'}
        </button>
      </div>

      {loading && (
        <div className="content-placeholder">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2">Analisando estrutura dos dados...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 p-4 rounded-lg mb-4">
          <h4 className="font-semibold text-red-800 mb-2">❌ Erro:</h4>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {Object.keys(fieldMapping).length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg mb-4">
          <h4 className="font-semibold text-green-800 mb-2">✅ Campos Encontrados:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(fieldMapping).map(([field, type]) => (
              <div key={field} className="flex justify-between">
                <span className="font-mono text-green-700">{field}:</span>
                <span className="text-green-600">{type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {rawData.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">📊 Dados de Exemplo:</h4>
          <div className="text-xs overflow-x-auto">
            <pre className="bg-white p-2 rounded border">
              {JSON.stringify(rawData, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {rawData.length === 0 && !loading && !error && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Coleção Vazia:</h4>
          <p className="text-yellow-700">
            A coleção '{collectionName}' não contém dados ou não existe.
          </p>
        </div>
      )}
    </div>
  );
};

// Componente para testar múltiplas coleções
const FirebaseCollectionExplorer = () => {
  const [selectedCollection, setSelectedCollection] = useState('reservas');
  
  const commonCollections = [
    'reservas',
    'recolhas', 
    'entregas',
    'utilizadores',
    'produtividade_condutores',
    'comentarios_reclamacoes',
    'marketing',
    'logs_alteracoes'
  ];

  return (
    <div className="subapp-page w-full max-w-6xl mx-auto p-4">
      <div className="subapp-header">
        <h1 className="subapp-title">🔍 Explorador Firebase</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Diagnóstico dos dados reais do Firebase
          </div>
          <button 
            onClick={() => window.history.back()} 
            className="action-button secondary"
          >
            Voltar
          </button>
        </div>
      </div>

      <div className="subapp-section">
        <h2 className="subapp-section-title">Selecionar Coleção</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {commonCollections.map(collection => (
            <button
              key={collection}
              onClick={() => setSelectedCollection(collection)}
              className={`px-3 py-1 rounded text-sm ${
                selectedCollection === collection
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {collection}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            placeholder="Nome da coleção personalizada"
            className="flex-1 p-2 border rounded"
          />
        </div>
      </div>

      <FirebaseDebugger collectionName={selectedCollection} />
    </div>
  );
};

export default FirebaseCollectionExplorer;
