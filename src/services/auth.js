import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from '../firebase/config';

/**
 * Register a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} username - User display name
 * @returns {Promise<object>} - User data
 */
export const registerUser = async (email, password, username) => {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with username
    await updateProfile(user, {
      displayName: username
    });
    
    // Create user record in database
    await set(ref(database, `users/${user.uid}`), {
      username,
      email,
      createdAt: Date.now(),
      score: 0,
      gamesPlayed: 0,
      gamesWon: 0
    });
    
    return {
      uid: user.uid,
      email: user.email,
      username
    };
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

/**
 * Login an existing user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} - User data
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    return {
      uid: user.uid,
      email: user.email,
      username: user.displayName
    };
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * Logout the current user
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

/**
 * Get current user data
 * @returns {Promise<object|null>} - User data or null if not logged in
 */
export const getCurrentUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        resolve({
          uid: user.uid,
          email: user.email,
          username: user.displayName
        });
      } else {
        resolve(null);
      }
    });
  });
};

/**
 * Update user score after a game
 * @param {string} userId - User ID
 * @param {number} score - Score to add
 * @param {boolean} won - Whether the user won the game
 * @returns {Promise<void>}
 */
export const updateUserScore = async (userId, score, won) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    const userSnapshot = await get(userRef);
    
    if (userSnapshot.exists()) {
      const userData = userSnapshot.val();
      
      await set(userRef, {
        ...userData,
        score: userData.score + score,
        gamesPlayed: userData.gamesPlayed + 1,
        gamesWon: userData.gamesWon + (won ? 1 : 0)
      });
    }
  } catch (error) {
    console.error('Error updating user score:', error);
    throw error;
  }
};
