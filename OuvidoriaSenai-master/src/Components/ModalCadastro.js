import React, { useState } from 'react';
import './Modal.css';
import losenai from '../assets/imagens/logosenai.png';
import boneco from '../assets/imagens/boneco.png';
import cadeado from '../assets/imagens/cadeado.png';

function ModalCadastro({ isOpen, onClose }) {
  const [form, setForm] = useState({
    email: '',
    nome: '',
    cpf: '',
    telefone: '',
    senha: '',
    tipo: '',
    area: '' // <- Nova propriedade adicionada
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === 'radio' ? value : value });
  };

  const handleSubmit = () => {
    if (!form.email || !form.nome || !form.cpf || !form.telefone || !form.senha || !form.tipo || !form.area) {
      alert('Preencha todos os campos, selecione um tipo de usuário e uma área.');
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios.push(form);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    alert('Usuário cadastrado com sucesso!');
    onClose();
  };

  return React.createElement('div', { className: 'modal-overlay', onClick: onClose },
    React.createElement('div', { className: 'modal-container', onClick: e => e.stopPropagation() }, [

      React.createElement('button', { className: 'close-btn', onClick: onClose }, '×'),
      React.createElement('img', { src: losenai, alt: 'Logo SENAI', className: 'logo-senai-modal' }),
      React.createElement('div', { className: 'linha-vermelha' }),
      React.createElement('h2', { className: 'titulo-principal' }, 'Cadastro'),

      // Campo E-mail
      React.createElement('div', { className: 'input-icon-container' }, [
        React.createElement('img', { src: boneco, alt: 'Ícone usuário' }),
        React.createElement('input', {
          type: 'email',
          name: 'email',
          placeholder: 'E-mail Educacional',
          value: form.email,
          onChange: handleChange
        })
      ]),

      // Campo Nome
      React.createElement('div', { className: 'input-icon-container' }, [
        React.createElement('img', { src: boneco, alt: 'Ícone usuário' }),
        React.createElement('input', {
          type: 'text',
          name: 'nome',
          placeholder: 'Digite seu nome',
          value: form.nome,
          onChange: handleChange
        })
      ]),

      // Campo CPF
      React.createElement('div', { className: 'input-icon-container' }, [
        React.createElement('img', { src: boneco, alt: 'Ícone usuário' }),
        React.createElement('input', {
          type: 'text',
          name: 'cpf',
          placeholder: 'Digite seu CPF',
          value: form.cpf,
          onChange: handleChange
        })
      ]),

      // Campo Telefone
      React.createElement('div', { className: 'input-icon-container' }, [
        React.createElement('img', { src: boneco, alt: 'Ícone usuário' }),
        React.createElement('input', {
          type: 'text',
          name: 'telefone',
          placeholder: 'Número de Telefone',
          value: form.telefone,
          onChange: handleChange
        })
      ]),

      // Campo Senha
      React.createElement('div', { className: 'input-icon-container' }, [
        React.createElement('img', { src: cadeado, alt: 'Ícone senha' }),
        React.createElement('input', {
          type: 'password',
          name: 'senha',
          placeholder: 'Senha',
          value: form.senha,
          onChange: handleChange
        })
      ]),

      // Tipo de Usuário
      React.createElement('p', { className: 'user-type-label' }, 'Tipo de Usuário:'),
      React.createElement('div', { className: 'user-type' }, [
        ['Administrador', 'Aluno', 'Funcionário'].map(tipo =>
          React.createElement('label', { key: tipo }, [
            React.createElement('input', {
              type: 'radio',
              name: 'tipo',
              value: tipo,
              checked: form.tipo === tipo,
              onChange: handleChange
            }),
            ` ${tipo} `
          ])
        )
      ]),

      // Área de Atuação
      React.createElement('p', { className: 'user-type-label' }, 'Área de Atuação:'),
      React.createElement('div', { className: 'user-type' }, [
        ['Informática', 'Mecânica'].map(area =>
          React.createElement('label', { key: area }, [
            React.createElement('input', {
              type: 'radio',
              name: 'area',
              value: area,
              checked: form.area === area,
              onChange: handleChange
            }),
            ` ${area} `
          ])
        )
      ]),

      // Botão de Enviar
      React.createElement('button', { className: 'submit-btn', onClick: handleSubmit }, 'Cadastrar')
    ])
  );
}

export default ModalCadastro;
