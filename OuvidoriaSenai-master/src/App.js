import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Confirmacao from './pages/Confirmacao/Confirmacao';
import Denuncia from './pages/Denuncia/Denuncia';
import Elogio from './pages/Elogio/Elogio';
import Sugestao from './pages/Sugestao/Sugestao';
import Reclamacao from './pages/Reclamacao/Reclamacao';
import Admin from './pages/Admin/Admin';
import Aluno from './pages/Aluno/Aluno';
import Funcionario from './pages/Funcionario/Funcionario';

// Importando os modais
import ModalLogin from './Components/ModalLogin';
import ModalCadastro from './Components/ModalCadastro';
import ModalSenha from './Components/ModalSenha';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCadastroOpen, setIsCadastroOpen] = useState(false);
  const [isSenhaOpen, setIsSenhaOpen] = useState(false);

  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);

  const openCadastroModal = () => setIsCadastroOpen(true);
  const closeCadastroModal = () => setIsCadastroOpen(false);

  const openSenhaModal = () => setIsSenhaOpen(true);
  const closeSenhaModal = () => setIsSenhaOpen(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home openLoginModal={openLoginModal} />} />
        <Route path="/confirmacao" element={<Confirmacao />} />
        <Route path="/denuncia" element={<Denuncia />} />
        <Route path="/elogio" element={<Elogio />} />
        <Route path="/sugestao" element={<Sugestao />} />
        <Route path="/reclamacao" element={<Reclamacao />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/aluno" element={<Aluno />} />
        <Route path="/funcionario" element={<Funcionario />} />
      </Routes>

      {/* Modals */}
      <ModalLogin
        isOpen={isLoginOpen}
        onClose={closeLoginModal}
        onCadastro={openCadastroModal}
        onEsqueciSenha={openSenhaModal}
      />
      <ModalCadastro isOpen={isCadastroOpen} onClose={closeCadastroModal} />
      <ModalSenha isOpen={isSenhaOpen} onClose={closeSenhaModal} />
    </BrowserRouter>
  );
}

export default App;
