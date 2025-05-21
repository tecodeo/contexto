import { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { FaGamepad, FaUsers, FaTag, FaPlusCircle } from 'react-icons/fa';
import './CreateGame.css';

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

const CreateGame = ({ onGameCreated }) => {
  const [category, setCategory] = useState('General');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  
  const { createNewGame } = useGame();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Formulario enviado con categoría:', category);
    
    // Validar que se haya seleccionado una categoría
    if (!category) {
      setError('Por favor, selecciona una categoría');
      return;
    }
    
    setIsCreating(true);
    setError('');
    
    try {
      console.log('Intentando crear partida con categoría:', category);
      
      // Llamar a la función createNewGame con la categoría seleccionada
      const gameId = await createNewGame(category);
      console.log('Respuesta de createNewGame:', gameId);
      
      // Verificar si se creó correctamente la partida
      if (gameId) {
        console.log('Partida creada exitosamente con ID:', gameId);
        
        // Si tenemos un callback onGameCreated, llamarlo con el ID del juego
        if (onGameCreated) {
          console.log('Llamando a onGameCreated con ID:', gameId);
          onGameCreated(gameId);
        } else {
          console.warn('No se proporcionó un callback onGameCreated');
        }
      } else {
        console.error('No se recibió un ID de juego válido');
        throw new Error('No se pudo crear la partida. No se recibió un ID de juego válido.');
      }
    } catch (err) {
      console.error('Error al crear partida:', err);
      setError(`Error al crear la partida: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="create-game-container">
      <div className="create-game-card">
        <div className="create-game-header">
          <FaGamepad className="create-game-icon" />
          <h2 className="create-game-title">
            Crear Nueva Partida
          </h2>
        </div>
        
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="create-game-form">
          <div className="form-group">
            <label className="form-label" htmlFor="category">
              <FaTag className="label-icon" />
              <span>Categoría</span>
            </label>
            <select
              id="category"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isCreating}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          

          
          <button
            type="submit"
            className="btn create-button"
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <span className="loading-spinner"></span>
                <span>Creando partida...</span>
              </>
            ) : (
              <>
                <FaPlusCircle />
                <span>Crear Partida</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGame;
