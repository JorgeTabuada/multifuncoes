# Integração Firebase - Projeto Multifunções

## 📋 Configuração do Firebase

### Dados do Projeto
- **Nome do Projeto:** admin-multipark
- **ID do Projeto:** admin-multipark  
- **Número do Projeto:** 944909921923
- **Chave de API da Web:** AIzaSyB6KyYEmpfCs-riq9Iz2Es2tkESXs41kpI

### 🔧 Configuração Implementada

#### 1. Configuração Base (`src/config/firebase.js`)
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB6KyYEmpfCs-riq9Iz2Es2tkESXs41kpI",
  authDomain: "admin-multipark.firebaseapp.com",
  projectId: "admin-multipark",
  storageBucket: "admin-multipark.appspot.com",
  messagingSenderId: "944909921923",
  appId: "1:944909921923:web:4cdda21c1333239f6fc617af8fcb2db94f939a6b"
};
```

#### 2. Serviços Firebase (`src/services/firebaseService.js`)
- **FirebaseService:** Operações CRUD genéricas
- **MultiparkDataService:** Serviços específicos para entidades Multipark

#### 3. Hooks React (`src/hooks/useFirebase.js`)
- **useFirebaseCollection:** Hook genérico para coleções
- **useFirebaseDocument:** Hook para documentos específicos
- **useReservas, useRecolhas, useEntregas:** Hooks específicos
- **useFirebaseCRUD:** Hook para operações CRUD

## 📊 Estrutura de Dados Esperada no Firestore

### Coleções Principais

#### `reservas`
```javascript
{
  id: "string",
  cliente: "string",
  matricula: "string", 
  data: "timestamp",
  parque: "lisboa|porto|faro",
  projeto: "string",
  estado: "Pendente|Confirmada|Cancelada",
  valor: "number",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

#### `recolhas`
```javascript
{
  id: "string",
  condutor: "string",
  matricula: "string",
  data: "timestamp",
  parque: "string",
  detalhes: "string",
  estado: "string"
}
```

#### `entregas`
```javascript
{
  id: "string",
  condutor: "string", 
  matricula: "string",
  data: "timestamp",
  parque: "string",
  cliente: "string",
  estado: "string"
}
```

#### `produtividade_condutores`
```javascript
{
  id: "string",
  condutor: "string",
  data: "timestamp",
  folhas: "number",
  entregas: "number",
  recolhas: "number",
  movimentacoes: "number",
  tempo_parado: "number"
}
```

#### `comentarios_reclamacoes`
```javascript
{
  id: "string",
  cliente: "string",
  tipo: "Comentário|Reclamação",
  descricao: "string",
  estado: "Aberto|Em Análise|Resolvido|Fechado",
  data: "timestamp",
  prioridade: "Baixa|Média|Alta"
}
```

#### `marketing`
```javascript
{
  id: "string",
  fonte: "Google Analytics|Google Ads|Facebook Ads|Bing Ads",
  data: "timestamp",
  custo: "number",
  conversoes: "number",
  impressoes: "number"
}
```

#### `utilizadores`
```javascript
{
  id: "string",
  nome: "string",
  email: "string",
  documento_id: "string",
  nif: "string",
  telefone: "string",
  nivel_acesso: "User|Admin|Super User",
  ativo: "boolean"
}
```

#### `logs_alteracoes`
```javascript
{
  id: "string",
  utilizador: "string",
  aplicacao: "string",
  acao: "string",
  detalhes: "string",
  timestamp: "timestamp",
  matricula: "string"
}
```

## 🚀 Como Usar

### 1. Importar Hooks
```javascript
import { useReservas, useFirebaseCRUD } from '../hooks/useFirebase';
```

### 2. Usar nos Componentes
```javascript
const { data: reservas, loading, error } = useReservas({ parque: 'lisboa' });
const { addDocument, updateDocument } = useFirebaseCRUD('reservas');
```

### 3. Filtros Disponíveis
```javascript
// Filtros por data
const filters = {
  dataInicio: new Date('2024-01-01'),
  dataFim: new Date('2024-12-31')
};

// Filtros por parque
const filters = { parque: 'lisboa' };

// Filtros combinados
const filters = {
  parque: 'porto',
  estado: 'Confirmada',
  dataInicio: new Date('2024-01-01')
};
```

## 🔒 Segurança

### Regras de Firestore Recomendadas
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura para utilizadores autenticados
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.token.admin == true;
    }
    
    // Logs apenas para super users
    match /logs_alteracoes/{document} {
      allow read, write: if request.auth != null && 
        request.auth.token.super_user == true;
    }
  }
}
```

## 📈 Funcionalidades Implementadas

### ✅ Concluído
- [x] Configuração base do Firebase
- [x] Serviços CRUD genéricos
- [x] Hooks React personalizados
- [x] Componente de Reservas com Firebase
- [x] Filtros e pesquisa
- [x] Estados de loading e erro
- [x] Estatísticas em tempo real

### 🔄 Em Desenvolvimento
- [ ] Autenticação Firebase
- [ ] Componentes para todas as sub-aplicações
- [ ] Upload de ficheiros para Storage
- [ ] Notificações em tempo real
- [ ] Relatórios avançados

### 🎯 Próximos Passos
1. Configurar autenticação Firebase
2. Implementar regras de segurança
3. Adicionar componentes Firebase para todas as sub-aplicações
4. Configurar Firebase Storage para ficheiros
5. Implementar sistema de notificações

## 🛠️ Comandos Úteis

```bash
# Instalar dependências
npm install firebase firebase-admin

# Testar aplicação
npm start

# Build para produção
npm run build
```

## 📞 Suporte

Para questões sobre a integração Firebase:
1. Verificar logs do console do browser
2. Confirmar configuração do Firebase
3. Validar estrutura de dados no Firestore
4. Verificar regras de segurança

---

**Nota:** Esta integração foi configurada para **APENAS LER** dados do Firebase existente, sem alterar a estrutura ou dados do projeto admin-multipark.
