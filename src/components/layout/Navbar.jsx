import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaGamepad, FaTrophy, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };
  
  return (
    <nav className="game-navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            <FaGamepad className="logo-icon pulse" />
            <span className="logo-text">Contexto</span>
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          
          {/* Desktop menu */}
          <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
            {currentUser ? (
              <>
                <Link to="/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  <FaGamepad className="nav-icon" />
                  <span>Jugar</span>
                </Link>
                <Link to="/leaderboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  <FaTrophy className="nav-icon" />
                  <span>Clasificación</span>
                </Link>
                <div className="user-dropdown">
                  <button className="dropdown-toggle">
                    <FaUser className="nav-icon" />
                    <span>{currentUser.displayName || 'Usuario'}</span>
                  </button>
                  <div className="dropdown-menu">
                    <Link 
                      to="/profile" 
                      className="dropdown-item"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaUser className="item-icon" />
                      <span>Mi Perfil</span>
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="dropdown-item"
                    >
                      <FaSignOutAlt className="item-icon" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  <FaSignInAlt className="nav-icon" />
                  <span>Iniciar Sesión</span>
                </Link>
                <Link to="/register" className="nav-button" onClick={() => setIsMenuOpen(false)}>
                  <FaUserPlus className="nav-icon" />
                  <span>Registrarse</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
