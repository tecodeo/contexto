import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaUsers, FaCalendarAlt, FaTag, FaGamepad } from 'react-icons/fa';
import { ref, query, orderByChild, limitToLast, get } from 'firebase/database';
import { database } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import './GameList.css';

const GameList = ({ onJoinGame }) => {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth(); // Obtener el usuario actual del contexto de autenticación
  
  useEffect(() => {
    // Solo intentar obtener los juegos si el usuario está autenticado
    if (!currentUser) {
      setIsLoading(false);
      setError('Debes iniciar sesión para ver los juegos disponibles');
      return;
    }
    
    const fetchGames = async () => {
      try {
        // Crear referencia a la colección de juegos usando la instancia centralizada de Firebase
        const gamesRef = ref(database, 'games');
        
        // Crear la consulta
        const gamesQuery = query(
          gamesRef,
          orderByChild('createdAt'),
          limitToLast(10)
        );
        
        // Obtener los datos
        const snapshot = await get(gamesQuery);
        const gamesList = [];
        
        // Procesar los datos si existen
        if (snapshot.exists()) {
          // Convertir el objeto de Firebase en un array
          snapshot.forEach((childSnapshot) => {
            const gameData = childSnapshot.val();
            gamesList.push({
              id: childSnapshot.key,
              title: gameData.title || 'Partida sin título',
              category: gameData.category || 'General',
              playerCount: gameData.playerCount || 0,
              createdAt: gameData.createdAt || Date.now(),
              ...gameData
            });
          });
          
          // Ordenar por fecha de creación (más reciente primero)
          gamesList.sort((a, b) => b.createdAt - a.createdAt);
        }
        
        setGames(gamesList);
      } catch (err) {
        console.error('Error fetching games:', err);
        setError(`Error al cargar los juegos: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGames();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="card" style={{ backgroundColor: '#FFEBEE', borderLeft: '4px solid var(--error)' }}>
        <p style={{ color: 'var(--error)' }}>{error}</p>
      </div>
    );
  }
  
  if (games.length === 0) {
    return (
      <div className="text-center py-4">
        <div style={{ fontSize: '48px', marginBottom: '16px', textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' }}>🎮</div>
        <p style={{ 
          fontSize: '20px', 
          marginBottom: '28px',
          color: '#ffffff',
          textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)',
          fontWeight: '500'
        }}>
          No hay partidas disponibles
        </p>
        <button
          onClick={() => window.location.href = '/games/new'}
          className="btn btn-primary"
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
          <span style={{ fontSize: '24px' }}>➥</span>
          CREAR PARTIDA
        </button>
      </div>
    );
  }
  
  return (
    <div>
      {games.map((game) => (
        <div 
          key={game.id} 
          className="card" 
          style={{ marginBottom: '16px', padding: '16px' }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start', 
            marginBottom: '12px' 
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
              {game.title || 'Partida sin título'}
            </h3>
            <span style={{
              backgroundColor: 'var(--primary)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {game.category || 'General'}
            </span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '16px',
            color: 'var(--text-muted)'
          }}>
            <span style={{ marginRight: '8px' }}>📅</span>
            <span>{game.createdAt ? new Date(game.createdAt).toLocaleDateString() : 'Fecha desconocida'}</span>
          </div>
          
          <button
            onClick={() => onJoinGame && onJoinGame(game.id)}
            className="btn btn-primary"
            style={{ margin: 0 }}
          >
            <span className="btn-icon">▶️</span>
            JUGAR AHORA
          </button>
        </div>
      ))}
    </div>
  );
};

export default GameList;
