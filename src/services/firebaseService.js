// Serviços Firebase para interação com os dados do admin-multipark
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../config/firebase';

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
export class MultiparkDataService {
  
  // Obter reservas (simplificado para evitar índices compostos)
  static async getReservas(filters = {}) {
    try {
      // Usar apenas um filtro por vez para evitar índices compostos
      const filterArray = [];
      
      // Priorizar filtro por parque se existir
      if (filters.parque) {
        filterArray.push({ field: 'parque', operator: '==', value: filters.parque });
      } else if (filters.estado) {
        filterArray.push({ field: 'estado', operator: '==', value: filters.estado });
      }
      
      // Obter dados do Firebase
      let reservas = await FirebaseService.queryCollection('reservas', filterArray, null, 100);
      
      // Aplicar filtros adicionais no cliente (JavaScript)
      if (filters.dataInicio) {
        reservas = reservas.filter(r => {
          const dataReserva = r.data?.seconds ? new Date(r.data.seconds * 1000) : new Date(r.data);
          return dataReserva >= filters.dataInicio;
        });
      }
      
      if (filters.dataFim) {
        reservas = reservas.filter(r => {
          const dataReserva = r.data?.seconds ? new Date(r.data.seconds * 1000) : new Date(r.data);
          return dataReserva <= filters.dataFim;
        });
      }
      
      if (filters.cliente) {
        reservas = reservas.filter(r => 
          r.cliente?.toLowerCase().includes(filters.cliente.toLowerCase())
        );
      }
      
      if (filters.matricula) {
        reservas = reservas.filter(r => 
          r.matricula?.toLowerCase().includes(filters.matricula.toLowerCase())
        );
      }
      
      if (filters.estado && filters.parque) {
        reservas = reservas.filter(r => r.estado === filters.estado);
      }
      
      // Ordenar por data (mais recente primeiro)
      reservas.sort((a, b) => {
        const dataA = a.data?.seconds ? new Date(a.data.seconds * 1000) : new Date(a.data);
        const dataB = b.data?.seconds ? new Date(b.data.seconds * 1000) : new Date(b.data);
        return dataB - dataA;
      });
      
      return reservas;
    } catch (error) {
      console.error('Erro ao obter reservas:', error);
      throw error;
    }
  }

  // Obter recolhas (simplificado)
  static async getRecolhas(filters = {}) {
    try {
      const filterArray = [];
      
      if (filters.parque) {
        filterArray.push({ field: 'parque', operator: '==', value: filters.parque });
      }
      
      let recolhas = await FirebaseService.queryCollection('recolhas', filterArray, null, 100);
      
      // Aplicar filtros no cliente
      if (filters.condutor) {
        recolhas = recolhas.filter(r => 
          r.condutor?.toLowerCase().includes(filters.condutor.toLowerCase())
        );
      }
      
      if (filters.matricula) {
        recolhas = recolhas.filter(r => 
          r.matricula?.toLowerCase().includes(filters.matricula.toLowerCase())
        );
      }
      
      if (filters.estado) {
        recolhas = recolhas.filter(r => r.estado === filters.estado);
      }
      
      // Ordenar por data
      recolhas.sort((a, b) => {
        const dataA = a.data?.seconds ? new Date(a.data.seconds * 1000) : new Date(a.data);
        const dataB = b.data?.seconds ? new Date(b.data.seconds * 1000) : new Date(b.data);
        return dataB - dataA;
      });
      
      return recolhas;
    } catch (error) {
      console.error('Erro ao obter recolhas:', error);
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
