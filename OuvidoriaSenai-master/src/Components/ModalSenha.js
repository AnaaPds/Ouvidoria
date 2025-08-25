import React, { useState } from 'react';
import './Modal.css';
import losenai from '../assets/imagens/logosenai.png';
import boneco from '../assets/imagens/boneco.png';
import cadeado from '../assets/imagens/cadeado.png';

function ModalSenha({ isOpen, onClose }) {
  const [cpf, setCpf] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [tipo, setTipo] = useState('');

  if (!isOpen) return null;

  const handleResetSenha = () => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(u => u.cpf === cpf && u.tipo === tipo);

    if (!usuario) {
      alert('Usuário não encontrado com esse CPF e tipo.');
      return;
    }

    usuario.senha = novaSenha;
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    alert('Senha atualizada com sucesso!');
    onClose();
  };

  return React.createElement('div', { className: 'modal-overlay', onClick: onClose },
    React.createElement('div', { className: 'modal-container', onClick: e => e.stopPropagation() }, [

      React.createElement('button', { className: 'close-btn', onClick: onClose }, '×'),

      React.createElement('img', {
        src: losenai,
        alt: 'Logo SENAI',
        className: 'logo-senai-modal'
      }),

      React.createElement('div', { className: 'linha-vermelha' }),
      React.createElement('h2', { className: 'titulo-principal' }, 'Esqueci minha senha'),

      // Campo CPF
      React.createElement('div', { className: 'input-icon-container' }, [
        React.createElement('img', { src: boneco, alt: 'Ícone CPF' }),
        React.createElement('input', {
          type: 'text',
          placeholder: 'Digite seu CPF',
          value: cpf,
          onChange: e => setCpf(e.target.value)
        })
      ]),

      // Campo Nova Senha
      React.createElement('div', { className: 'input-icon-container' }, [
        React.createElement('img', { src: cadeado, alt: 'Ícone senha' }),
        React.createElement('input', {
          type: 'password',
          placeholder: 'Nova Senha',
          value: novaSenha,
          onChange: e => setNovaSenha(e.target.value)
        })
      ]),

      React.createElement('p', { className: 'user-type-label' }, 'Tipo de Usuário:'),

      React.createElement('div', { className: 'user-type' }, [
        ['Administrador', 'Aluno', 'Funcionário'].map(tipoUsuario =>
          React.createElement('label', { key: tipoUsuario }, [
            React.createElement('input', {
              type: 'radio',
              name: 'tipo',
              value: tipoUsuario,
              checked: tipo === tipoUsuario,
              onChange: e => setTipo(e.target.value)
            }),
            ` ${tipoUsuario}`
          ])
        )
      ]),

      React.createElement('button', { className: 'submit-btn', onClick: handleResetSenha }, 'Confirmar')
    ])
  );
}

export default ModalSenha;
