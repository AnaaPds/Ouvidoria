import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CrudService from '../../services/CrudService';
import '../Sugestao/Sugestao.css';
import Footer from '../../Components/Footer';
import HeaderSimples from '../../Components/HeaderSimples';
import SetaVoltar from '../../Components/SetaVoltar';

function Sugestao() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    contato: '',
    local: '',
    dataHora: '',
    descricao: '',
    anexo: null
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      alert('O arquivo é muito grande. O tamanho máximo é 5MB.');
      return;
    }
    setFormData(prevState => ({
      ...prevState,
      anexo: file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar campos obrigatórios
    if (!formData.descricao) {
      alert('Por favor, preencha a descrição da sugestão.');
      return;
    }
    
    // Obter usuário logado, se existir
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    // Criar objeto de sugestão
    const sugestao = {
      ...formData,
      tipo: CrudService.TIPOS_MANIFESTACAO.SUGESTAO,
      anexoNome: formData.anexo ? formData.anexo.name : null,
      email: usuarioLogado ? usuarioLogado.email : null
    };
    
    // Salvar no localStorage
    CrudService.create(sugestao);
    
    // Redirecionar para página de confirmação
    navigate('/confirmacao');
  };

  return (
    <div className="sugestao-container">
      <HeaderSimples />
      <SetaVoltar />

      <div className="sugestao-content">
        <h2 className="titulo-pagina">Faça uma sugestão</h2>

        <div className="instrucoes-preenchimento">
          <p><strong>* Campos Obrigatórios</strong></p>
          <p>* Tamanho máximo para Anexar arquivo: 5 Megabytes.</p>
          <p>Explique em quais casos a denúncia pode ser feita e reforce a confidencialidade do processo.</p>
        </div>

        <div className="form-box">
          <form className="formulario-sugestao" onSubmit={handleSubmit}>
            <label>Nome (opcional)</label>
            <input 
              type="text" 
              name="nome" 
              value={formData.nome} 
              onChange={handleChange} 
              placeholder="Digite aqui..." 
            />

            <label>E-mail ou Telefone *</label>
            <input 
              type="text" 
              name="contato" 
              value={formData.contato} 
              onChange={handleChange} 
              placeholder="Digite aqui..." 
              required 
            />

            <label>Local da sugestão *</label>
            <input 
              type="text" 
              name="local" 
              value={formData.local} 
              onChange={handleChange} 
              placeholder="Digite aqui..." 
              required 
            />

            <label>Data e Hora da sugestão *</label>
            <input 
              type="text" 
              name="dataHora" 
              value={formData.dataHora} 
              onChange={handleChange} 
              placeholder="Digite aqui..." 
              required 
            />

            <label>Descrição detalhada da sugestão *</label>
            <div className="textarea-container">
              <textarea 
                name="descricao" 
                value={formData.descricao} 
                onChange={handleChange} 
                rows="6" 
                placeholder="Digite aqui..." 
                required
              ></textarea>
              <label htmlFor="file-upload-sugestao" className="custom-file-upload">
                <img
                  src={require('../../assets/imagens/icone-anexo.png')}
                  alt="Anexar"
                  className="icone-anexar"
                />
              </label>
              <input 
                id="file-upload-sugestao" 
                type="file" 
                onChange={handleFileChange} 
                style={{display: 'none'}} 
              />
              {formData.anexo && (
                <p className="arquivo-selecionado">Arquivo selecionado: {formData.anexo.name}</p>
              )}
            </div>

            <small>Atenção: Evite compartilhar imagens que possam comprometer sua segurança ou de outra pessoa.</small>

            <button type="submit" className="btn-confirmar">Confirmar</button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Sugestao;
