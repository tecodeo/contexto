import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import GameBoard from '../components/game/GameBoard';
import { FaArrowLeft } from 'react-icons/fa';

const GamePage = () => {
  const { currentUser } = useAuth();
  const { currentGame, leaveGame, joinExistingGame } = useGame();
  const navigate = useNavigate();
  const { gameId } = useParams(); // Obtener el ID del juego de la URL
  
  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);
  
  // Join game if gameId is provided in URL
  useEffect(() => {
    if (currentUser && gameId && !currentGame) {
      console.log('Joining game with ID:', gameId);
      joinExistingGame(gameId)
        .then(success => {
          if (!success) {
            console.error('Failed to join game');
            navigate('/dashboard');
          }
        })
        .catch(err => {
          console.error('Error joining game:', err);
          navigate('/dashboard');
        });
    }
  }, [currentUser, gameId, currentGame, joinExistingGame, navigate]);
  
  // Redirigir si no hay juego activo y no se proporciona un ID de juego
  useEffect(() => {
    if (!currentGame && !gameId) {
      navigate('/dashboard');
    }
  }, [currentGame, gameId, navigate]);
  
  // Mostrar mensaje de carga mientras se está uniendo al juego
  if (currentUser && gameId && !currentGame) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: 'var(--dark)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ 
            width: '40px',
            height: '40px',
            margin: '0 auto 20px',
            border: '4px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            borderTopColor: 'var(--primary)',
            animation: 'spin 1s linear infinite'
          }}></div>
          <h2 style={{ fontSize: '20px', fontWeight: '500' }}>Cargando partida...</h2>
        </div>
      </div>
    );
  }
  
  const handleBack = () => {
    leaveGame();
    navigate('/dashboard');
  };
  
  if (!currentUser || !currentGame) {
    return null;
  }
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%',
      padding: '0',
      margin: '0',
      backgroundColor: 'var(--dark)'
    }}>
      <div style={{ 
        padding: '10px 15px',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <button 
          onClick={handleBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '8px',
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s ease'
          }}
        >
          <FaArrowLeft /> Volver al inicio
        </button>
        
        <div style={{ 
          color: 'white', 
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          Estado: En curso
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ flex: 1 }}
      >
        <GameBoard />
      </motion.div>
    </div>
  );
};

export default GamePage;
