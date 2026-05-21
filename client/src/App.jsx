import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ThemeSelector from './components/ThemeSelector';
import LevelUpModal from './components/LevelUpModal';

/**
 * Main Application Component
 * Sets up routing and authentication state checking
 */
function App() {
  const { user, checkAuth, logout, isCheckingAuth } = useAuthStore();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpData, setLevelUpData] = useState({ oldLevel: 0, newLevel: 0 });
  const prevLevelRef = useRef(null);

  useEffect(() => {
    if (user) {
      if (prevLevelRef.current !== null && user.level > prevLevelRef.current) {
        setLevelUpData({ oldLevel: prevLevelRef.current, newLevel: user.level });
        setShowLevelUp(true);
      }
      prevLevelRef.current = user.level;
    } else {
      prevLevelRef.current = null;
    }
  }, [user]);

  useEffect(() => {
    checkAuth();
    // Pre-load theme from localStorage to avoid layout flashes
    const savedTheme = localStorage.getItem('typo-theme') || 'theme-dark';
    document.documentElement.classList.add(savedTheme);
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4 select-none">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="font-mono text-sm tracking-widest text-primary animate-pulse font-bold">LOADING TYPOVELOCITY...</p>
      </div>
    );
  }

  return (
    // Application Router setup
    <Router>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header className="p-4 border-b border-border glass-panel sticky top-0 z-50">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/">
              <h1 className="text-2xl font-bold gradient-text">TypoVelocity</h1>
            </Link>
            <nav className="flex gap-4 items-center">
              <ThemeSelector />
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground font-medium">
                    {user.username} <span className="text-primary ml-1">Lvl {user.level}</span>
                  </span>
                  <button 
                    onClick={logout}
                    className="text-sm font-semibold hover:text-primary transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-semibold hover:text-primary transition-colors">Login</Link>
                  <Link to="/register" className="px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all">Register</Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="flex-1 container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <LevelUpModal
          isOpen={showLevelUp}
          oldLevel={levelUpData.oldLevel}
          newLevel={levelUpData.newLevel}
          onClose={() => setShowLevelUp(false)}
        />
      </div>
    </Router>
  );
}

export default App;
