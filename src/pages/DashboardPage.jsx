import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import GameList from '../components/game/GameList';
import CreateGame from '../components/game/CreateGame';
import { FaPlus, FaList, FaTrophy } from 'react-icons/fa';
import './DashboardPage.css';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { currentGame } = useGame();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);
  
  // Redirect to game page if in a game
  useEffect(() => {
    if (currentGame) {
      navigate('/game');
    }
  }, [currentGame, navigate]);
  
  // Manejar la creación o unión a una partida
  const handleGameAction = (gameId) => {
    if (gameId) {
      console.log('Navegando a la partida con ID:', gameId);
      navigate(`/game/${gameId}`);
    } else {
      console.log('No se proporcionó un ID de juego válido');
    }
  };
  
  // Crear una nueva partida
  const handleCreateGame = () => {
    navigate('/games/new');
  };
  
  if (!currentUser) {
    return null;
  }
  
  return (
    <div className="container">
      <div className="text-center mt-4 mb-4">
        <h1 className="text-center" style={{ 
          fontSize: '36px', 
          fontWeight: 'bold', 
          marginBottom: '12px',
          color: '#ffffff',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.6), 0 0 20px rgba(79, 70, 229, 0.4)'
        }}>
          CONTEXTO
        </h1>
        <p style={{ 
          fontSize: '20px', 
          marginBottom: '28px',
          color: '#ffffff',
          textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)',
          fontWeight: '500'
        }}>
          Adivina la palabra secreta
        </p>
      </div>
      
      <div className="card">
        <button 
          className="btn btn-primary mb-3"
          onClick={handleCreateGame}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            fontSize: '18px',
            fontWeight: '700',
            padding: '18px 28px',
            borderRadius: '20px',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.25)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: '100%',
            marginBottom: '24px'
          }}
        >
          <span style={{ fontSize: '24px' }}>➥</span>
          NUEVA PARTIDA
        </button>
        
        <button 
          className="btn btn-secondary mb-3"
          onClick={() => navigate('/leaderboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            fontSize: '18px',
            fontWeight: '700',
            padding: '18px 28px',
            borderRadius: '20px',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.25)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            backgroundColor: 'var(--secondary)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: '100%',
            marginBottom: '24px'
          }}
        >
          <span style={{ fontSize: '24px' }}>🏆</span>
          CLASIFICACIÓN
        </button>
        
        <button 
          className="btn btn-outline"
          onClick={() => navigate('/profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            fontSize: '18px',
            fontWeight: '700',
            padding: '18px 28px',
            borderRadius: '20px',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            backgroundColor: 'transparent',
            color: 'var(--primary)',
            border: '2px solid var(--primary)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: '100%'
          }}
        >
          <span style={{ fontSize: '24px' }}>👤</span>
          MI PERFIL
        </button>
      </div>
      
      <div className="card">
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px' }}>
          Partidas Disponibles
        </h2>
        
        <GameList onJoinGame={handleGameAction} />
      </div>
    </div>
  );
};

export default DashboardPage;
