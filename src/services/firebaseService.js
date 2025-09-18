// Serviços Firebase para interação com os dados do admin-multipark
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FIREBASE_COLLECTIONS, RESERVAS_FIELDS, ENTREGAS_FIELDS, FirebaseUtils } from '../config/firebaseMapping';

// Serviço genérico para operações CRUD
export class FirebaseService {
  
  // Obter todos os documentos de uma coleção
  static async getCollection(collectionName) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return documents;
    } catch (error) {
      console.error(`Erro ao obter coleção ${collectionName}:`, error);
      throw error;
    }
  }

  // Obter um documento específico
  static async getDocument(collectionName, documentId) {
    try {
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        console.log("Documento não encontrado!");
        return null;
      }
    } catch (error) {
      console.error(`Erro ao obter documento ${documentId}:`, error);
      throw error;
    }
  }

  // Adicionar um novo documento
  static async addDocument(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log("Documento adicionado com ID: ", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error(`Erro ao adicionar documento:`, error);
      throw error;
    }
  }

  // Atualizar um documento
  static async updateDocument(collectionName, documentId, data) {
    try {
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      console.log("Documento atualizado com sucesso!");
      return true;
    } catch (error) {
      console.error(`Erro ao atualizar documento:`, error);
      throw error;
    }
  }

  // Eliminar um documento
  static async deleteDocument(collectionName, documentId) {
    try {
      await deleteDoc(doc(db, collectionName, documentId));
      console.log("Documento eliminado com sucesso!");
      return true;
    } catch (error) {
      console.error(`Erro ao eliminar documento:`, error);
      throw error;
    }
  }

  // Consulta com filtros
  static async queryCollection(collectionName, filters = [], orderByField = null, limitCount = null) {
    try {
      let q = collection(db, collectionName);
      
      // Aplicar filtros
      filters.forEach(filter => {
        q = query(q, where(filter.field, filter.operator, filter.value));
      });
      
      // Aplicar ordenação
      if (orderByField) {
        q = query(q, orderBy(orderByField));
      }
      
      // Aplicar limite
      if (limitCount) {
        q = query(q, limit(limitCount));
      }
      
      const querySnapshot = await getDocs(q);
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return documents;
    } catch (error) {
      console.error(`Erro na consulta da coleção ${collectionName}:`, error);
      throw error;
    }
  }

  // Listener em tempo real para uma coleção
  static subscribeToCollection(collectionName, callback, filters = []) {
    try {
      let q = collection(db, collectionName);
      
      // Aplicar filtros se existirem
      filters.forEach(filter => {
        q = query(q, where(filter.field, filter.operator, filter.value));
      });
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const documents = [];
        querySnapshot.forEach((doc) => {
          documents.push({
            id: doc.id,
            ...doc.data()
          });
        });
        callback(documents);
      });
      
      return unsubscribe; // Retorna função para cancelar a subscrição
    } catch (error) {
      console.error(`Erro ao subscrever à coleção ${collectionName}:`, error);
      throw error;
    }
  }
}

// Serviços específicos para as entidades do Multipark
// Baseado na estrutura real do Firebase admin-multipark

export class MultiparkDataService {
  
  // Obter reservas (usando campos reais do Firebase)
  static async getReservas(filters = {}) {
    try {
      console.log('🔍 Buscando reservas com filtros:', filters);
      
      // Usar apenas um filtro Firebase por vez para evitar índices compostos
      const filterArray = [];
      
      // Priorizar filtros na seguinte ordem:
      if (filters.park) {
        filterArray.push({ field: RESERVAS_FIELDS.park, operator: '==', value: filters.park });
      } else if (filters.parkBrand) {
        filterArray.push({ field: RESERVAS_FIELDS.parkBrand, operator: '==', value: filters.parkBrand });
      } else if (filters.city) {
        filterArray.push({ field: RESERVAS_FIELDS.city, operator: '==', value: filters.city });
      } else if (filters.stats) {
        filterArray.push({ field: RESERVAS_FIELDS.stats, operator: '==', value: filters.stats });
      }
      
      // Obter dados do Firebase
      let reservas = await FirebaseService.queryCollection(
        FIREBASE_COLLECTIONS.RESERVAS, 
        filterArray, 
        null, 
        200 // Aumentar limite para ter mais dados
      );
      
      console.log(`📊 Encontradas ${reservas.length} reservas no Firebase`);
      
      // Aplicar filtros adicionais no cliente (JavaScript)
      if (filters.dataInicio) {
        reservas = reservas.filter(r => {
          const dataReserva = FirebaseUtils.parseFirebaseDate(r[RESERVAS_FIELDS.checkinDate] || r[RESERVAS_FIELDS.bookingDate]);
          return dataReserva && dataReserva >= filters.dataInicio;
        });
      }
      
      if (filters.dataFim) {
        reservas = reservas.filter(r => {
          const dataReserva = FirebaseUtils.parseFirebaseDate(r[RESERVAS_FIELDS.checkoutDate] || r[RESERVAS_FIELDS.checkinDate]);
          return dataReserva && dataReserva <= filters.dataFim;
        });
      }
      
      if (filters.cliente) {
        reservas = reservas.filter(r => {
          const nomeCompleto = `${r[RESERVAS_FIELDS.name] || ''} ${r[RESERVAS_FIELDS.lastName] || ''}`.toLowerCase();
          return nomeCompleto.includes(filters.cliente.toLowerCase()) ||
                 (r[RESERVAS_FIELDS.email] || '').toLowerCase().includes(filters.cliente.toLowerCase());
        });
      }
      
      if (filters.matricula) {
        reservas = reservas.filter(r => 
          (r[RESERVAS_FIELDS.licensePlate] || '').toLowerCase().includes(filters.matricula.toLowerCase())
        );
      }
      
      if (filters.stats && !filterArray.some(f => f.field === RESERVAS_FIELDS.stats)) {
        reservas = reservas.filter(r => r[RESERVAS_FIELDS.stats] === filters.stats);
      }
      
      if (filters.action) {
        reservas = reservas.filter(r => r[RESERVAS_FIELDS.action] === filters.action);
      }
      
      // Ordenar por data de histórico (mais recente primeiro)
      reservas.sort((a, b) => {
        const dataA = new Date(a[RESERVAS_FIELDS.historyDate] || a[RESERVAS_FIELDS.checkinDate] || 0);
        const dataB = new Date(b[RESERVAS_FIELDS.historyDate] || b[RESERVAS_FIELDS.checkinDate] || 0);
        return dataB - dataA;
      });
      
      console.log(`✅ Retornando ${reservas.length} reservas após filtros`);
      return reservas;
    } catch (error) {
      console.error('❌ Erro ao obter reservas:', error);
      throw error;
    }
  }

  // Obter recolhas (filtrar da coleção 'reservas' por action='Movimentação' ou stats='recolhido')
  static async getRecolhas(filters = {}) {
    try {
      console.log('🔍 Buscando recolhas com filtros:', filters);
      
      // Primeiro tentar buscar da coleção 'recolhas' (se existir)
      let recolhas = [];
      try {
        recolhas = await FirebaseService.queryCollection(FIREBASE_COLLECTIONS.RECOLHAS, [], null, 50);
      } catch (err) {
        console.log('📝 Coleção recolhas vazia, buscando da coleção reservas...');
      }
      
      // Se não há dados em 'recolhas', buscar da coleção 'reservas'
      if (recolhas.length === 0) {
        const filterArray = [];
        
        // Filtrar por ação de movimentação ou estado recolhido
        if (filters.park) {
          filterArray.push({ field: RESERVAS_FIELDS.park, operator: '==', value: filters.park });
        } else {
          // Buscar registos com action='Movimentação' ou stats='recolhido'
          filterArray.push({ field: RESERVAS_FIELDS.action, operator: '==', value: 'Movimentação' });
        }
        
        let reservas = await FirebaseService.queryCollection(FIREBASE_COLLECTIONS.RESERVAS, filterArray, null, 200);
        
        // Filtrar apenas recolhas (Movimentação ou recolhido)
        recolhas = reservas.filter(r => {
          const action = (r[RESERVAS_FIELDS.action] || '').toLowerCase();
          const stats = (r[RESERVAS_FIELDS.stats] || '').toLowerCase();
          return action === 'movimentação' || stats === 'recolhido';
        });
      }
      
      // Aplicar filtros adicionais no cliente
      if (filters.condutor) {
        recolhas = recolhas.filter(r => {
          const user = (r[RESERVAS_FIELDS.user] || '').toLowerCase();
          return user.includes(filters.condutor.toLowerCase());
        });
      }
      
      if (filters.matricula) {
        recolhas = recolhas.filter(r => 
          (r[RESERVAS_FIELDS.licensePlate] || '').toLowerCase().includes(filters.matricula.toLowerCase())
        );
      }
      
      if (filters.estado) {
        recolhas = recolhas.filter(r => 
          (r[RESERVAS_FIELDS.stats] || '').toLowerCase() === filters.estado.toLowerCase()
        );
      }
      
      if (filters.dataInicio) {
        recolhas = recolhas.filter(r => {
          const dataRecolha = FirebaseUtils.parseFirebaseDate(r[RESERVAS_FIELDS.checkinDate]);
          return dataRecolha && dataRecolha >= filters.dataInicio;
        });
      }
      
      if (filters.dataFim) {
        recolhas = recolhas.filter(r => {
          const dataRecolha = FirebaseUtils.parseFirebaseDate(r[RESERVAS_FIELDS.checkinDate]);
          return dataRecolha && dataRecolha <= filters.dataFim;
        });
      }
      
      // Ordenar por data de histórico
      recolhas.sort((a, b) => {
        const dataA = new Date(a[RESERVAS_FIELDS.historyDate] || a[RESERVAS_FIELDS.checkinDate] || 0);
        const dataB = new Date(b[RESERVAS_FIELDS.historyDate] || b[RESERVAS_FIELDS.checkinDate] || 0);
        return dataB - dataA;
      });
      
      console.log(`✅ Retornando ${recolhas.length} recolhas`);
      return recolhas;
    } catch (error) {
      console.error('❌ Erro ao obter recolhas:', error);
      throw error;
    }
  }

  // Obter entregas (simplificado)
  static async getEntregas(filters = {}) {
    try {
      const filterArray = [];
      
      if (filters.parque) {
        filterArray.push({ field: 'parque', operator: '==', value: filters.parque });
      }
      
      let entregas = await FirebaseService.queryCollection('entregas', filterArray, null, 100);
      
      // Aplicar filtros no cliente
      if (filters.condutor) {
        entregas = entregas.filter(e => 
          e.condutor?.toLowerCase().includes(filters.condutor.toLowerCase())
        );
      }
      
      if (filters.cliente) {
        entregas = entregas.filter(e => 
          e.cliente?.toLowerCase().includes(filters.cliente.toLowerCase())
        );
      }
      
      if (filters.estado) {
        entregas = entregas.filter(e => e.estado === filters.estado);
      }
      
      // Ordenar por data
      entregas.sort((a, b) => {
        const dataA = a.data?.seconds ? new Date(a.data.seconds * 1000) : new Date(a.data);
        const dataB = b.data?.seconds ? new Date(b.data.seconds * 1000) : new Date(b.data);
        return dataB - dataA;
      });
      
      return entregas;
    } catch (error) {
      console.error('Erro ao obter entregas:', error);
      throw error;
    }
  }

  // Obter dados de produtividade dos condutores
  static async getProdutividadeCondutores(filters = {}) {
    const filterArray = [];
    
    if (filters.condutor) {
      filterArray.push({ field: 'condutor', operator: '==', value: filters.condutor });
    }
    
    return await FirebaseService.queryCollection('produtividade_condutores', filterArray, 'data');
  }

  // Obter comentários e reclamações
  static async getComentariosReclamacoes(filters = {}) {
    const filterArray = [];
    
    if (filters.tipo) {
      filterArray.push({ field: 'tipo', operator: '==', value: filters.tipo });
    }
    
    if (filters.estado) {
      filterArray.push({ field: 'estado', operator: '==', value: filters.estado });
    }
    
    return await FirebaseService.queryCollection('comentarios_reclamacoes', filterArray, 'data');
  }

  // Obter dados de marketing
  static async getDadosMarketing(filters = {}) {
    const filterArray = [];
    
    if (filters.fonte) {
      filterArray.push({ field: 'fonte', operator: '==', value: filters.fonte });
    }
    
    return await FirebaseService.queryCollection('marketing', filterArray, 'data');
  }

  // Obter relatórios
  static async getRelatorios(tipo = null) {
    const filterArray = [];
    
    if (tipo) {
      filterArray.push({ field: 'tipo', operator: '==', value: tipo });
    }
    
    return await FirebaseService.queryCollection('relatorios', filterArray, 'data');
  }

  // Obter utilizadores e acessos
  static async getUtilizadores() {
    return await FirebaseService.getCollection('utilizadores');
  }

  // Obter logs de alterações (apenas para super users)
  static async getLogsAlteracoes(filters = {}) {
    const filterArray = [];
    
    if (filters.utilizador) {
      filterArray.push({ field: 'utilizador', operator: '==', value: filters.utilizador });
    }
    
    if (filters.aplicacao) {
      filterArray.push({ field: 'aplicacao', operator: '==', value: filters.aplicacao });
    }
    
    return await FirebaseService.queryCollection('logs_alteracoes', filterArray, 'timestamp');
  }
}

export default FirebaseService;
