import React, { useState } from 'react';
import losenai from '../assets/imagens/logosenai.png';
import boneco from '../assets/imagens/boneco.png';
import cadeado from '../assets/imagens/cadeado.png';

function ModalLogin({ isOpen, onClose, onCadastro, onEsqueciSenha, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('');

  if (!isOpen) return null;

  const handleLogin = () => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);

    if (!usuario) {
      alert('Usuário ou senha inválidos.');
      return;
    }

    if (usuario.tipo !== tipo) {
      alert('Tipo de usuário incorreto.');
      return;
    }

    // Salvar usuário logado no localStorage
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

    // Chama o callback do componente pai passando o usuário logado
    if (typeof onLoginSuccess === 'function') {
      onLoginSuccess(usuario);
    }

    onClose();
  };

  return React.createElement(
    'div',
    { className: 'modal-overlay', onClick: onClose },
    React.createElement(
      'div',
      { className: 'modal-container', onClick: e => e.stopPropagation() },
      React.createElement(
        'button',
        { className: 'close-btn', onClick: onClose },
        '×'
      ),
      React.createElement('img', {
        src: losenai,
        alt: 'Logo SENAI',
        className: 'logo-senai-modal'
      }),
      React.createElement('p', { className: 'subtitulo' }, 'Ouvidoria do Senai Suíço Brasileira'),
      React.createElement('div', { className: 'linha-vermelha' }),
      React.createElement('h2', { className: 'titulo-principal' }, 'Login'),

      React.createElement(
        'div',
        { className: 'input-icon-container' },
        React.createElement('img', { src: boneco, alt: 'Ícone usuário' }),
        React.createElement('input', {
          type: 'email',
          placeholder: 'E-mail Educacional',
          value: email,
          onChange: e => setEmail(e.target.value)
        })
      ),

      React.createElement(
        'div',
        { className: 'input-icon-container' },
        React.createElement('img', { src: cadeado, alt: 'Ícone senha' }),
        React.createElement('input', {
          type: 'password',
          placeholder: 'Senha',
          value: senha,
          onChange: e => setSenha(e.target.value)
        })
      ),

      React.createElement('p', { className: 'user-type-label' }, 'Tipo de Usuário:'),
      React.createElement(
        'div',
        { className: 'user-type' },
        ['Administrador', 'Aluno', 'Funcionário'].map(op =>
          React.createElement(
            'label',
            { key: op },
            React.createElement('input', {
              type: 'radio',
              name: 'tipo',
              value: op,
              checked: tipo === op,
              onChange: e => setTipo(e.target.value)
            }),
            ` ${op}`
          )
        )
      ),

      React.createElement(
        'button',
        { className: 'submit-btn', onClick: handleLogin },
        'Entrar'
      ),

      React.createElement(
        'div',
        { className: 'actions-links' },
        React.createElement(
          'button',
          { onClick: onEsqueciSenha },
          'Esqueceu sua senha?'
        ),
        React.createElement(
          'button',
          { onClick: onCadastro },
          'Primeiro acesso?'
        )
      )
    )
  );
}

export default ModalLogin;
