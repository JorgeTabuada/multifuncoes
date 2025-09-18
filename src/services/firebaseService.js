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
  
  // Obter reservas
  static async getReservas(filters = {}) {
    const filterArray = [];
    
    if (filters.parque) {
      filterArray.push({ field: 'parque', operator: '==', value: filters.parque });
    }
    
    if (filters.dataInicio && filters.dataFim) {
      filterArray.push({ field: 'data', operator: '>=', value: filters.dataInicio });
      filterArray.push({ field: 'data', operator: '<=', value: filters.dataFim });
    }
    
    return await FirebaseService.queryCollection('reservas', filterArray, 'data');
  }

  // Obter recolhas
  static async getRecolhas(filters = {}) {
    const filterArray = [];
    
    if (filters.parque) {
      filterArray.push({ field: 'parque', operator: '==', value: filters.parque });
    }
    
    return await FirebaseService.queryCollection('recolhas', filterArray, 'data');
  }

  // Obter entregas
  static async getEntregas(filters = {}) {
    const filterArray = [];
    
    if (filters.parque) {
      filterArray.push({ field: 'parque', operator: '==', value: filters.parque });
    }
    
    return await FirebaseService.queryCollection('entregas', filterArray, 'data');
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
