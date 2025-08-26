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
    area: ''
  });

  const [isSelectOpen, setIsSelectOpen] = useState(false); // controle da seta

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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

      // Email
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

      // Nome
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

      // CPF
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

      // Telefone
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

      // Senha
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

      // Área de Atuação (com select)
      React.createElement('div', {
        className: isSelectOpen ? 'select-wrapper open' : 'select-wrapper'
      }, [
        React.createElement('select', {
          name: 'area',
          value: form.area,
          onChange: handleChange,
          className: 'select-area',
          onFocus: () => setIsSelectOpen(true),
          onBlur: () => setIsSelectOpen(false),
          required: true
        }, [
          React.createElement('option', { value: '', disabled: true }, 'Área de Atuação'),
          React.createElement('option', { value: 'Informática' }, 'Informática'),
          React.createElement('option', { value: 'Mecânica' }, 'Mecânica')
        ])
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

      // Botão
      React.createElement('button', { className: 'submit-btn', onClick: handleSubmit }, 'Cadastrar')
    ])
  );
}

export default ModalCadastro;
