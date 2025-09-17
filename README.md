# Multifunções - Portal Multipark

Portal interno da Multipark com múltiplas funcionalidades organizacionais desenvolvido em React.

## Descrição

Esta aplicação é um portal interno que centraliza várias sub-aplicações organizadas por categorias:

- **Operacional**: Recolhas, Entregas, Caixa Multipark, Cancelamentos, Reservas, Confirmação de Caixa
- **Gestão**: Despesas, Faturação, Recursos Humanos, Projetos, Tarefas, Hub Multipark
- **Análises**: Marketing, Relatórios, Produtividade Condutores, Comportamentos, Mapa de Ocupação, BI Interno
- **Administração e Suporte**: Formação & Apoio, Perdidos & Achados, Comentários & Reclamações, Auditorias Internas, Acessos e Alterações

## Estrutura do Projeto

```
/multifuncoes
|-- public/
|   |-- index.html
|-- src/
|   |-- assets/
|   |   |-- icons/              # Componentes de ícones SVG
|   |-- components/
|   |   |-- common/             # Componentes reutilizáveis (modais, botões, etc.)
|   |   |-- layout/             # Componentes de layout (ex: GlobalStyles)
|   |   |-- subapps/            # Componentes específicos de cada sub-aplicação
|   |-- data/                   # Ficheiros com dados mock
|   |-- pages/                  # Componentes que representam páginas inteiras
|   |-- App.js                  # Componente principal da aplicação
|   |-- index.js                # Ponto de entrada da aplicação React
|-- .gitignore
|-- package.json
|-- README.md
```

## Instalação e Execução

1. Instalar as dependências:
```bash
npm install
```

2. Executar a aplicação em modo de desenvolvimento:
```bash
npm start
```

3. Abrir [http://localhost:3000](http://localhost:3000) no browser.

## Funcionalidades

- Sistema de autenticação simples
- Dashboard principal com navegação por categorias
- Seleção de parque (Lisboa, Porto, Faro)
- Interface responsiva
- Modais para registo e mensagens

## Tecnologias Utilizadas

- React 18
- CSS personalizado
- Tailwind CSS (via CDN)
- Ícones SVG personalizados

## Desenvolvimento

Para adicionar novas sub-aplicações:

1. Criar o componente na pasta `src/components/subapps/`
2. Adicionar a entrada correspondente em `src/data/subAppsData.js`
3. Atualizar o routing no componente `App.js`

## Autor

**Manus AI** - Organização e estruturação do código React fornecido.
