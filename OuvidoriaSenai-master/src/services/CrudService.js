// CrudService.js - Serviço para operações CRUD usando localStorage

// Tipos de manifestações suportadas
const TIPOS_MANIFESTACAO = {
  RECLAMACAO: 'reclamacao',
  DENUNCIA: 'denuncia',
  ELOGIO: 'elogio',
  SUGESTAO: 'sugestao'
};

// Chave para armazenar as manifestações no localStorage
const STORAGE_KEY = 'manifestacoes';

// Gera um ID único para cada manifestação
const gerarId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Obtém todas as manifestações do localStorage
const getAll = () => {
  const manifestacoes = localStorage.getItem(STORAGE_KEY);
  return manifestacoes ? JSON.parse(manifestacoes) : [];
};

// Obtém manifestações por email do usuário
const getByEmail = (email) => {
  const manifestacoes = getAll();
  return manifestacoes.filter(item => item.email === email);
};

// Obtém manifestações por tipo
const getByTipo = (tipo) => {
  const manifestacoes = getAll();
  return manifestacoes.filter(item => item.tipo === tipo);
};

// Obtém uma manifestação específica pelo ID
const getById = (id) => {
  const manifestacoes = getAll();
  return manifestacoes.find(item => item.id === id);
};

// Cria uma nova manifestação
const create = (manifestacao) => {
  const manifestacoes = getAll();
  
  // Adiciona ID, data de criação e status inicial
  const novaManifestacao = {
    ...manifestacao,
    id: gerarId(),
    dataCriacao: new Date().toISOString(),
    status: 'pendente',
    visibilidade: 'admin' // Define que apenas o administrador pode ver inicialmente
  };
  
  manifestacoes.push(novaManifestacao);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(manifestacoes));
  
  return novaManifestacao;
};

// Atualiza uma manifestação existente
const update = (id, dadosAtualizados) => {
  const manifestacoes = getAll();
  const index = manifestacoes.findIndex(item => item.id === id);
  
  if (index === -1) return null;
  
  const manifestacaoAtualizada = {
    ...manifestacoes[index],
    ...dadosAtualizados,
    dataAtualizacao: new Date().toISOString()
  };
  
  manifestacoes[index] = manifestacaoAtualizada;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(manifestacoes));
  
  return manifestacaoAtualizada;
};

// Remove uma manifestação
const remove = (id) => {
  const manifestacoes = getAll();
  const novaLista = manifestacoes.filter(item => item.id !== id);
  
  if (novaLista.length === manifestacoes.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));
  return true;
};

// Obtém manifestações visíveis para o usuário específico
const getVisibleForUser = (userType) => {
  const manifestacoes = getAll();
  
  // Administrador pode ver todas as manifestações
  if (userType === 'Administrador') {
    return manifestacoes;
  }
  
  // Outros usuários só podem ver manifestações marcadas como visíveis para eles
  return manifestacoes.filter(item => 
    item.visibilidade === 'todos' || 
    item.visibilidade === userType.toLowerCase()
  );
};

// Altera a visibilidade de uma manifestação
const changeVisibility = (id, visibilidade) => {
  const manifestacoes = getAll();
  const index = manifestacoes.findIndex(item => item.id === id);
  
  if (index === -1) return false;
  
  manifestacoes[index].visibilidade = visibilidade;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(manifestacoes));
  
  return true;
};

// Exporta as funções do serviço
const CrudService = {
  TIPOS_MANIFESTACAO,
  getAll,
  getByTipo,
  getById,
  getByEmail,
  getVisibleForUser,
  changeVisibility,
  create,
  update,
  remove
};

export default CrudService;