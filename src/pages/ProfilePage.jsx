import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaEdit, FaSignOutAlt, FaGamepad, FaStar, FaTrophy } from 'react-icons/fa';
import './ProfilePage.css';

const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalGames: 0,
    totalWins: 0,
    bestScore: 0,
  });
  const [recentGames, setRecentGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Simulación de carga de datos del perfil
    // En una implementación real, aquí se cargarían los datos del usuario desde Firebase
    const loadProfileData = async () => {
      setIsLoading(true);
      try {
        // Simular datos de estadísticas
        setStats({
          totalGames: 24,
          totalWins: 18,
          bestScore: 950,
        });

        // Simular datos de partidas recientes
        setRecentGames([
          {
            id: 'game1',
            title: 'Animales Salvajes',
            category: 'Animales',
            date: '2023-05-15',
            score: 850,
            guesses: 12,
          },
          {
            id: 'game2',
            title: 'Capitales del Mundo',
            category: 'Geografía',
            date: '2023-05-10',
            score: 920,
            guesses: 8,
          },
          {
            id: 'game3',
            title: 'Frutas Tropicales',
            category: 'Alimentos',
            date: '2023-05-05',
            score: 750,
            guesses: 15,
          },
        ]);
      } catch (error) {
        console.error('Error al cargar datos del perfil:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (!currentUser || isLoading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="profile-header">
          <motion.div
            className="profile-avatar"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <FaUser className="avatar-icon" />
          </motion.div>
          
          <h1 className="profile-name">{currentUser.username}</h1>
          <p className="profile-email">{currentUser.email}</p>
          
          <div className="profile-stats">
            <motion.div 
              className="stat-card"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <h2 className="stat-value">{stats.totalGames}</h2>
              <p className="stat-label">Partidas Jugadas</p>
            </motion.div>
            
            <motion.div 
              className="stat-card"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <h2 className="stat-value">{stats.totalWins}</h2>
              <p className="stat-label">Partidas Ganadas</p>
            </motion.div>
            
            <motion.div 
              className="stat-card"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <h2 className="stat-value">{stats.bestScore}</h2>
              <p className="stat-label">Mejor Puntuación</p>
            </motion.div>
          </div>
          
          <div className="profile-actions">
            <motion.button
              className="profile-button edit-button"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={() => navigate('/edit-profile')}
            >
              <FaEdit className="button-icon" />
              <span>Editar Perfil</span>
            </motion.button>
            
            <motion.button
              className="profile-button logout-button"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              onClick={handleLogout}
            >
              <FaSignOutAlt className="button-icon" />
              <span>Cerrar Sesión</span>
            </motion.button>
          </div>
        </div>
        
        <div className="recent-games">
          <h2 className="section-title">Partidas Recientes</h2>
          
          <div className="games-grid">
            {recentGames.map((game) => (
              <motion.div
                key={game.id}
                className="game-card"
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h3 className="game-title">{game.title}</h3>
                <span className="game-category">{game.category}</span>
                <p className="game-date">{game.date}</p>
                
                <div className="game-details">
                  <div className="game-detail">
                    <span className="detail-value">{game.score}</span>
                    <span className="detail-label">Puntos</span>
                  </div>
                  
                  <div className="game-detail">
                    <span className="detail-value">{game.guesses}</span>
                    <span className="detail-label">Intentos</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
