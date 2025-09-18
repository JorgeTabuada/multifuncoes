import { useState, useEffect, useCallback } from 'react';
import { MultiparkDataService } from '../services/firebaseService';
import { FirebaseUtils } from '../config/firebaseMapping';

// Hook personalizado para buscar dados do Firebase com filtros avançados
export const useFirebaseData = (collectionType = 'reservas', initialFilters = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [lastFetch, setLastFetch] = useState(null);

  // Função para buscar dados baseada no tipo de coleção
  const fetchData = useCallback(async (currentFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔍 Buscando ${collectionType} com filtros:`, currentFilters);
      
      let result = [];
      
      switch (collectionType) {
        case 'reservas':
          result = await MultiparkDataService.getReservas(currentFilters);
          break;
        case 'recolhas':
          result = await MultiparkDataService.getRecolhas(currentFilters);
          break;
        case 'entregas':
          result = await MultiparkDataService.getEntregas(currentFilters);
          break;
        default:
          throw new Error(`Tipo de coleção não suportado: ${collectionType}`);
      }
      
      console.log(`✅ ${collectionType} encontradas:`, result.length);
      setData(result);
      setLastFetch(new Date());
      
    } catch (err) {
      console.error(`❌ Erro ao buscar ${collectionType}:`, err);
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [collectionType, filters]);

  // Aplicar novos filtros
  const applyFilters = useCallback((newFilters) => {
    console.log('🔧 Aplicando novos filtros:', newFilters);
    setFilters(newFilters);
    fetchData(newFilters);
  }, [fetchData]);

  // Limpar filtros
  const clearFilters = useCallback(() => {
    console.log('🧹 Limpando filtros');
    const emptyFilters = {};
    setFilters(emptyFilters);
    fetchData(emptyFilters);
  }, [fetchData]);

  // Recarregar dados
  const refetch = useCallback(() => {
    console.log('🔄 Recarregando dados');
    fetchData(filters);
  }, [fetchData, filters]);

  // Buscar dados na inicialização
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    filters,
    lastFetch,
    applyFilters,
    clearFilters,
    refetch
  };
};

// Hook específico para reservas com estatísticas
export const useReservasWithStats = (initialFilters = {}) => {
  const { data: reservas, loading, error, ...rest } = useFirebaseData('reservas', initialFilters);

  // Calcular estatísticas das reservas
  const stats = {
    total: reservas.length,
    entregues: reservas.filter(r => r.stats === 'Entregue').length,
    recolhidos: reservas.filter(r => r.stats === 'recolhido').length,
    cancelados: reservas.filter(r => r.stats === 'cancelado').length,
    pendentes: reservas.filter(r => !['Entregue', 'recolhido', 'cancelado'].includes(r.stats)).length,
    
    // Estatísticas por parque
    porParque: reservas.reduce((acc, r) => {
      const parque = r.park || 'Sem parque';
      acc[parque] = (acc[parque] || 0) + 1;
      return acc;
    }, {}),
    
    // Estatísticas por marca
    porMarca: reservas.reduce((acc, r) => {
      const marca = r.parkBrand || 'Sem marca';
      acc[marca] = (acc[marca] || 0) + 1;
      return acc;
    }, {}),
    
    // Valor total
    valorTotal: reservas.reduce((sum, r) => {
      const preco = parseFloat((r.bookingPrice || '0').replace(',', '.'));
      return sum + (isNaN(preco) ? 0 : preco);
    }, 0),
    
    // Reservas por mês
    porMes: reservas.reduce((acc, r) => {
      const data = FirebaseUtils.parseFirebaseDate(r.checkinDate || r.bookingDate);
      if (data) {
        const mes = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
        acc[mes] = (acc[mes] || 0) + 1;
      }
      return acc;
    }, {})
  };

  return {
    reservas,
    stats,
    loading,
    error,
    ...rest
  };
};

// Hook para buscar dados em tempo real (com polling)
export const useFirebaseRealTime = (collectionType, filters = {}, intervalMs = 30000) => {
  const [isRealTime, setIsRealTime] = useState(false);
  const firebaseData = useFirebaseData(collectionType, filters);

  useEffect(() => {
    if (!isRealTime) return;

    const interval = setInterval(() => {
      console.log('🔄 Atualizando dados em tempo real...');
      firebaseData.refetch();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isRealTime, intervalMs, firebaseData.refetch]);

  const startRealTime = useCallback(() => {
    console.log('▶️ Iniciando modo tempo real');
    setIsRealTime(true);
  }, []);

  const stopRealTime = useCallback(() => {
    console.log('⏹️ Parando modo tempo real');
    setIsRealTime(false);
  }, []);

  return {
    ...firebaseData,
    isRealTime,
    startRealTime,
    stopRealTime
  };
};

// Hook para cache de dados
export const useFirebaseCache = (collectionType, filters = {}, cacheTimeMs = 300000) => {
  const [cache, setCache] = useState(new Map());
  const firebaseData = useFirebaseData(collectionType, filters);

  const getCacheKey = useCallback((type, filters) => {
    return `${type}_${JSON.stringify(filters)}`;
  }, []);

  const getCachedData = useCallback((type, filters) => {
    const key = getCacheKey(type, filters);
    const cached = cache.get(key);
    
    if (cached && (Date.now() - cached.timestamp) < cacheTimeMs) {
      console.log('📦 Usando dados do cache:', key);
      return cached.data;
    }
    
    return null;
  }, [cache, getCacheKey, cacheTimeMs]);

  const setCachedData = useCallback((type, filters, data) => {
    const key = getCacheKey(type, filters);
    console.log('💾 Salvando no cache:', key);
    setCache(prev => new Map(prev).set(key, {
      data,
      timestamp: Date.now()
    }));
  }, [getCacheKey]);

  // Interceptar dados para cache
  useEffect(() => {
    if (firebaseData.data.length > 0 && !firebaseData.loading && !firebaseData.error) {
      setCachedData(collectionType, firebaseData.filters, firebaseData.data);
    }
  }, [firebaseData.data, firebaseData.loading, firebaseData.error, firebaseData.filters, collectionType, setCachedData]);

  return {
    ...firebaseData,
    getCachedData,
    clearCache: () => setCache(new Map())
  };
};

export default {
  useFirebaseData,
  useReservasWithStats,
  useFirebaseRealTime,
  useFirebaseCache
};
