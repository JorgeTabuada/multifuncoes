// Configuração do Firebase para o projeto admin-multipark
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuração do Firebase com os dados fornecidos
const firebaseConfig = {
  apiKey: "AIzaSyB6KyYEmpfCs-riq9Iz2Es2tkESXs41kpI",
  authDomain: "admin-multipark.firebaseapp.com",
  projectId: "admin-multipark",
  storageBucket: "admin-multipark.appspot.com",
  messagingSenderId: "944909921923",
  appId: "1:944909921923:web:4cdda21c1333239f6fc617af8fcb2db94f939a6b"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

// Inicializar Authentication
export const auth = getAuth(app);

export default app;
