import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderSimples from '../../Components/HeaderSimples';
import Footer from '../../Components/Footer';
import CrudService from '../../services/CrudService';
import './Admin.css';

function Admin() {
  const navigate = useNavigate();
  const [manifestacoes, setManifestacoes] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [modoEdicao, setModoEdicao] = useState(null);
  const [itemEditando, setItemEditando] = useState(null);

  // Verificar se o usuário está logado como administrador
  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    if (!usuarioLogado || usuarioLogado.tipo !== 'Administrador') {
      alert('Você precisa estar logado como administrador para acessar esta página.');
      navigate('/');
      return;
    }
  }, [navigate]);

  // Carregar manifestações ao montar o componente
  useEffect(() => {
    carregarManifestacoes();
  }, []);

  // Função para carregar manifestações com filtro opcional
  const carregarManifestacoes = () => {
    try {
      const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
      let dados;
      
      // Usar a nova função que filtra por visibilidade
      if (usuarioLogado && usuarioLogado.tipo === 'Administrador') {
        if (filtroTipo) {
          dados = CrudService.getByTipo(filtroTipo);
        } else {
          dados = CrudService.getAll();
        }
        setManifestacoes(dados);
      } else {
        // Se não for administrador, redirecionar
        navigate('/');
      }
    } catch (error) {
      console.error('Erro ao carregar manifestações:', error);
      alert('Ocorreu um erro ao carregar as manifestações.');
    }
  };

  // Aplicar filtro
  const aplicarFiltro = (tipo) => {
    setFiltroTipo(tipo);
    if (tipo) {
      const dadosFiltrados = CrudService.getByTipo(tipo);
      setManifestacoes(dadosFiltrados);
    } else {
      carregarManifestacoes();
    }
  };

  // Iniciar edição de um item
  const iniciarEdicao = (item) => {
    setModoEdicao(true);
    setItemEditando({ ...item });
  };

  // Cancelar edição
  const cancelarEdicao = () => {
    setModoEdicao(false);
    setItemEditando(null);
  };

  // Salvar alterações
  const salvarEdicao = () => {
    if (!itemEditando) return;

    try {
      // Atualizar a manifestação
      CrudService.update(itemEditando.id, itemEditando);
      
      // Se o status foi alterado para 'resolvido', atualizar a visibilidade
      if (itemEditando.status === 'resolvido') {
        // Tornar visível para o aluno que criou a manifestação
        CrudService.changeVisibility(itemEditando.id, 'todos');
      }
      
      setModoEdicao(false);
      setItemEditando(null);
      carregarManifestacoes();
      alert('Manifestação atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar manifestação:', error);
      alert('Ocorreu um erro ao atualizar a manifestação.');
    }
  };

  // Excluir manifestação
  const excluirManifestacao = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta manifestação?')) {
      try {
        CrudService.remove(id);
        carregarManifestacoes();
        alert('Manifestação excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir manifestação:', error);
        alert('Ocorreu um erro ao excluir a manifestação.');
      }
    }
  };

  // Atualizar campo do item em edição
  const handleChangeEdicao = (e) => {
    const { name, value } = e.target;
    setItemEditando(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Formatar data para exibição
  const formatarData = (dataIso) => {
    if (!dataIso) return '';
    const data = new Date(dataIso);
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR');
  };

  // Traduzir tipo de manifestação
  const traduzirTipo = (tipo) => {
    const tipos = {
      [CrudService.TIPOS_MANIFESTACAO.RECLAMACAO]: 'Reclamação',
      [CrudService.TIPOS_MANIFESTACAO.DENUNCIA]: 'Denúncia',
      [CrudService.TIPOS_MANIFESTACAO.ELOGIO]: 'Elogio',
      [CrudService.TIPOS_MANIFESTACAO.SUGESTAO]: 'Sugestão'
    };
    return tipos[tipo] || tipo;
  };

  return (
    <div className="admin-container">
      <HeaderSimples />
      
      <div className="admin-content">
        <div className="admin-header">
          <div>
            <h2>Painel Administrativo</h2>
            <p>Gerencie as manifestações da ouvidoria</p>
          </div>
          <button 
            className="btn-logout" 
            onClick={() => {
              localStorage.removeItem('usuarioLogado');
              navigate('/');
            }}
          >
            Sair
          </button>
        </div>
        
        <div className="filtros">
          <h3>Filtrar por tipo:</h3>
          <div className="botoes-filtro">
            <button 
              className={filtroTipo === '' ? 'ativo' : ''} 
              onClick={() => aplicarFiltro('')}
            >
              Todos
            </button>
            <button 
              className={filtroTipo === CrudService.TIPOS_MANIFESTACAO.RECLAMACAO ? 'ativo' : ''} 
              onClick={() => aplicarFiltro(CrudService.TIPOS_MANIFESTACAO.RECLAMACAO)}
            >
              Reclamações
            </button>
            <button 
              className={filtroTipo === CrudService.TIPOS_MANIFESTACAO.DENUNCIA ? 'ativo' : ''} 
              onClick={() => aplicarFiltro(CrudService.TIPOS_MANIFESTACAO.DENUNCIA)}
            >
              Denúncias
            </button>
            <button 
              className={filtroTipo === CrudService.TIPOS_MANIFESTACAO.ELOGIO ? 'ativo' : ''} 
              onClick={() => aplicarFiltro(CrudService.TIPOS_MANIFESTACAO.ELOGIO)}
            >
              Elogios
            </button>
            <button 
              className={filtroTipo === CrudService.TIPOS_MANIFESTACAO.SUGESTAO ? 'ativo' : ''} 
              onClick={() => aplicarFiltro(CrudService.TIPOS_MANIFESTACAO.SUGESTAO)}
            >
              Sugestões
            </button>
          </div>
        </div>

        {modoEdicao && itemEditando ? (
          <div className="formulario-edicao">
            <h3>Editar Manifestação</h3>
            
            <div className="campo-edicao">
              <label>Tipo:</label>
              <span>{traduzirTipo(itemEditando.tipo)}</span>
            </div>
            
            <div className="campo-edicao">
              <label>Nome:</label>
              <input 
                type="text" 
                name="nome" 
                value={itemEditando.nome || ''} 
                onChange={handleChangeEdicao} 
              />
            </div>
            
            <div className="campo-edicao">
              <label>Contato:</label>
              <input 
                type="text" 
                name="contato" 
                value={itemEditando.contato || ''} 
                onChange={handleChangeEdicao} 
              />
            </div>
            
            <div className="campo-edicao">
              <label>Local:</label>
              <input 
                type="text" 
                name="local" 
                value={itemEditando.local || ''} 
                onChange={handleChangeEdicao} 
              />
            </div>
            
            <div className="campo-edicao">
              <label>Data/Hora:</label>
              <input 
                type="text" 
                name="dataHora" 
                value={itemEditando.dataHora || ''} 
                onChange={handleChangeEdicao} 
              />
            </div>
            
            <div className="campo-edicao">
              <label>Descrição:</label>
              <textarea 
                name="descricao" 
                value={itemEditando.descricao || ''} 
                onChange={handleChangeEdicao} 
                rows="4"
              ></textarea>
            </div>
            
            <div className="campo-edicao">
              <label>Status:</label>
              <select 
                name="status" 
                value={itemEditando.status || 'pendente'} 
                onChange={handleChangeEdicao}
              >
                <option value="pendente">Pendente</option>
                <option value="em_analise">Em Análise</option>
                <option value="resolvido">Resolvido</option>
                <option value="arquivado">Arquivado</option>
              </select>
              <p className="status-info">
                {itemEditando.status === 'resolvido' ? 
                  'Ao marcar como resolvido, a manifestação ficará visível para o aluno.' : 
                  'Apenas o administrador pode ver esta manifestação no momento.'}
              </p>
            </div>
            
            <div className="campo-edicao">
              <label>Visibilidade:</label>
              <select 
                name="visibilidade" 
                value={itemEditando.visibilidade || 'admin'} 
                onChange={handleChangeEdicao}
              >
                <option value="admin">Apenas Administrador</option>
                <option value="todos">Todos (Aluno e Administrador)</option>
              </select>
            </div>
            
            <div className="acoes-edicao">
              <button className="btn-salvar" onClick={salvarEdicao}>Salvar</button>
              <button className="btn-cancelar" onClick={cancelarEdicao}>Cancelar</button>
            </div>
          </div>
        ) : (
          <div className="lista-manifestacoes">
            <h3>Manifestações Registradas</h3>
            
            {manifestacoes.length === 0 ? (
              <p className="sem-registros">Nenhuma manifestação encontrada.</p>
            ) : (
              <table className="tabela-manifestacoes">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Nome</th>
                    <th>Contato</th>
                    <th>Data Criação</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {manifestacoes.map(item => (
                    <tr key={item.id}>
                      <td>{traduzirTipo(item.tipo)}</td>
                      <td>{item.nome || 'Anônimo'}</td>
                      <td>{item.contato}</td>
                      <td>{formatarData(item.dataCriacao)}</td>
                      <td>
                        <span className={`status-${item.status}`}>
                          {item.status === 'pendente' && 'Pendente'}
                          {item.status === 'em_analise' && 'Em Análise'}
                          {item.status === 'resolvido' && 'Resolvido'}
                          {item.status === 'arquivado' && 'Arquivado'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-visualizar" 
                          onClick={() => iniciarEdicao(item)}
                        >
                          Visualizar/Editar
                        </button>
                        <button 
                          className="btn-excluir" 
                          onClick={() => excluirManifestacao(item.id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Admin;