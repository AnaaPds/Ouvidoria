import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderSimples from '../../Components/HeaderSimples';
import Footer from '../../Components/Footer';
import CrudService from '../../services/CrudService';
import './Funcionario.css';

function Funcionario() {
  const navigate = useNavigate();
  const [manifestacoes, setManifestacoes] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [modoVisualizacao, setModoVisualizacao] = useState(null);
  const [itemVisualizando, setItemVisualizando] = useState(null);
  const [modoResposta, setModoResposta] = useState(false);
  const [resposta, setResposta] = useState('');

  // Verificar se o usuário está logado como funcionário
  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    if (!usuarioLogado || usuarioLogado.tipo !== 'Funcionário') {
      alert('Você precisa estar logado como funcionário para acessar esta página.');
      navigate('/');
      return;
    }
    
    carregarManifestacoes();
  }, [navigate]);

  // Função para carregar manifestações
  const carregarManifestacoes = () => {
    try {
      const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
      
      // Verificar se o usuário é funcionário
      if (!usuarioLogado || usuarioLogado.tipo !== 'Funcionário') {
        navigate('/');
        return;
      }
      
      // Funcionários não podem visualizar manifestações
      setManifestacoes([]);
    } catch (error) {
      console.error('Erro ao carregar manifestações:', error);
      alert('Ocorreu um erro ao carregar as manifestações.');
    }
  };

  // Aplicar filtro
  const aplicarFiltro = (tipo) => {
    setFiltroTipo(tipo);
    // Funcionários não podem visualizar manifestações, então mantemos a lista vazia
    setManifestacoes([]);
  };

  // Iniciar visualização de um item
  const iniciarVisualizacao = (item) => {
    setModoVisualizacao(true);
    setItemVisualizando({ ...item });
    setModoResposta(false);
  };

  // Fechar visualização
  const fecharVisualizacao = () => {
    setModoVisualizacao(false);
    setItemVisualizando(null);
    setModoResposta(false);
    setResposta('');
  };

  // Iniciar modo de resposta
  const iniciarResposta = () => {
    setModoResposta(true);
    setResposta(itemVisualizando.resposta || '');
  };

  // Cancelar resposta
  const cancelarResposta = () => {
    setModoResposta(false);
    setResposta(itemVisualizando.resposta || '');
  };

  // Salvar resposta
  const salvarResposta = () => {
    if (!itemVisualizando) return;

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const novoStatus = 'em_analise';
    
    try {
      const itemAtualizado = {
        ...itemVisualizando,
        resposta: resposta,
        status: novoStatus,
        respondidoPor: usuarioLogado.nome,
        dataResposta: new Date().toISOString()
      };
      
      CrudService.update(itemVisualizando.id, itemAtualizado);
      setItemVisualizando(itemAtualizado);
      setModoResposta(false);
      carregarManifestacoes();
      alert('Resposta registrada com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar resposta:', error);
      alert('Ocorreu um erro ao registrar a resposta.');
    }
  };

  // Marcar como resolvido
  const marcarComoResolvido = () => {
    if (!itemVisualizando) return;
    
    if (window.confirm('Tem certeza que deseja marcar esta manifestação como resolvida?')) {
      try {
        const itemAtualizado = {
          ...itemVisualizando,
          status: 'resolvido',
          dataResolucao: new Date().toISOString()
        };
        
        CrudService.update(itemVisualizando.id, itemAtualizado);
        setItemVisualizando(itemAtualizado);
        carregarManifestacoes();
        alert('Manifestação marcada como resolvida!');
      } catch (error) {
        console.error('Erro ao atualizar status:', error);
        alert('Ocorreu um erro ao atualizar o status.');
      }
    }
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
    <div className="funcionario-container">
      <HeaderSimples />
      
      <div className="funcionario-content">
        <div className="funcionario-header">
          <div>
            <h2>Painel do Funcionário</h2>
            <p>Gerencie e responda às manifestações da ouvidoria</p>
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

            {itemVisualizando.resposta && (
              <div className="campo-visualizacao">
                <label>Resposta:</label>
                <p className="resposta-texto">{itemVisualizando.resposta}</p>
                <div className="info-resposta">
                  <span>Respondido por: {itemVisualizando.respondidoPor || 'Não informado'}</span>
                  {itemVisualizando.dataResposta && (
                    <span>Data: {formatarData(itemVisualizando.dataResposta)}</span>
                  )}
                </div>
              </div>
            )}

            {modoResposta ? (
              <div className="campo-resposta">
                <label>Sua Resposta:</label>
                <textarea 
                  value={resposta} 
                  onChange={(e) => setResposta(e.target.value)}
                  rows="4"
                  placeholder="Digite sua resposta para esta manifestação..."
                ></textarea>
                <div className="acoes-resposta">
                  <button className="btn-salvar" onClick={salvarResposta}>Salvar Resposta</button>
                  <button className="btn-cancelar" onClick={cancelarResposta}>Cancelar</button>
                </div>
              </div>
            ) : (
              <div className="acoes-visualizacao">
                {itemVisualizando.status !== 'resolvido' && itemVisualizando.status !== 'arquivado' && (
                  <>
                    <button className="btn-responder" onClick={iniciarResposta}>
                      {itemVisualizando.resposta ? 'Editar Resposta' : 'Responder'}
                    </button>
                    <button className="btn-resolver" onClick={marcarComoResolvido}>Marcar como Resolvido</button>
                  </>
                )}
                <button className="btn-voltar" onClick={fecharVisualizacao}>Voltar</button>
              </div>
            )}
          </div>
        ) : (
          <div className="lista-manifestacoes">
            <h3>Manifestações para Análise</h3>
            
            <p className="sem-registros">Funcionários não têm acesso às manifestações. Apenas administradores podem visualizar e gerenciar manifestações.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Funcionario;