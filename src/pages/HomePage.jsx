import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGamepad, FaTrophy, FaUsers, FaArrowRight, FaFire, FaSnowflake } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <section className="hero-section">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hero-content"
        >
          <h1 className="hero-title">
            <span className="gradient-text">Contexto</span> Game
          </h1>
          <p className="hero-description">
            Un juego competitivo multijugador donde deberás adivinar la palabra oculta
            a través de la similitud semántica. ¡Cuanto más cerca estés, más "caliente" estarás!
          </p>
          <div className="hero-buttons">
            <button
              onClick={() => navigate('/login')}
              className="btn btn-primary"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => navigate('/register')}
              className="btn btn-accent"
            >
              Registrarse
            </button>
          </div>
          
          <div className="temperature-scale">
            <div className="scale-item">
              <FaSnowflake className="temp-cold" />
              <span>Frío</span>
            </div>
            <div className="scale-line"></div>
            <div className="scale-item">
              <FaFire className="temp-hot" />
              <span>Caliente</span>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Características</h2>
        
        <div className="features-grid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="feature-card"
          >
            <div className="feature-icon">
              <FaGamepad />
            </div>
            <h3 className="feature-title">Múltiples Categorías</h3>
            <p className="feature-description">
              Elige entre 10 categorías diferentes: Animales, Países, Objetos, Famosos, Películas y más.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="feature-card"
          >
            <div className="feature-icon">
              <FaUsers />
            </div>
            <h3 className="feature-title">Multijugador</h3>
            <p className="feature-description">
              Compite en tiempo real contra otros jugadores para ver quién adivina la palabra con menos intentos.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="feature-card"
          >
            <div className="feature-icon">
              <FaTrophy />
            </div>
            <h3 className="feature-title">Clasificación Global</h3>
            <p className="feature-description">
              Gana puntos en cada partida y escala en la clasificación global para convertirte en el mejor jugador.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="how-to-play-section">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="how-to-play-card"
        >
          <h2 className="section-title">¿Cómo se juega?</h2>
          <ol className="steps-list">
            <li className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                Únete a una partida existente o crea una nueva eligiendo una categoría.
              </div>
            </li>
            <li className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                Espera a que se unan otros jugadores o comienza a jugar inmediatamente.
              </div>
            </li>
            <li className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                Escribe palabras que creas que están relacionadas con la palabra objetivo.
              </div>
            </li>
            <li className="step-item">
              <div className="step-number">4</div>
              <div className="step-content">
                El sistema te indicará qué tan "caliente" o "frío" estás basado en la similitud semántica.
              </div>
            </li>
            <li className="step-item">
              <div className="step-number">5</div>
              <div className="step-content">
                ¡Adivina la palabra con el menor número de intentos posible para ganar más puntos!
              </div>
            </li>
          </ol>
          
          <div className="play-now-button">
            <button 
              onClick={() => navigate('/register')} 
              className="btn btn-primary"
            >
              ¡Jugar Ahora! <FaArrowRight className="btn-icon" />
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
