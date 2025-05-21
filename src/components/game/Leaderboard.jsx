import { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaAward, FaCrown } from 'react-icons/fa';
import { ref, query, orderByChild, limitToLast, get } from 'firebase/database';
import { database } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import './Leaderboard.css';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth(); // Obtener el usuario actual del contexto de autenticación
  
  useEffect(() => {
    // Solo intentar obtener los datos si el usuario está autenticado
    if (!currentUser) {
      setIsLoading(false);
      setError('Debes iniciar sesión para ver la clasificación');
      return;
    }
    
    const fetchLeaderboard = async () => {
      try {
        // Crear referencia a la colección de usuarios usando la instancia centralizada de Firebase
        const usersRef = ref(database, 'users');
        
        // Crear la consulta
        const leaderboardQuery = query(
          usersRef,
          orderByChild('score'),
          limitToLast(20)
        );
        
        // Obtener los datos
        const snapshot = await get(leaderboardQuery);
        const leaderboardUsers = [];
        
        // Procesar los datos si existen
        if (snapshot.exists()) {
          // Convertir el objeto de Firebase en un array
          snapshot.forEach((childSnapshot) => {
            const userData = childSnapshot.val();
            leaderboardUsers.push({
              id: childSnapshot.key,
              displayName: userData.username || userData.displayName || 'Usuario Anónimo',
              score: userData.score || 0,
              gamesPlayed: userData.gamesPlayed || 0,
              wordsGuessed: userData.wordsGuessed || 0
            });
          });
          
          // Ordenar por puntuación (mayor a menor)
          leaderboardUsers.sort((a, b) => b.score - a.score);
        }
        
        setLeaderboardData(leaderboardUsers);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(`Error al cargar la clasificación: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);
  
  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <FaTrophy className="rank-icon" />;
      case 1:
        return <FaMedal className="rank-icon" />;
      case 2:
        return <FaMedal className="rank-icon" />;
      default:
        return <FaAward className="rank-icon" />;
    }
  };
  
  const getRankClass = (index) => {
    switch (index) {
      case 0:
        return 'rank-1';
      case 1:
        return 'rank-2';
      case 2:
        return 'rank-3';
      default:
        return 'rank-other';
    }
  };
  
  const getPlayerRowClass = (index) => {
    switch (index) {
      case 0:
        return 'top-player';
      case 1:
        return 'second-player';
      case 2:
        return 'third-player';
      default:
        return '';
    }
  };
  
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        flex: 1
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          borderTopColor: 'var(--primary)',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <p style={{ color: 'white' }}>Cargando clasificación...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{
        padding: '20px',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        color: 'var(--danger)',
        borderRadius: '10px',
        margin: '20px',
        textAlign: 'center',
        border: '1px solid rgba(220, 53, 69, 0.3)'
      }}>
        {error}
      </div>
    );
  }
  
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px 10px'
    }}>
      <div style={{ 
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '20px'
        }}>
          <FaCrown style={{ marginRight: '0.5rem', color: 'var(--accent)' }} />
          Clasificación Global
        </h2>
      </div>
      
      {leaderboardData.length === 0 ? (
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '10px',
          padding: '30px 20px',
          textAlign: 'center',
          color: 'white',
          border: '1px dashed rgba(255, 255, 255, 0.2)'
        }}>
          <p style={{ fontSize: '16px', fontWeight: '500' }}>
            No hay datos disponibles en la clasificación.
          </p>
        </div>
      ) : (
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ 
            overflowX: 'auto',
            padding: '5px'
          }}>
            <table style={{ 
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  borderBottom: '2px solid rgba(0, 0, 0, 0.1)'
                }}>
                  <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 'bold' }}>POSICIÓN</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 'bold' }}>JUGADOR</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 'bold' }}>PUNTUACIÓN</th>
                  <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 'bold' }}>PARTIDAS</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((user, index) => (
                  <tr 
                    key={user.id} 
                    style={{
                      backgroundColor: index % 2 === 0 ? 'white' : 'rgba(0, 0, 0, 0.02)',
                      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                      ...(index < 3 ? { backgroundColor: index === 0 ? 'rgba(255, 215, 0, 0.1)' : index === 1 ? 'rgba(192, 192, 192, 0.1)' : 'rgba(205, 127, 50, 0.1)' } : {})
                    }}
                  >
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                      <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px'
                      }}>
                        {index < 3 ? (
                          <span style={{ 
                            color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                            fontSize: '20px'
                          }}>
                            {index === 0 ? <FaTrophy /> : index === 1 ? <FaMedal /> : <FaAward />}
                          </span>
                        ) : null}
                        <span style={{ 
                          fontWeight: 'bold',
                          color: index < 3 ? (index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32') : '#333'
                        }}>{index + 1}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 8px', fontWeight: index < 3 ? 'bold' : 'normal' }}>
                      {user.displayName}
                    </td>
                    <td style={{ 
                      padding: '12px 8px', 
                      textAlign: 'center', 
                      fontWeight: 'bold',
                      color: index < 3 ? (index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32') : '#333'
                    }}>
                      {user.score.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                      {user.gamesPlayed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
