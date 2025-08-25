import React, { useState } from 'react';
import './Header.css';
import logoSenai from '../assets/imagens/logosenai.png';
import iconeUsuario from '../assets/imagens/boneco.png';

import ModalLogin from './ModalLogin';
import ModalCadastro from './ModalCadastro';
import ModalSenha from './ModalSenha';

function Header() {
  const [modalAberto, setModalAberto] = useState(''); // 'login', 'cadastro', 'senha', ''

  const menuItems = [
    { texto: 'O SENAI', ativo: true, link: 'https://www.sp.senai.br/' },
    { texto: 'Manifestação Anônima' },
    { texto: 'Resultados e Ações Tomadas' },
    { texto: 'Transparência', link: 'https://transparencia.sp.senai.br/' },
    { texto: 'Contato com a Ouvidoria' }
  ];

  return (
    <>
      <header className="header">
        <img src={logoSenai} alt="Logo SENAI" className="logo-senai" />

        <nav className="nav-menu">
          {menuItems.map(({ texto, ativo, link }, index) => (
            <a
              href={link ? link : '#'}
              key={index}
              className={`nav-item ${ativo ? 'ativo' : ''}`}
              {...(link ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {texto}
            </a>
          ))}
        </nav>

        <button
          className="usuario"
          type="button"
          onClick={() => setModalAberto('login')}
        >
          <div className="divisor" />
          <img src={iconeUsuario} alt="Usuário" className="icone-usuario" />
          <span className="sou-aluno">SOU ALUNO</span>
        </button>
      </header>

      {/* Modal Login */}
      {React.createElement(ModalLogin, {
        key: 'modal-login',
        isOpen: modalAberto === 'login',
        onClose: () => setModalAberto(''),
        onCadastro: () => setModalAberto('cadastro'),
        onEsqueciSenha: () => setModalAberto('senha')
      })}

      {/* Modal Cadastro */}
      {React.createElement(ModalCadastro, {
        key: 'modal-cadastro',
        isOpen: modalAberto === 'cadastro',
        onClose: () => setModalAberto('login')
      })}

      {/* Modal Esqueci Senha */}
      {React.createElement(ModalSenha, {
        key: 'modal-senha',
        isOpen: modalAberto === 'senha',
        onClose: () => setModalAberto('login')
      })}
    </>
  );
}

export default Header;
