import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import Header from '../../Components/Header';
import '../../Components/Header';
import Dropdown from '../../Components/Dropdown';
import '../../Components/Dropdown';
import BotaoOuvidoria from '../../Components/BotaoOuvidoria';
import '../../Components/BotaoOuvidoria';
import Footer from '../../Components/Footer';
import '../../Components/Footer';
import bannerImage from '../../assets/imagens/bannersenai.png';
import './Home.css';
import ModalHorario from '../../Components/ModalHorario'; 

function Home() {
  const navigate = useNavigate(); 
  const [modalVisivel, setModalVisivel] = useState(false);

  return React.createElement('div', { className: 'home-container' }, [

    React.createElement(Header, { key: 'header' }),

    React.createElement('div', { className: 'banner-container', key: 'banner-container' }, [
      React.createElement('img', {
        src: bannerImage,
        alt: 'Banner SENAI',
        className: 'banner',
        key: 'banner'
      }),
      React.createElement('div', { className: 'texto-bemvindo', key: 'texto-bemvindo' }, [
        React.createElement('h1', { key: 'titulo-ouvidoria' }, 'OUVIDORIA'),
        React.createElement('h2', { key: 'subtitulo-bemvindo' }, 'Bem-vindo à Ouvidoria do SENAI Suíço Brasileira')
      ])
    ]),

    React.createElement('div', { className: 'drop-area', key: 'drops' }, [
      React.createElement(Dropdown, { titulo: 'O que é?', key: 'dropdown-1' }, 'A Ouvidoria é um canal de comunicação entre a comunidade e a escola, onde é possível enviar denúncias, reclamações, sugestões e elogios. Ela busca garantir um atendimento transparente e imparcial.'),
      React.createElement(Dropdown, { titulo: 'Quem pode utilizar este serviço?', key: 'dropdown-2' }, 'Alunos, pais, colaboradores e todos os membros da comunidade escolar podem acessar a Ouvidoria para expressar suas preocupações, sugestões e reconhecimentos.'),
      React.createElement(Dropdown, { titulo: 'Etapas para utilização deste serviço', key: 'dropdown-3' }, '1- Escolha o tipo de manifestação (denúncia, reclamação, elogio ou sugestão). 2- Preencha o formulário com as informações solicitadas. 3- Envie a manifestação e aguarde o retorno da Ouvidoria. 4- Acompanhe o status da sua manifestação, se disponível.'),
      React.createElement(Dropdown, { titulo: 'Perguntas Frequentes sobre a Ouvidoria', key: 'dropdown-4' }, 'Veja o FAQ no rodapé.'),
      React.createElement(Dropdown, { titulo: 'Outras informações', key: 'dropdown-5' }, 'Entre em contato conosco.')
    ]),

    React.createElement('div', { className: 'descricao', key: 'desc' },
      'A Ouvidoria da Escola SENAI Suiço-Brasileira é um canal de diálogo que busca garantir transparência e escuta ativa para denúncias, reclamações, sugestões e elogios. Seu objetivo é identificar oportunidades de melhoria e tratar todas as manifestações com imparcialidade, contribuindo para o aperfeiçoamento da escola e a satisfação dos usuários.'
    ),

    React.createElement('div', { className: 'botoes-ouvidoria', key: 'botoes' }, [
      React.createElement(BotaoOuvidoria, {
        imagem: 'denuncia.png',
        texto: 'DENÚNCIA',
        onClick: () => navigate('/denuncia'),
        key: 'botao-denuncia'
      }),
      React.createElement(BotaoOuvidoria, {
        imagem: 'reclamacao.png',
        texto: 'RECLAMAÇÃO',
        onClick: () => navigate('/reclamacao'),
        key: 'botao-reclamacao'
      }),
      React.createElement(BotaoOuvidoria, {
        imagem: 'elogio.png',
        texto: 'ELOGIO',
        onClick: () => navigate('/elogio'),
        key: 'botao-elogio'
      }),
      React.createElement(BotaoOuvidoria, {
        imagem: 'sugestao.png',
        texto: 'SUGESTÃO',
        onClick: () => navigate('/sugestao'),
        key: 'botao-sugestao'
      }),
    
    ]),

    
    React.createElement('button', {
      className: 'botao-horario',
      key: 'btn',
      onClick: () => setModalVisivel(true) 
    }, 'VEJA O HORÁRIO DE ATENDIMENTO'),

    modalVisivel && React.createElement(ModalHorario, {
      onClose: () => setModalVisivel(false),
      key: 'modal-horario'
    }),

    React.createElement(Footer, { key: 'footer' })
  ]);
}

export default Home;
