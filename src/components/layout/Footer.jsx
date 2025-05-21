import { FaHeart, FaGithub, FaGamepad } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="game-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <FaGamepad className="footer-icon" />
            <span>Contexto</span>
          </div>
          
          <div className="footer-info">
            <p className="copyright">
              &copy; {currentYear} Contexto Game. Todos los derechos reservados.
            </p>
            
            <div className="footer-links">
              <p className="made-with">
                Hecho con <FaHeart className="heart-icon" /> en España
              </p>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                <FaGithub size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
