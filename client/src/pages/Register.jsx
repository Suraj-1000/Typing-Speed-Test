import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      // Error is handled by store
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 rounded-2xl glass-panel"
      >
        <h2 className="text-3xl font-bold mb-6 text-center gradient-text">Create Account</h2>
        {error && <div className="mb-4 p-3 bg-destructive/20 text-red-400 rounded-lg text-sm text-center border border-destructive/50">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-6 text-center text-muted-foreground text-sm">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Login here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
