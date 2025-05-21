import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { FaArrowLeft, FaGamepad } from 'react-icons/fa';

const CATEGORIES = [
  'Animales',
  'Países',
  'Objetos',
  'Famosos',
  'Películas',
  'Profesiones',
  'Alimentos',
  'Tecnología',
  'Deportes',
  'Naturaleza'
];

const CreateGamePage = () => {
  const { currentUser } = useAuth();
  const { createNewGame } = useGame();
  const navigate = useNavigate();
  
  const [category, setCategory] = useState('Animales');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  
  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Creando partida con categoría:', category);
    
    if (!category) {
      setError('Por favor, selecciona una categoría');
      return;
    }
    
    setIsCreating(true);
    setError('');
    
    try {
      const gameId = await createNewGame(category);
      console.log('Partida creada con ID:', gameId);
      
      if (gameId) {
        navigate(`/game/${gameId}`);
      } else {
        throw new Error('No se pudo crear la partida');
      }
    } catch (err) {
      console.error('Error al crear partida:', err);
      setError(`Error al crear la partida: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="container">
      <div className="text-center mt-4 mb-4">
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>
          NUEVA PARTIDA
        </h1>
      </div>
      
      <div className="card">
        {error && (
          <div style={{ 
            backgroundColor: '#FFEBEE', 
            borderLeft: '4px solid var(--error)',
            padding: '12px',
            marginBottom: '20px',
            borderRadius: '8px',
            color: 'var(--error)'
          }}>
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="category">
              CATEGORÍA
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isCreating}
              className="form-control"
              style={{ fontSize: '18px', height: '56px' }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <p style={{ 
              fontSize: '14px', 
              color: 'var(--text-muted)', 
              marginTop: '8px' 
            }}>
              Selecciona la categoría para la palabra objetivo
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isCreating}
            className="btn btn-primary"
            style={{ marginTop: '24px' }}
          >
            {isCreating ? (
              <>
                <div className="spinner" style={{ 
                  width: '24px', 
                  height: '24px', 
                  marginRight: '12px',
                  borderWidth: '3px'
                }}></div>
                CREANDO...
              </>
            ) : (
              <>
                <span className="btn-icon">➕</span>
                CREAR PARTIDA
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn btn-outline"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontSize: '18px',
              fontWeight: '700',
              padding: '18px 28px',
              borderRadius: '20px',
              marginTop: '16px',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              backgroundColor: 'transparent',
              color: 'var(--primary)',
              border: '2px solid var(--primary)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              width: '100%',
              maxWidth: '400px',
              margin: '16px auto 0'
            }}
          >
            <span style={{ fontSize: '24px' }}>←</span>
            VOLVER AL INICIO
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGamePage;
