import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../contexts/AuthContext';
import './AuthPages.css';

const LoginPage = () => {
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
          Bienvenido de nuevo
        </h1>
        
        <LoginForm onSuccess={() => navigate('/dashboard')} />
        
        <div className="auth-page-footer">
          <p className="auth-page-text">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="auth-page-link">
              Regístrate
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
