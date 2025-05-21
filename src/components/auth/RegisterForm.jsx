import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import './AuthForms.css';

const RegisterForm = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !email || !password || !confirmPassword) {
      setError('Por favor, completa todos los campos');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await register(username, email, password);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <FaUserPlus className="auth-icon" />
          <h2 className="auth-title">Crear Cuenta</h2>
        </div>
        
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Nombre de Usuario
            </label>
            <div className="input-wrapper">
              <div className="input-icon">
                <FaUser />
              </div>
              <input
                id="username"
                type="text"
                className="form-input"
                placeholder="usuario123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Correo Electrónico
            </label>
            <div className="input-wrapper">
              <div className="input-icon">
                <FaEnvelope />
              </div>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Contraseña
            </label>
            <div className="input-wrapper">
              <div className="input-icon">
                <FaLock />
              </div>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirmar Contraseña
            </label>
            <div className="input-wrapper">
              <div className="input-icon">
                <FaLock />
              </div>
              <input
                id="confirmPassword"
                type="password"
                className="form-input"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="btn btn-accent auth-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                <span>Registrando...</span>
              </>
            ) : 'Registrarse'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
