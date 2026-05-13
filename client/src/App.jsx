import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const { user, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header className="p-4 border-b border-border glass-panel sticky top-0 z-50">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/">
              <h1 className="text-2xl font-bold gradient-text">TypoVelocity</h1>
            </Link>
            <nav className="flex gap-4 items-center">
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
      </div>
    </Router>
  );
}

export default App;
