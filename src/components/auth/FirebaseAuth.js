import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

// Hook para autenticação Firebase
export const useFirebaseAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Obter dados adicionais do utilizador do Firestore
          const userDoc = await getDoc(doc(db, 'utilizadores', firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            fullName: userData.nome || firebaseUser.displayName || firebaseUser.email.split('@')[0],
            nivelAcesso: userData.nivel_acesso || 'User',
            ativo: userData.ativo !== false,
            ...userData
          });
        } catch (err) {
          console.error('Erro ao obter dados do utilizador:', err);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            fullName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            nivelAcesso: 'User',
            ativo: true
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Verificar se o utilizador está ativo
      const userDoc = await getDoc(doc(db, 'utilizadores', userCredential.user.uid));
      if (userDoc.exists() && userDoc.data().ativo === false) {
        await signOut(auth);
        throw new Error('Conta desativada. Contacte o administrador.');
      }
      
      return userCredential.user;
    } catch (err) {
      console.error('Erro no login:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Erro no logout:', err);
      setError(err.message);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout
  };
};

// Componente de Login integrado com Firebase
export const FirebaseLoginPage = ({ onLogin, onShowRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useFirebaseAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (!email || !password) {
      setLoginError('Email e palavra-passe são obrigatórios.');
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      
      // O onAuthStateChanged irá atualizar o utilizador automaticamente
      console.log('Login realizado com sucesso');
    } catch (error) {
      console.error('Erro no login:', error);
      
      // Traduzir erros do Firebase para português
      let errorMessage = 'Erro no login. Tente novamente.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Utilizador não encontrado.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Palavra-passe incorreta.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Conta desativada.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas. Tente mais tarde.';
          break;
        default:
          errorMessage = error.message;
      }
      
      setLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container flex justify-center items-center">
      <div className="login-box">
        <div className="app-logo-styled">
          <span className="logo-p-icon">P</span>
          <span className="logo-text-multipark">MULTIPARK</span>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="o.seu@email.com"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Palavra-passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="********"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
        
        {loginError && (
          <p className="text-red-500 text-sm mt-3 text-center">{loginError}</p>
        )}
        
        <div className="mt-6 text-center">
          <button
            onClick={onShowRegister}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            disabled={isLoading}
          >
            Não tem conta? Registe-se aqui.
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente de proteção de rotas
export const ProtectedRoute = ({ children, requiredLevel = 'User' }) => {
  const { user, loading } = useFirebaseAuth();

  if (loading) {
    return (
      <div className="app-container flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <FirebaseLoginPage />;
  }

  // Verificar nível de acesso
  const accessLevels = { 'User': 1, 'Admin': 2, 'Super User': 3 };
  const userLevel = accessLevels[user.nivelAcesso] || 1;
  const requiredLevelNum = accessLevels[requiredLevel] || 1;

  if (userLevel < requiredLevelNum) {
    return (
      <div className="app-container flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Acesso Negado</h2>
          <p>Não tem permissões para aceder a esta área.</p>
        </div>
      </div>
    );
  }

  return children;
};
