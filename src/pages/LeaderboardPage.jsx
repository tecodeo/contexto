import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Leaderboard from '../components/game/Leaderboard';
import { FaArrowLeft } from 'react-icons/fa';

const LeaderboardPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);
  
  if (!currentUser) {
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
          onClick={() => navigate('/dashboard')}
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
          Clasificación Global
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ flex: 1 }}
      >
        <Leaderboard />
      </motion.div>
    </div>
  );
};

export default LeaderboardPage;
