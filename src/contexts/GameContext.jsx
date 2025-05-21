import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createGame, 
  joinGame, 
  makeGuess, 
  listenToGame, 
  getActiveGames,
  getTopPlayers
} from '../services/game';
import { useAuth } from './AuthContext';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [currentGame, setCurrentGame] = useState(null);
  const [activeGames, setActiveGames] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [guessResult, setGuessResult] = useState(null);
  const [gameUnsubscribe, setGameUnsubscribe] = useState(null);

  // Load active games and top players on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const games = await getActiveGames();
        setActiveGames(games);
        
        const players = await getTopPlayers();
        setTopPlayers(players);
      } catch (err) {
        console.error('Error loading initial game data:', err);
        setError(err.message);
      }
    };

    loadInitialData();
    
    // Refresh active games every 30 seconds
    const interval = setInterval(async () => {
      try {
        const games = await getActiveGames();
        setActiveGames(games);
      } catch (err) {
        console.error('Error refreshing active games:', err);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Clean up game listener when unmounting
  useEffect(() => {
    return () => {
      if (gameUnsubscribe) {
        gameUnsubscribe();
      }
    };
  }, [gameUnsubscribe]);

  const startListeningToGame = (gameId) => {
    console.log('Iniciando escucha para el juego con ID:', gameId);
    
    // Limpiar el listener anterior si existe
    if (gameUnsubscribe) {
      console.log('Limpiando listener anterior');
      gameUnsubscribe();
    }
    
    try {
      console.log('Configurando nuevo listener para el juego');
      const unsubscribe = listenToGame(gameId, (game) => {
        console.log('Datos del juego actualizados:', game);
        setCurrentGame(game);
      });
      
      console.log('Listener configurado correctamente');
      setGameUnsubscribe(() => unsubscribe);
    } catch (error) {
      console.error('Error al configurar el listener del juego:', error);
      setError('Error al conectar con la partida');
    }
  };

  const createNewGame = async (category) => {
    console.log('Creando nueva partida con categoría:', category);
    console.log('Usuario actual:', currentUser);
    
    // Verificar que el usuario esté autenticado
    if (!currentUser || !currentUser.uid) {
      console.error('No hay usuario autenticado o no tiene UID');
      setError('Debes iniciar sesión para crear una partida');
      return null;
    }
    
    // Verificar que la categoría sea válida
    if (!category) {
      console.error('No se proporcionó una categoría válida');
      setError('Selecciona una categoría válida');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Llamando a createGame con categoría:', category, 'y usuario:', currentUser.uid);
      
      // Intentar crear la partida
      const gameId = await createGame(category, currentUser.uid);
      console.log('Respuesta de createGame:', gameId);
      
      // Verificar que se haya creado correctamente
      if (gameId) {
        console.log('Partida creada exitosamente con ID:', gameId);
        console.log('Iniciando escucha para el juego:', gameId);
        
        // Iniciar la escucha de actualizaciones del juego
        startListeningToGame(gameId);
        
        return gameId;
      } else {
        console.error('No se recibió un ID de juego válido');
        setError('No se pudo crear la partida');
        return null;
      }
    } catch (err) {
      console.error('Error al crear partida:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const joinExistingGame = async (gameId) => {
    if (!currentUser) {
      setError('You must be logged in to join a game');
      return false;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await joinGame(gameId, currentUser.uid);
      startListeningToGame(gameId);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const submitGuess = async (word) => {
    if (!currentUser || !currentGame) {
      setError('You must be in a game to make a guess');
      return null;
    }
    
    setLoading(true);
    setError(null);
    setGuessResult(null);
    
    try {
      const result = await makeGuess(currentGame.id, currentUser.uid, word);
      setGuessResult(result);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const leaveGame = () => {
    if (gameUnsubscribe) {
      gameUnsubscribe();
      setGameUnsubscribe(null);
    }
    
    setCurrentGame(null);
    setGuessResult(null);
  };

  const refreshActiveGames = async () => {
    setLoading(true);
    try {
      const games = await getActiveGames();
      setActiveGames(games);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshTopPlayers = async () => {
    setLoading(true);
    try {
      const players = await getTopPlayers();
      setTopPlayers(players);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentGame,
    activeGames,
    topPlayers,
    loading,
    error,
    guessResult,
    createNewGame,
    joinExistingGame,
    submitGuess,
    leaveGame,
    refreshActiveGames,
    refreshTopPlayers
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
