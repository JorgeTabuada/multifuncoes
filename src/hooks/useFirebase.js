// Hook personalizado para integração com Firebase
import { useState, useEffect } from 'react';
import { FirebaseService, MultiparkDataService } from '../services/firebaseService';

// Hook genérico para obter dados de uma coleção
export const useFirebaseCollection = (collectionName, filters = [], realTime = false) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (realTime) {
          // Subscrever para atualizações em tempo real
          const unsubscribe = FirebaseService.subscribeToCollection(
            collectionName,
            (documents) => {
              setData(documents);
              setLoading(false);
            },
            filters
          );
          
          // Cleanup function
          return () => unsubscribe();
        } else {
          // Obter dados uma vez
          const documents = filters.length > 0 
            ? await FirebaseService.queryCollection(collectionName, filters)
            : await FirebaseService.getCollection(collectionName);
          
          setData(documents);
          setLoading(false);
        }
      } catch (err) {
        console.error('Erro ao obter dados:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, JSON.stringify(filters), realTime]);

  return { data, loading, error };
};

// Hook para obter um documento específico
export const useFirebaseDocument = (collectionName, documentId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!documentId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const document = await FirebaseService.getDocument(collectionName, documentId);
        setData(document);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao obter documento:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDocument();
  }, [collectionName, documentId]);

  return { data, loading, error };
};

// Hook específico para reservas
export const useReservas = (filters = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const reservas = await MultiparkDataService.getReservas(filters);
        setData(reservas);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao obter reservas:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchReservas();
  }, [JSON.stringify(filters)]);

  return { data, loading, error, refetch: () => fetchReservas() };
};

// Hook específico para recolhas
export const useRecolhas = (filters = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecolhas = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const recolhas = await MultiparkDataService.getRecolhas(filters);
        setData(recolhas);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao obter recolhas:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRecolhas();
  }, [JSON.stringify(filters)]);

  return { data, loading, error, refetch: () => fetchRecolhas() };
};

// Hook específico para entregas
export const useEntregas = (filters = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntregas = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const entregas = await MultiparkDataService.getEntregas(filters);
        setData(entregas);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao obter entregas:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEntregas();
  }, [JSON.stringify(filters)]);

  return { data, loading, error, refetch: () => fetchEntregas() };
};

// Hook específico para produtividade dos condutores
export const useProdutividadeCondutores = (filters = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProdutividade = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const produtividade = await MultiparkDataService.getProdutividadeCondutores(filters);
        setData(produtividade);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao obter produtividade:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProdutividade();
  }, [JSON.stringify(filters)]);

  return { data, loading, error, refetch: () => fetchProdutividade() };
};

// Hook específico para comentários e reclamações
export const useComentariosReclamacoes = (filters = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComentarios = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const comentarios = await MultiparkDataService.getComentariosReclamacoes(filters);
        setData(comentarios);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao obter comentários:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchComentarios();
  }, [JSON.stringify(filters)]);

  return { data, loading, error, refetch: () => fetchComentarios() };
};

// Hook para operações CRUD genéricas
export const useFirebaseCRUD = (collectionName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addDocument = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const id = await FirebaseService.addDocument(collectionName, data);
      setLoading(false);
      return id;
    } catch (err) {
      console.error('Erro ao adicionar documento:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const updateDocument = async (documentId, data) => {
    try {
      setLoading(true);
      setError(null);
      
      await FirebaseService.updateDocument(collectionName, documentId, data);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Erro ao atualizar documento:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const deleteDocument = async (documentId) => {
    try {
      setLoading(true);
      setError(null);
      
      await FirebaseService.deleteDocument(collectionName, documentId);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Erro ao eliminar documento:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return {
    addDocument,
    updateDocument,
    deleteDocument,
    loading,
    error
  };
};
