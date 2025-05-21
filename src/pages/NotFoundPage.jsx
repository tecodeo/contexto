import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="not-found-content"
      >
        <FaExclamationTriangle className="not-found-icon" />
        <h1 className="not-found-title">
          Página no encontrada
        </h1>
        <p className="not-found-message">
          Lo sentimos, la página que estás buscando no existe.
        </p>
        <Link 
          to="/" 
          className="home-button"
        >
          <FaHome className="home-icon" />
          <span>Volver al Inicio</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
