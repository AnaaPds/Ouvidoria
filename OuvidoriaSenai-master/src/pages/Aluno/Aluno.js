import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderSimples from '../../Components/HeaderSimples';
import Footer from '../../Components/Footer';
import CrudService from '../../services/CrudService';
import './Aluno.css';

function Aluno() {
  const navigate = useNavigate();
  const [manifestacoes, setManifestacoes] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [modoVisualizacao, setModoVisualizacao] = useState(null);
  const [itemVisualizando, setItemVisualizando] = useState(null);

  // Verificar se o usuário está logado como aluno
  useEffect(() => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    if (!usuarioLogado || usuarioLogado.tipo !== 'Aluno') {
      alert('Você precisa estar logado como aluno para acessar esta página.');
      navigate('/');
      return;
    }
    
    carregarManifestacoes();
  }, [navigate]);

  // Função para carregar manifestações do aluno logado
  const carregarManifestacoes = () => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) return;
    
    // Obter manifestações visíveis para o aluno
    let dados = CrudService.getByEmail(usuarioLogado.email);
    
    // Filtrar apenas manifestações visíveis para o aluno
    dados = dados.filter(item => 
      item.visibilidade === 'todos' || 
      item.status === 'resolvido'
    );
    
    if (filtroTipo) {
      dados = dados.filter(item => item.tipo === filtroTipo);
    }
    
    setManifestacoes(dados);
  };

  // Aplicar filtro
  const aplicarFiltro = (tipo) => {
    setFiltroTipo(tipo);
    carregarManifestacoes();
  };

  // Iniciar visualização de um item
  const iniciarVisualizacao = (item) => {
    setModoVisualizacao(true);
    setItemVisualizando({ ...item });
  };

  // Fechar visualização
  const fecharVisualizacao = () => {
    setModoVisualizacao(false);
    setItemVisualizando(null);
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

  // Traduzir status
  const traduzirStatus = (status) => {
    const statusMap = {
      'pendente': 'Pendente',
      'em_analise': 'Em Análise',
      'resolvido': 'Resolvido',
      'arquivado': 'Arquivado'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="aluno-container">
      <HeaderSimples />
      
      <div className="aluno-content">
        <div className="aluno-header">
          <div>
            <h2>Painel do Aluno</h2>
            <p>Acompanhe suas manifestações na ouvidoria</p>
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

        {modoVisualizacao && itemVisualizando ? (
          <div className="detalhes-manifestacao">
            <h3>Detalhes da Manifestação</h3>
            
            <div className="campo-visualizacao">
              <label>Tipo:</label>
              <span>{traduzirTipo(itemVisualizando.tipo)}</span>
            </div>
            
            <div className="campo-visualizacao">
              <label>Nome:</label>
              <span>{itemVisualizando.nome || 'Anônimo'}</span>
            </div>
            
            <div className="campo-visualizacao">
              <label>Contato:</label>
              <span>{itemVisualizando.contato || '-'}</span>
            </div>
            
            <div className="campo-visualizacao">
              <label>Local:</label>
              <span>{itemVisualizando.local || '-'}</span>
            </div>
            
            <div className="campo-visualizacao">
              <label>Data/Hora:</label>
              <span>{itemVisualizando.dataHora || '-'}</span>
            </div>
            
            <div className="campo-visualizacao">
              <label>Descrição:</label>
              <p className="descricao-texto">{itemVisualizando.descricao || '-'}</p>
            </div>
            
            <div className="campo-visualizacao">
              <label>Status:</label>
              <span className={`status-${itemVisualizando.status}`}>
                {traduzirStatus(itemVisualizando.status)}
              </span>
            </div>

            <div className="campo-visualizacao">
              <label>Data de Criação:</label>
              <span>{formatarData(itemVisualizando.dataCriacao)}</span>
            </div>

            {itemVisualizando.dataAtualizacao && (
              <div className="campo-visualizacao">
                <label>Última Atualização:</label>
                <span>{formatarData(itemVisualizando.dataAtualizacao)}</span>
              </div>
            )}
            
            <div className="acoes-visualizacao">
              <button className="btn-voltar" onClick={fecharVisualizacao}>Voltar</button>
            </div>
          </div>
        ) : (
          <div className="lista-manifestacoes">
            <h3>Minhas Manifestações</h3>
            
            {manifestacoes.length === 0 ? (
              <p className="sem-registros">Você ainda não possui manifestações registradas.</p>
            ) : (
              <table className="tabela-manifestacoes">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Data Criação</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {manifestacoes.map(item => (
                    <tr key={item.id}>
                      <td>{traduzirTipo(item.tipo)}</td>
                      <td>{formatarData(item.dataCriacao)}</td>
                      <td>
                        <span className={`status-${item.status}`}>
                          {traduzirStatus(item.status)}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-visualizar" 
                          onClick={() => iniciarVisualizacao(item)}
                        >
                          Visualizar
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

export default Aluno;