import React, { useState } from 'react';
import { useRecolhas, useFirebaseCRUD } from '../../hooks/useFirebase';
import { Filter, CalendarDays, Users, DollarSign, FileText, UploadCloud } from '../../assets/icons';

const RecolhasFirebaseSubAppPage = ({ appName, onNavigateToDashboard }) => {
  // Estados para filtros
  const [selectedPark, setSelectedPark] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [condutor, setCondutor] = useState('');
  const [matricula, setMatricula] = useState('');
  const [estado, setEstado] = useState('');

  // Estados para novo registo
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecolha, setNewRecolha] = useState({
    condutor: '',
    matricula: '',
    cliente: '',
    detalhes: '',
    valor: '',
    estado: 'Pendente'
  });

  // Construir filtros para o Firebase
  const [filters, setFilters] = useState({});

  // Hooks Firebase
  const { data: recolhas, loading, error, refetch } = useRecolhas(filters);
  const { addDocument, loading: addLoading } = useFirebaseCRUD('recolhas');

  // Aplicar filtros
  const handleApplyFilters = () => {
    const newFilters = {};
    
    if (selectedPark) newFilters.parque = selectedPark;
    if (startDate) newFilters.dataInicio = new Date(startDate);
    if (endDate) newFilters.dataFim = new Date(endDate);
    if (condutor) newFilters.condutor = condutor;
    if (matricula) newFilters.matricula = matricula;
    if (estado) newFilters.estado = estado;
    
    setFilters(newFilters);
  };

  // Limpar filtros
  const handleClearFilters = () => {
    setSelectedPark('');
    setStartDate('');
    setEndDate('');
    setCondutor('');
    setMatricula('');
    setEstado('');
    setFilters({});
  };

  // Adicionar nova recolha
  const handleAddRecolha = async (e) => {
    e.preventDefault();
    
    try {
      await addDocument({
        ...newRecolha,
        data: new Date(),
        parque: selectedPark || 'lisboa',
        valor: parseFloat(newRecolha.valor) || 0
      });
      
      // Limpar formulário
      setNewRecolha({
        condutor: '',
        matricula: '',
        cliente: '',
        detalhes: '',
        valor: '',
        estado: 'Pendente'
      });
      setShowAddForm(false);
      
      // Atualizar dados
      refetch();
      
      alert('Recolha adicionada com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar recolha:', error);
      alert('Erro ao adicionar recolha. Tente novamente.');
    }
  };

  // Estatísticas das recolhas
  const stats = {
    total: recolhas.length,
    pendentes: recolhas.filter(r => r.estado === 'Pendente').length,
    concluidas: recolhas.filter(r => r.estado === 'Concluída').length,
    canceladas: recolhas.filter(r => r.estado === 'Cancelada').length,
    valorTotal: recolhas.reduce((sum, r) => sum + (r.valor || 0), 0)
  };

  return (
    <div className="subapp-page w-full max-w-6xl mx-auto p-4">
      <div className="subapp-header">
        <h1 className="subapp-title">{appName}</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowAddForm(!showAddForm)} 
            className="action-button"
          >
            {showAddForm ? 'Cancelar' : 'Nova Recolha'}
          </button>
          <button onClick={onNavigateToDashboard} className="action-button secondary">
            Voltar
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <section className="subapp-section">
        <h2 className="subapp-section-title">Resumo das Recolhas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <CalendarDays className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <Users className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{stats.pendentes}</div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <CalendarDays className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{stats.concluidas}</div>
            <div className="text-sm text-gray-600">Concluídas</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <DollarSign className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">€{stats.valorTotal.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Valor Total</div>
          </div>
        </div>
      </section>

      {/* Formulário para nova recolha */}
      {showAddForm && (
        <section className="subapp-section">
          <h2 className="subapp-section-title">Registar Nova Recolha</h2>
          <form onSubmit={handleAddRecolha} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condutor
                </label>
                <input
                  type="text"
                  value={newRecolha.condutor}
                  onChange={(e) => setNewRecolha({...newRecolha, condutor: e.target.value})}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Nome do condutor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Matrícula
                </label>
                <input
                  type="text"
                  value={newRecolha.matricula}
                  onChange={(e) => setNewRecolha({...newRecolha, matricula: e.target.value})}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="XX-XX-XX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente
                </label>
                <input
                  type="text"
                  value={newRecolha.cliente}
                  onChange={(e) => setNewRecolha({...newRecolha, cliente: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Nome do cliente"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newRecolha.valor}
                  onChange={(e) => setNewRecolha({...newRecolha, valor: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="0.00"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detalhes
                </label>
                <textarea
                  value={newRecolha.detalhes}
                  onChange={(e) => setNewRecolha({...newRecolha, detalhes: e.target.value})}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Detalhes da recolha..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="action-button secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={addLoading}
                className="action-button"
              >
                {addLoading ? 'Guardando...' : 'Guardar Recolha'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Importação de ficheiros */}
      <section className="subapp-section">
        <h2 className="subapp-section-title">Importar Dados</h2>
        <div className="flex items-center gap-4 mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Importar (Excel/JSON/Voz):
          </label>
          <input type="file" className="p-2 border rounded-md text-sm flex-grow" />
          <button className="action-button">
            <UploadCloud className="h-4 w-4 inline mr-1" />
            Importar
          </button>
        </div>
      </section>

      {/* Filtros de Pesquisa */}
      <section className="subapp-section">
        <h2 className="subapp-section-title">Filtros de Pesquisa</h2>
        <div className="filters-grid mb-6">
          <div>
            <label>Parque:</label>
            <select 
              value={selectedPark} 
              onChange={e => setSelectedPark(e.target.value)}
            >
              <option value="">Todos os Parques</option>
              <option value="lisboa">Lisboa</option>
              <option value="porto">Porto</option>
              <option value="faro">Faro</option>
            </select>
          </div>
          <div>
            <label>Data Início:</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)} 
            />
          </div>
          <div>
            <label>Data Fim:</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)} 
            />
          </div>
          <div>
            <label>Condutor:</label>
            <input 
              type="text" 
              placeholder="Nome do condutor" 
              value={condutor} 
              onChange={e => setCondutor(e.target.value)} 
            />
          </div>
          <div>
            <label>Matrícula:</label>
            <input 
              type="text" 
              placeholder="XX-XX-XX" 
              value={matricula} 
              onChange={e => setMatricula(e.target.value)} 
            />
          </div>
          <div>
            <label>Estado:</label>
            <select 
              value={estado} 
              onChange={e => setEstado(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Pendente">Pendente</option>
              <option value="Concluída">Concluída</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>
          <button 
            className="action-button self-end" 
            onClick={handleApplyFilters}
          >
            <Filter className="h-4 w-4 inline mr-1"/> Aplicar Filtros
          </button>
          <button 
            className="action-button secondary self-end" 
            onClick={handleClearFilters}
          >
            Limpar
          </button>
        </div>
      </section>

      {/* Resultados das Recolhas */}
      <section className="subapp-section">
        <h2 className="subapp-section-title">
          Resultados das Recolhas 
          {loading && <span className="text-sm text-gray-500 ml-2">(Carregando...)</span>}
          {error && <span className="text-sm text-red-500 ml-2">(Erro: {error})</span>}
        </h2>
        
        {loading ? (
          <div className="content-placeholder">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4">Carregando recolhas do Firebase...</p>
          </div>
        ) : error ? (
          <div className="content-placeholder">
            <div className="text-red-500 mb-4">
              <p>Erro ao carregar dados: {error}</p>
            </div>
            <button onClick={refetch} className="action-button">
              Tentar Novamente
            </button>
          </div>
        ) : recolhas.length === 0 ? (
          <div className="content-placeholder">
            <p>Nenhuma recolha encontrada com os filtros aplicados.</p>
            <button onClick={handleClearFilters} className="action-button mt-4">
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Data</th>
                  <th>Condutor</th>
                  <th>Matrícula</th>
                  <th>Cliente</th>
                  <th>Detalhes</th>
                  <th>Valor</th>
                  <th>Estado</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {recolhas.map(recolha => (
                  <tr key={recolha.id}>
                    <td>{recolha.id}</td>
                    <td>
                      {recolha.data ? 
                        new Date(recolha.data.seconds * 1000).toLocaleString('pt-PT') : 
                        'N/A'
                      }
                    </td>
                    <td>{recolha.condutor || 'N/A'}</td>
                    <td>{recolha.matricula || 'N/A'}</td>
                    <td>{recolha.cliente || 'N/A'}</td>
                    <td>{recolha.detalhes || 'N/A'}</td>
                    <td>€{(recolha.valor || 0).toFixed(2)}</td>
                    <td>
                      <span className={`px-2 py-1 rounded text-xs ${
                        recolha.estado === 'Concluída' ? 'bg-green-100 text-green-800' :
                        recolha.estado === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                        recolha.estado === 'Cancelada' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {recolha.estado || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <button className="action-button mr-2 text-xs px-2 py-1">
                        Ver
                      </button>
                      <button className="action-button secondary text-xs px-2 py-1">
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default RecolhasFirebaseSubAppPage;
