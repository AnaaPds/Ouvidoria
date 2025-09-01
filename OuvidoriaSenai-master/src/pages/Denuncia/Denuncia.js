import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CrudService from '../../services/CrudService';
import '../Denuncia/Denuncia.css';
import Footer from '../../Components/Footer';
import HeaderSimples from '../../Components/HeaderSimples';
import SetaVoltar from '../../Components/SetaVoltar';

function Denuncia() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    contato: '',
    local: '',
    dataHora: '',
    descricao: '',
    anexo: null
  });

  // Estado para a URL da imagem preview
  const [previewUrl, setPreviewUrl] = useState(null);

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

    // Cria URL temporária para preview da imagem
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.descricao) {
      alert('Por favor, preencha a descrição da denúncia.');
      return;
    }

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    const denuncia = {
      ...formData,
      tipo: CrudService.TIPOS_MANIFESTACAO.DENUNCIA,
      anexoNome: formData.anexo ? formData.anexo.name : null,
      email: usuarioLogado ? usuarioLogado.email : null
    };

    CrudService.create(denuncia);
    navigate('/confirmacao');
  };

  const handleAnonimoSubmit = (e) => {
    e.preventDefault();

    if (!formData.descricao) {
      alert('Por favor, preencha a descrição da denúncia.');
      return;
    }

    const denuncia = {
      ...formData,
      nome: 'Anônimo',
      contato: 'Não informado',
      tipo: CrudService.TIPOS_MANIFESTACAO.DENUNCIA,
      anexoNome: formData.anexo ? formData.anexo.name : null,
      email: null
    };

    CrudService.create(denuncia);
    navigate('/confirmacao');
  };

  return React.createElement(
    'div',
    { className: 'denuncia-container' },
    React.createElement(HeaderSimples, null),
    React.createElement(SetaVoltar, null),
    React.createElement(
      'div',
      { className: 'denuncia-content' },
      React.createElement('h2', { className: 'titulo-pagina' }, 'Faça uma denúncia'),
      React.createElement(
        'div',
        { className: 'instrucoes-preenchimento' },
        React.createElement('p', null, React.createElement('strong', null, '* Campos Obrigatórios')),
        React.createElement('p', null, '* Tamanho máximo para Anexar arquivo: 5 Megabytes.'),
        React.createElement('p', null, 'Explique em quais casos a denúncia pode ser feita e reforce a confidencialidade do processo.')
      ),
      React.createElement(
        'div',
        { className: 'form-box' },
        React.createElement(
          'form',
          { className: 'formulario-denuncia', onSubmit: handleSubmit },
          React.createElement('label', null, 'Nome (opcional)'),
          React.createElement('input', {
            type: 'text',
            name: 'nome',
            value: formData.nome,
            onChange: handleChange,
            placeholder: 'Digite aqui...'
          }),
          React.createElement('label', null, 'E-mail ou Telefone *'),
          React.createElement('input', {
            type: 'text',
            name: 'contato',
            value: formData.contato,
            onChange: handleChange,
            placeholder: 'Digite aqui...',
            required: true
          }),
          React.createElement('label', null, 'Local do incidente *'),
          React.createElement('input', {
            type: 'text',
            name: 'local',
            value: formData.local,
            onChange: handleChange,
            placeholder: 'Digite aqui...',
            required: true
          }),
          React.createElement('label', null, 'Data e Hora do incidente *'),
          React.createElement('input', {
            type: 'text',
            name: 'dataHora',
            value: formData.dataHora,
            onChange: handleChange,
            placeholder: 'Digite aqui...',
            required: true
          }),
          React.createElement('label', null, 'Descrição detalhada da denúncia *'),
          React.createElement(
            'div',
            { className: 'textarea-container' },
            React.createElement('textarea', {
              name: 'descricao',
              value: formData.descricao,
              onChange: handleChange,
              rows: 6,
              placeholder: 'Digite aqui...',
              required: true
            }),
            React.createElement(
              'label',
              { htmlFor: 'file-upload-denuncia', className: 'custom-file-upload' },
              React.createElement('img', {
                src: require('../../assets/imagens/icone-anexo.png'),
                alt: 'Anexar',
                className: 'icone-anexar'
              })
            ),
            React.createElement('input', {
              id: 'file-upload-denuncia',
              type: 'file',
              onChange: handleFileChange,
              style: { display: 'none' }
            }),

            formData.anexo &&
              React.createElement(
                'p',
                { className: 'arquivo-selecionado' },
                'Arquivo selecionado: ',
                formData.anexo.name
              ),

            // Preview da imagem
            previewUrl &&
              React.createElement('img', {
                src: previewUrl,
                alt: 'Preview do anexo',
                style: { marginTop: '10px', maxWidth: '100%', maxHeight: '300px', borderRadius: '4px' }
              })
          ),
          React.createElement('small', null, 'Atenção: Evite compartilhar imagens que possam comprometer sua segurança ou de outra pessoa.'),
          React.createElement(
            'div',
            { style: { display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px' } },
            React.createElement(
              'button',
              { type: 'submit', className: 'btn-confirmar' },
              'Confirmar'
            ),
            React.createElement(
              'button',
              {
                type: 'button',
                className: 'btn-confirmar',
                style: { backgroundColor: '#666' },
                onClick: handleAnonimoSubmit
              },
              'Enviar Anônimo'
            )
          )
        )
      )
    ),
    React.createElement(Footer, null)
  );
}

export default Denuncia;
