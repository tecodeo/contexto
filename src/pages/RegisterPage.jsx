import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../contexts/AuthContext';
import './AuthPages.css';

const RegisterPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);
  
  return (
    <div className="auth-page-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="auth-page-content"
      >
        <h1 className="auth-page-title">
          Crea tu cuenta
        </h1>
        
        <RegisterForm onSuccess={() => navigate('/dashboard')} />
        
        <div className="auth-page-footer">
          <p className="auth-page-text">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="auth-page-link">
              Inicia sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
