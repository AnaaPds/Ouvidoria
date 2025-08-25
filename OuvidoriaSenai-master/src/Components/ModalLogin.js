import React, { useState } from 'react';
import './Modal.css';
import losenai from '../assets/imagens/logosenai.png';
import boneco from '../assets/imagens/boneco.png';
import cadeado from '../assets/imagens/cadeado.png';
import { useNavigate } from 'react-router-dom';

function ModalLogin({ isOpen, onClose, onCadastro, onEsqueciSenha }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('');
  const navigate = useNavigate();

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
    
    // Redirecionar com base no tipo de usuário
    if (tipo === 'Administrador') {
      navigate('/admin');
    } else if (tipo === 'Aluno') {
      navigate('/aluno');
    } else if (tipo === 'Funcionário') {
      navigate('/funcionario');
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <img src={losenai} alt="Logo SENAI" className="logo-senai-modal" />
        <p className="subtitulo">Ouvidoria do Senai Suíço Brasileira</p>
        <div className="linha-vermelha" />
        <h2 className="titulo-principal">Login</h2>

        <div className="input-icon-container">
          <img src={boneco} alt="Ícone usuário" />
          <input
            type="email"
            placeholder="E-mail Educacional"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="input-icon-container">
          <img src={cadeado} alt="Ícone senha" />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
          />
        </div>

        <p className="user-type-label">Tipo de Usuário:</p>
        <div className="user-type">
          {['Administrador', 'Aluno', 'Funcionário'].map(op => (
            <label key={op}>
              <input
                type="radio"
                name="tipo"
                value={op}
                checked={tipo === op}
                onChange={e => setTipo(e.target.value)}
              />
              {` ${op}`}
            </label>
          ))}
        </div>

        <button className="submit-btn" onClick={handleLogin}>Entrar</button>

        <div className="actions-links">
          <button onClick={onEsqueciSenha}>Esqueceu sua senha?</button>
          <button onClick={onCadastro}>Primeiro acesso?</button>
        </div>
      </div>
    </div>
  );
}

export default ModalLogin;
