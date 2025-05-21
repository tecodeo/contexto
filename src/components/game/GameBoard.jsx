import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../contexts/GameContext';
import { useAuth } from '../../contexts/AuthContext';
import { FaThermometerEmpty, FaThermometerQuarter, FaThermometerHalf, FaThermometerThreeQuarters, FaThermometerFull } from 'react-icons/fa';
import Confetti from 'react-confetti';
import './GameBoard.css';

const GameBoard = () => {
  const { currentGame, guessResult, submitGuess, loading } = useGame();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [gameEnded, setGameEnded] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [lastGuessProximity, setLastGuessProximity] = useState(0);
  
  // Actualizar estado cuando cambia el juego
  useEffect(() => {
    if (currentGame) {
      // Obtener los intentos del usuario actual
      const userGuesses = Object.values(currentGame.guesses || {})
        .filter(guess => guess.userId === currentUser.uid)
        .sort((a, b) => b.proximity - a.proximity); // Ordenar por proximidad (mayor primero)
      
      setGuesses(userGuesses);
      
      // Verificar si el juego ha terminado para el usuario actual
      const playerData = currentGame.playerData?.[currentUser.uid];
      if (playerData?.guessed) {
        setGameEnded(true);
        setGameWon(true);
        // Mostrar confeti
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      } else if (currentGame.status === 'finished') {
        setGameEnded(true);
        setGameWon(false);
      } else {
        setGameEnded(false);
        setGameWon(false);
      }
      
      // Actualizar la proximidad del último intento
      if (userGuesses.length > 0) {
        setLastGuessProximity(Math.round(userGuesses[0].similarity * 100));
      }
    }
  }, [currentGame, currentUser]);
  
  // Manejar envío de intento
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!currentGuess.trim() || loading) return;
    
    // Verificar si la palabra ya ha sido utilizada
    const normalizedGuess = currentGuess.trim().toLowerCase();
    const isWordAlreadyGuessed = guesses.some(
      guess => guess.word.toLowerCase() === normalizedGuess
    );
    
    if (isWordAlreadyGuessed) {
      setErrorMessage('¡Ya has intentado esta palabra! Prueba con otra.');
      return;
    }
    
    try {
      await submitGuess(normalizedGuess);
      setCurrentGuess('');
    } catch (error) {
      console.error('Error al enviar intento:', error);
      setErrorMessage('Error al procesar tu intento. Inténtalo de nuevo.');
    }
  };
  
  // Función para obtener el color según la proximidad
  const getColorForProximity = (proximity) => {
    if (proximity >= 95) return '#4caf50'; // Verde - muy cerca
    if (proximity >= 80) return '#8bc34a'; // Verde claro
    if (proximity >= 60) return '#cddc39'; // Lima
    if (proximity >= 40) return '#ffc107'; // Ámbar
    if (proximity >= 20) return '#ff9800'; // Naranja
    return '#f44336'; // Rojo - muy lejos
  };
  
  // Manejar "jugar de nuevo"
  const handlePlayAgain = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="container" style={{ padding: '0 10px', maxWidth: '100%' }}>
      {showConfetti && <Confetti />}
      
      <div className="card" style={{ marginBottom: '15px', borderRadius: '0 0 20px 20px', padding: '15px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          marginBottom: '15px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ 
            backgroundColor: 'var(--primary)', 
            color: 'white', 
            padding: '8px 16px', 
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '16px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            margin: '0 5px'
          }}>
            Categoría: {currentGame.category || 'General'}
          </div>
          
          {currentGame.targetWord && currentUser.uid === currentGame.createdBy && (
            <div style={{ 
              backgroundColor: 'var(--secondary)', 
              color: 'white', 
              padding: '8px 16px', 
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '16px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              margin: '0 5px'
            }}>
              Palabra: {currentGame.targetWord}
            </div>
          )}
          
          <div style={{ 
            backgroundColor: 'var(--info)', 
            color: 'white', 
            padding: '8px 16px', 
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '16px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            margin: '0 5px'
          }}>
            Intentos: {guesses.length}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} style={{ marginBottom: '15px' }}>
          <div style={{ 
            display: 'flex', 
            gap: '8px',
            marginBottom: '8px',
            width: '100%',
            maxWidth: '100%'
          }}>
            <input
              type="text"
              value={currentGuess}
              onChange={(e) => setCurrentGuess(e.target.value)}
              placeholder="Escribe una palabra..."
              style={{
                flex: '1',
                padding: '12px 16px',
                fontSize: '16px',
                borderRadius: '30px',
                border: errorMessage ? '2px solid var(--danger)' : '2px solid rgba(0, 0, 0, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                outline: 'none',
                minWidth: '0'
              }}
              disabled={gameEnded}
            />
            <button 
              type="submit" 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 20px',
                borderRadius: '30px',
                backgroundColor: 'var(--primary)',
                color: 'white',
                fontWeight: 'bold',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                cursor: 'pointer',
                opacity: (!currentGuess.trim() || gameEnded) ? 0.7 : 1,
                whiteSpace: 'nowrap'
              }}
              disabled={!currentGuess.trim() || gameEnded}
            >
              Enviar
            </button>
          </div>
          {errorMessage && (
            <div style={{ 
              color: 'var(--danger)', 
              backgroundColor: 'rgba(220, 53, 69, 0.1)', 
              padding: '10px 16px',
              borderRadius: '8px',
              marginBottom: '10px',
              fontWeight: 'bold',
              fontSize: '14px',
              border: '1px solid rgba(220, 53, 69, 0.3)'
            }}>
              {errorMessage}
            </div>
          )}
        </form>
        
        {/* Barra de progreso */}
        {lastGuessProximity > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              marginBottom: '8px',
              fontWeight: 'bold',
              color: '#333',
              fontSize: '16px'
            }}>
              Proximidad a la palabra objetivo:
            </div>
            <div style={{ 
              height: '20px', 
              backgroundColor: 'rgba(0, 0, 0, 0.1)', 
              borderRadius: '10px', 
              overflow: 'hidden',
              border: '1px solid rgba(0, 0, 0, 0.1)'
            }}>
              <div 
                style={{ 
                  height: '100%',
                  width: `${lastGuessProximity}%`,
                  backgroundColor: getColorForProximity(lastGuessProximity),
                  borderRadius: '10px',
                  transition: 'width 0.5s ease'
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      <div className="card" style={{ padding: '15px', borderRadius: '20px' }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          marginBottom: '12px',
          textAlign: 'center',
          color: '#333'
        }}>
          Tus intentos
        </h2>
        
        <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '5px' }}>
          {guesses.length > 0 ? (
            guesses.map((guess, index) => (
              <div 
                key={index} 
                style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  marginBottom: '8px',
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(0, 0, 0, 0.05)'
                }}
              >
                <div style={{ 
                  fontWeight: 'bold', 
                  fontSize: '16px',
                  color: '#333',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginRight: '8px'
                }}>
                  {guess.word}
                </div>
                <div style={{ 
                  backgroundColor: getColorForProximity(guess.proximity || Math.round(guess.similarity * 100)),
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                  whiteSpace: 'nowrap',
                  minWidth: '50px',
                  textAlign: 'center'
                }}>
                  {guess.proximity || Math.round(guess.similarity * 100)}%
                </div>
              </div>
            ))
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '24px 0',
              backgroundColor: 'rgba(0, 0, 0, 0.03)',
              borderRadius: '10px',
              border: '1px dashed rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ 
                fontSize: '36px', 
                marginBottom: '12px' 
              }}>
                🎮
              </div>
              <p style={{ 
                fontSize: '14px', 
                color: '#555',
                fontWeight: '500',
                margin: '0 10px'
              }}>
                Aún no has hecho ningún intento. ¡Escribe tu primera palabra!
              </p>
            </div>
          )}
        </div>
      </div>
      
      {gameEnded && (
        <div className="card" style={{ 
          marginTop: '20px',
          textAlign: 'center',
          backgroundColor: gameWon ? 'rgba(40, 167, 69, 0.1)' : 'rgba(255, 193, 7, 0.1)',
          borderColor: gameWon ? 'rgba(40, 167, 69, 0.3)' : 'rgba(255, 193, 7, 0.3)'
        }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '16px' 
          }}>
            {gameWon ? '🎉' : '🔔'}
          </div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: gameWon ? 'var(--success)' : 'var(--warning)',
            marginBottom: '8px'
          }}>
            {gameWon ? '¡Felicidades! Has encontrado la palabra.' : 'Juego terminado'}
          </h2>
          <p style={{ 
            fontSize: '18px', 
            marginBottom: '8px',
            fontWeight: '500'
          }}>
            La palabra era: <strong>{currentGame.targetWord}</strong>
          </p>
          <p style={{ 
            fontSize: '16px', 
            marginBottom: '24px',
            color: '#666'
          }}>
            Completado en {guesses.length} intentos
          </p>
          <button 
            onClick={handlePlayAgain}
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
              maxWidth: '400px',
              margin: '0 auto'
            }}
          >
            JUGAR DE NUEVO
          </button>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
