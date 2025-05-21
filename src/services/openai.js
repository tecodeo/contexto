import OpenAI from 'openai';

// Usar una variable de entorno o un valor seguro para la clave API
// En producción, esto debería obtenerse de variables de entorno del servidor
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'TU_CLAVE_API_AQUI', // Reemplazar con tu clave API de forma segura
  dangerouslyAllowBrowser: true // For client-side usage
});

/**
 * Calculate semantic similarity between two words using OpenAI embeddings
 * @param {string} word1 - First word to compare
 * @param {string} word2 - Second word to compare (target word)
 * @returns {Promise<number>} - Similarity score between 0 and 1
 */
export const calculateSimilarity = async (word1, word2) => {
  try {
    // Get embeddings for both words
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: [word1, word2],
    });

    // Extract embeddings
    const embeddings = response.data.map(item => item.embedding);
    
    // Calculate cosine similarity
    const similarity = cosineSimilarity(embeddings[0], embeddings[1]);
    
    return similarity;
  } catch (error) {
    console.error('Error calculating similarity:', error);
    throw error;
  }
};

/**
 * Calculate cosine similarity between two vectors
 * @param {number[]} a - First vector
 * @param {number[]} b - Second vector
 * @returns {number} - Cosine similarity (between -1 and 1)
 */
function cosineSimilarity(a, b) {
  // Dot product
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  
  // Magnitudes
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  
  // Cosine similarity
  return dotProduct / (magA * magB);
}

export default {
  calculateSimilarity
};
