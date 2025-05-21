import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import MainLayout from './components/layout/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateGamePage from './pages/CreateGamePage';
import GamePage from './pages/GamePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  // Envolver los proveedores fuera del Router para evitar problemas de renderizado
  return (
    <AuthProvider>
      <GameProvider>
        <AppRouter />
      </GameProvider>
    </AuthProvider>
  );
}

// Componente separado para el enrutamiento
function AppRouter() {
  // Esto ayuda a evitar actualizaciones de estado durante el renderizado
  const [isReady, setIsReady] = useState(false);
  
  // Asegurar que el componente esté montado antes de renderizar las rutas
  useEffect(() => {
    setIsReady(true);
  }, []);
  
  if (!isReady) {
    return <div className="loading-app">Cargando...</div>;
  }
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Public routes */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          
          {/* Protected routes */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="games/new" element={<CreateGamePage />} />
          <Route path="game" element={<GamePage />} />
          <Route path="game/:gameId" element={<GamePage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          
          {/* Not found route */}
          <Route path="404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
