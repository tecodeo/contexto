import { ref, set, get, push, onValue, update } from 'firebase/database';
import { database } from '../firebase/config';
// Importamos solo las funciones que necesitamos del servicio OpenAI
import { calculateSimilarity, getTemperatureIndicator } from './openai';

// Game categories
export const CATEGORIES = [
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

// Sample target words for each category (in production, these would be stored in Firebase)
const SAMPLE_TARGET_WORDS = {
  'Animales': ['elefante', 'tigre', 'ballena', 'águila', 'delfín'],
  'Países': ['españa', 'japón', 'brasil', 'australia', 'egipto'],
  'Objetos': ['teléfono', 'lámpara', 'reloj', 'silla', 'libro'],
  'Famosos': ['picasso', 'einstein', 'beyoncé', 'messi', 'spielberg'],
  'Películas': ['titanic', 'avatar', 'matrix', 'gladiador', 'frozen'],
  'Profesiones': ['médico', 'profesor', 'ingeniero', 'chef', 'abogado'],
  'Alimentos': ['pizza', 'chocolate', 'manzana', 'sushi', 'paella'],
  'Tecnología': ['internet', 'smartphone', 'robot', 'algoritmo', 'blockchain'],
  'Deportes': ['fútbol', 'tenis', 'baloncesto', 'natación', 'ciclismo'],
  'Naturaleza': ['montaña', 'océano', 'bosque', 'desierto', 'volcán']
};

/**
 * Create a new game
 * @param {string} category - Game category
 * @param {string} creatorId - ID of the user creating the game
 * @returns {Promise<string>} - Game ID
 */
export const createGame = async (category, creatorId) => {
  console.log('Función createGame llamada con:', { category, creatorId });
  
  try {
    // Verificación de parámetros
    if (!category) {
      throw new Error('Se requiere una categoría para crear una partida');
    }
    
    if (!creatorId) {
      throw new Error('Se requiere un ID de usuario para crear una partida');
    }
    
    // Verificar que la categoría existe
    if (!SAMPLE_TARGET_WORDS[category]) {
      console.error('Categoría no encontrada:', category);
      console.log('Categorías disponibles:', Object.keys(SAMPLE_TARGET_WORDS));
      throw new Error(`La categoría '${category}' no existe`);
    }
    
    // Obtener una palabra objetivo aleatoria de la categoría
    const targetWords = SAMPLE_TARGET_WORDS[category];
    const targetWord = targetWords[Math.floor(Math.random() * targetWords.length)];
    console.log('Palabra objetivo seleccionada:', targetWord);
    
    // Crear una referencia para el nuevo juego en la base de datos
    console.log('Creando referencia en la base de datos...');
    const gamesRef = ref(database, 'games');
    const newGameRef = push(gamesRef);
    const gameId = newGameRef.key;
    
    if (!gameId) {
      throw new Error('No se pudo generar un ID de juego válido');
    }
    
    console.log('ID de juego generado:', gameId);
    
    // Datos del juego
    const gameData = {
      id: gameId,
      category,
      targetWord,
      creatorId,
      title: `Partida de ${category}`,
      status: 'active', // active, finished
      createdAt: Date.now(),
      endTime: null,
      guesses: {},
      playerData: {
        [creatorId]: {
          attempts: 0,
          guessed: false,
          score: 0
        }
      }
    };
    
    console.log('Guardando datos del juego:', gameData);
    
    // Guardar los datos del juego en la base de datos
    await set(newGameRef, gameData);
    console.log('Juego creado exitosamente con ID:', gameId);
    
    return gameId;
  } catch (error) {
    console.error('Error al crear la partida:', error);
    throw new Error(`Error al crear la partida: ${error.message}`);
  }
};

/**
 * Join an existing game
 * @param {string} gameId - Game ID
 * @param {string} userId - User ID
 * @returns {Promise<boolean>}
 */
export const joinGame = async (gameId, userId) => {
  try {
    const gameRef = ref(database, `games/${gameId}`);
    const gameSnapshot = await get(gameRef);
    
    if (!gameSnapshot.exists()) {
      throw new Error('Partida no encontrada');
    }
    
    const gameData = gameSnapshot.val();
    
    if (gameData.status === 'finished') {
      throw new Error('Esta partida ya ha finalizado');
    }
    
    // Registrar al jugador en la partida si no existe
    if (!gameData.playerData || !gameData.playerData[userId]) {
      await update(gameRef, {
        [`playerData/${userId}`]: {
          attempts: 0,
          guessed: false,
          score: 0,
          joinedAt: Date.now()
        }
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error al unirse a la partida:', error);
    throw error;
  }
};

/**
 * Start a game
 * @param {string} gameId - Game ID
 * @returns {Promise<void>}
 */
export const startGame = async (gameId) => {
  try {
    const gameRef = ref(database, `games/${gameId}`);
    
    await update(gameRef, {
      status: 'active',
      startTime: Date.now()
    });
  } catch (error) {
    console.error('Error starting game:', error);
    throw error;
  }
};

/**
 * Make a guess in a game
 * @param {string} gameId - Game ID
 * @param {string} userId - User ID
 * @param {string} word - Guessed word
 * @returns {Promise<object>} - Guess result
 */
export const makeGuess = async (gameId, userId, word) => {
  try {
    const gameRef = ref(database, `games/${gameId}`);
    const gameSnapshot = await get(gameRef);
    
    if (!gameSnapshot.exists()) {
      throw new Error('Partida no encontrada');
    }
    
    const gameData = gameSnapshot.val();
    
    if (gameData.status !== 'active') {
      throw new Error('La partida no está activa');
    }
    
    // Obtener los datos del jugador o crear un nuevo registro si no existe
    const playerData = gameData.playerData?.[userId] || {
      attempts: 0,
      guessed: false,
      score: 0
    };
    
    if (playerData.guessed) {
      throw new Error('Ya has adivinado la palabra');
    }
    
    const targetWord = gameData.targetWord;
    const normalizedWord = word.toLowerCase().trim();
    const normalizedTarget = targetWord.toLowerCase().trim();
    
    // Verificar si la palabra es correcta
    const isCorrect = normalizedWord === normalizedTarget;
    
    // Calcular similitud si no es correcta
    let similarity = 0;
    let temperature = 'cold';
    
    if (!isCorrect) {
      similarity = await calculateSimilarity(normalizedWord, normalizedTarget);
      temperature = getTemperatureIndicator(similarity);
    }
    
    // Actualizar datos del jugador
    const newAttempts = playerData.attempts + 1;
    const updates = {
      [`playerData/${userId}/attempts`]: newAttempts
    };
    
    // Si es correcta, actualizar puntuación del jugador y finalizar la partida
    if (isCorrect) {
      // Calcular puntuación basada en intentos (menos intentos = mayor puntuación)
      const score = Math.max(100 - (newAttempts - 1) * 5, 10);
      
      updates[`playerData/${userId}/guessed`] = true;
      updates[`playerData/${userId}/score`] = score;
      updates[`playerData/${userId}/guessedAt`] = Date.now();
      updates.status = 'finished';
      updates.endTime = Date.now();
    }
    
    // Guardar intento en el historial
    const guessRef = push(ref(database, `games/${gameId}/guesses`));
    await set(guessRef, {
      userId,
      word,
      similarity: isCorrect ? 1 : similarity,
      temperature: isCorrect ? 'correct' : temperature,
      timestamp: Date.now()
    });
    
    // Actualizar partida
    await update(gameRef, updates);
    
    return {
      isCorrect,
      similarity: isCorrect ? 1 : similarity,
      temperature: isCorrect ? 'correct' : temperature,
      attempts: newAttempts,
      targetWord: isCorrect ? targetWord : null // Solo devolver la palabra objetivo si se ha adivinado
    };
  } catch (error) {
    console.error('Error al hacer intento:', error);
    throw error;
  }
};

/**
 * Get active games
 * @param {number} limit - Maximum number of games to return
 * @returns {Promise<Array>} - List of active games
 */
export const getActiveGames = (limit = 10) => {
  return new Promise((resolve, reject) => {
    const gamesRef = ref(database, 'games');
    
    onValue(gamesRef, (snapshot) => {
      try {
        const games = [];
        
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const gameId = childSnapshot.key;
            const gameData = childSnapshot.val();
            
            if (gameData.status === 'waiting') {
              games.push({
                id: gameId,
                ...gameData,
                playerCount: Object.keys(gameData.players || {}).length
              });
            }
            
            if (games.length >= limit) {
              return true; // Break the loop
            }
          });
        }
        
        resolve(games);
      } catch (error) {
        reject(error);
      }
    }, { onlyOnce: true });
  });
};

/**
 * Listen for game updates
 * @param {string} gameId - Game ID
 * @param {function} callback - Callback function to handle updates
 * @returns {function} - Unsubscribe function
 */
export const listenToGame = (gameId, callback) => {
  const gameRef = ref(database, `games/${gameId}`);
  
  const unsubscribe = onValue(gameRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({
        id: gameId,
        ...snapshot.val()
      });
    } else {
      callback(null);
    }
  });
  
  return unsubscribe;
};

/**
 * Get top players by score
 * @param {number} limit - Maximum number of players to return
 * @returns {Promise<Array>} - List of top players
 */
export const getTopPlayers = (limit = 10) => {
  return new Promise((resolve, reject) => {
    const usersRef = ref(database, 'users');
    
    onValue(usersRef, (snapshot) => {
      try {
        const players = [];
        
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const userId = childSnapshot.key;
            const userData = childSnapshot.val();
            
            players.push({
              id: userId,
              ...userData
            });
          });
        }
        
        // Sort by score (descending)
        players.sort((a, b) => b.score - a.score);
        
        resolve(players.slice(0, limit));
      } catch (error) {
        reject(error);
      }
    }, { onlyOnce: true });
  });
};
