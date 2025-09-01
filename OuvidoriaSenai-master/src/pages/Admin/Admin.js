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
  const [itemVisualizando, setItemVisualizando] = useState(null);

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado || usuarioLogado.tipo !== 'Administrador') {
      alert('Você precisa estar logado como administrador para acessar esta página.');
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    carregarManifestacoes();
  }, [filtroTipo]);

  const carregarManifestacoes = () => {
    try {
      const dados = filtroTipo
        ? CrudService.getByTipo(filtroTipo)
        : CrudService.getAll();
      setManifestacoes(dados);
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar manifestações.');
    }
  };

  const iniciarEdicao = item => {
    setModoEdicao(true);
    setItemEditando({ ...item });
    setItemVisualizando(null);
  };

  const cancelarEdicao = () => {
    setModoEdicao(false);
    setItemEditando(null);
  };

  const salvarEdicao = () => {
    if (!itemEditando) return;
    CrudService.update(itemEditando.id, itemEditando);
    if (itemEditando.status === 'resolvido') {
      CrudService.changeVisibility(itemEditando.id, 'todos');
    }
    setModoEdicao(false);
    setItemEditando(null);
    carregarManifestacoes();
    alert('Manifestação atualizada com sucesso!');
  };

  const excluirManifestacao = id => {
    if (!window.confirm('Tem certeza?')) return;
    CrudService.remove(id);
    carregarManifestacoes();
    alert('Excluído com sucesso!');
  };

  const handleChangeEdicao = e => {
    const { name, value } = e.target;
    setItemEditando(prev => ({ ...prev, [name]: value }));
  };

  const formatarData = dataIso => {
    if (!dataIso) return '';
    const data = new Date(dataIso);
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR');
  };

  const traduzirTipo = tipo => {
    const tipos = {
      [CrudService.TIPOS_MANIFESTACAO.RECLAMACAO]: 'Reclamação',
      [CrudService.TIPOS_MANIFESTACAO.DENUNCIA]: 'Denúncia',
      [CrudService.TIPOS_MANIFESTACAO.ELOGIO]: 'Elogio',
      [CrudService.TIPOS_MANIFESTACAO.SUGESTAO]: 'Sugestão'
    };
    return tipos[tipo] || tipo;
  };

  const botoesFiltro = [
    { label: 'Todos', value: '' },
    { label: 'Denúncia', value: CrudService.TIPOS_MANIFESTACAO.DENUNCIA },
    { label: 'Sugestão', value: CrudService.TIPOS_MANIFESTACAO.SUGESTAO },
    { label: 'Elogio', value: CrudService.TIPOS_MANIFESTACAO.ELOGIO },
    { label: 'Reclamação', value: CrudService.TIPOS_MANIFESTACAO.RECLAMACAO }
  ];

  const urlBaseUploads = 'http://localhost:3000/uploads/'; // *** Ajuste aqui para o caminho correto das imagens ***

  return React.createElement(
    'div',
    { className: 'admin-container' },
    React.createElement(HeaderSimples, null),

    React.createElement(
      'div',
      { className: 'admin-content' },
      React.createElement(
        'div',
        { className: 'admin-header' },
        React.createElement(
          'div',
          null,
          React.createElement('h2', null, 'Painel Administrativo'),
          React.createElement('p', null, 'Gerencie as manifestações da ouvidoria')
        ),
        React.createElement(
          'button',
          {
            className: 'btn-logout',
            onClick: () => {
              localStorage.removeItem('usuarioLogado');
              navigate('/');
            }
          },
          'Sair'
        )
      ),

      React.createElement(
        'div',
        { className: 'filtros' },
        React.createElement('h3', null, 'Filtrar por tipo:'),
        React.createElement(
          'div',
          { className: 'botoes-filtro' },
          botoesFiltro.map(filtro =>
            React.createElement(
              'button',
              {
                key: filtro.value || 'todos',
                className: filtroTipo === filtro.value ? 'ativo' : '',
                onClick: () => setFiltroTipo(filtro.value)
              },
              filtro.label
            )
          )
        )
      ),

      itemVisualizando
        ? React.createElement(
            'div',
            { className: 'modal-visualizar' },
            React.createElement('h3', null, 'Visualizar Manifestação'),
            React.createElement('p', null, React.createElement('strong', null, 'Tipo: '), traduzirTipo(itemVisualizando.tipo)),
            React.createElement('p', null, React.createElement('strong', null, 'Nome: '), itemVisualizando.nome || 'Anônimo'),
            React.createElement('p', null, React.createElement('strong', null, 'Contato: '), itemVisualizando.contato),
            React.createElement('p', null, React.createElement('strong', null, 'Data Criação: '), formatarData(itemVisualizando.dataCriacao)),
            React.createElement('p', null, React.createElement('strong', null, 'Status: '), itemVisualizando.status),
            React.createElement('p', null, React.createElement('strong', null, 'Descrição: '), itemVisualizando.descricao || 'Sem descrição'),

            // Imagem com caminho correto concatenado
            itemVisualizando.anexo
              ? React.createElement('img', {
                  src: urlBaseUploads + itemVisualizando.anexo,
                  alt: 'Anexo',
                  style: { maxWidth: '100%', maxHeight: '300px', display: 'block', marginTop: '10px' }
                })
              : React.createElement('p', null, 'Sem anexo'),

            React.createElement(
              'button',
              { onClick: () => setItemVisualizando(null), className: 'btn-fechar' },
              'Fechar'
            )
          )
        : null,

      modoEdicao && itemEditando
        ? React.createElement(
            'div',
            { className: 'formulario-edicao' },
            React.createElement('h3', null, 'Editar Manifestação'),
            React.createElement(
              'div',
              { className: 'campo-edicao' },
              React.createElement('label', null, 'Tipo:'),
              React.createElement('span', null, traduzirTipo(itemEditando.tipo))
            ),
            React.createElement(
              'div',
              { className: 'campo-edicao' },
              React.createElement('label', null, 'Status:'),
              React.createElement(
                'select',
                {
                  name: 'status',
                  value: itemEditando.status,
                  onChange: handleChangeEdicao
                },
                React.createElement('option', { value: 'pendente' }, 'Pendente'),
                React.createElement('option', { value: 'em_analise' }, 'Em Análise'),
                React.createElement('option', { value: 'resolvido' }, 'Resolvido'),
                React.createElement('option', { value: 'arquivado' }, 'Arquivado')
              )
            ),
            React.createElement(
              'div',
              { className: 'campo-edicao' },
              React.createElement('label', null, 'Descrição:'),
              React.createElement('textarea', {
                name: 'descricao',
                value: itemEditando.descricao || '',
                onChange: handleChangeEdicao
              })
            ),
            React.createElement(
              'div',
              { className: 'acoes-edicao' },
              React.createElement(
                'button',
                { className: 'btn-salvar', onClick: salvarEdicao },
                'Salvar'
              ),
              React.createElement(
                'button',
                { className: 'btn-cancelar', onClick: cancelarEdicao },
                'Cancelar'
              )
            )
          )
        : React.createElement(
            'div',
            { className: 'lista-manifestacoes' },
            React.createElement('h3', null, 'Manifestações Registradas'),
            manifestacoes.length === 0
              ? React.createElement('p', { className: 'sem-registros' }, 'Nenhuma manifestação encontrada.')
              : React.createElement(
                  'table',
                  { className: 'tabela-manifestacoes' },
                  React.createElement(
                    'thead',
                    null,
                    React.createElement(
                      'tr',
                      null,
                      ['Tipo', 'Nome', 'Contato', 'Data Criação', 'Status', 'Ações'].map(header =>
                        React.createElement('th', { key: header }, header)
                      )
                    )
                  ),
                  React.createElement(
                    'tbody',
                    null,
                    manifestacoes.map(item =>
                      React.createElement(
                        'tr',
                        { key: item.id },
                        React.createElement('td', null, traduzirTipo(item.tipo)),
                        React.createElement('td', null, item.nome || 'Anônimo'),
                        React.createElement('td', null, item.contato),
                        React.createElement('td', null, formatarData(item.dataCriacao)),
                        React.createElement(
                          'td',
                          null,
                          React.createElement(
                            'span',
                            { className: `status-${item.status}` },
                            item.status === 'pendente'
                              ? 'Pendente'
                              : item.status === 'em_analise'
                              ? 'Em Análise'
                              : item.status === 'resolvido'
                              ? 'Resolvido'
                              : 'Arquivado'
                          )
                        ),
                        React.createElement(
                          'td',
                          null,
                          React.createElement(
                            'button',
                            {
                              className: 'btn-visualizar',
                              onClick: () => {
                                setItemVisualizando(item);
                                setModoEdicao(false);
                              }
                            },
                            'Visualizar'
                          ),
                          React.createElement(
                            'button',
                            {
                              className: 'btn-editar',
                              onClick: () => iniciarEdicao(item)
                            },
                            'Editar'
                          ),
                          React.createElement(
                            'button',
                            {
                              className: 'btn-excluir',
                              onClick: () => excluirManifestacao(item.id)
                            },
                            'Excluir'
                          )
                        )
                      )
                    )
                  )
                )
          )
    ),
    React.createElement(Footer, null)
  );
}

export default Admin;
