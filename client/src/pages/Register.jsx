import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { User, Lock, Mail, Keyboard, ArrowRight } from 'lucide-react';

/**
 * Register Page Component
 * Handles new user registration with modern visual styles
 */
const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const { register, isLoading, error, user } = useAuthStore();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate('/');
    } catch (_) {
      // Error is handled by store
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 relative select-none">
      {/* Decorative background glow circles */}
      <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="w-full max-w-md p-8 rounded-2xl bg-card border border-white/5 shadow-2xl relative overflow-hidden flex flex-col backdrop-blur-xl"
      >
        {/* Glow Bar on Top */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary to-blue-500" />

        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20 mb-3 shadow-[0_0_15px_rgba(167,139,250,0.15)]">
            <Keyboard className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black gradient-text">Create Account</h2>
          <p className="text-muted-foreground text-xs font-mono mt-1 uppercase tracking-widest">Sign up to compete & earn XP</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 bg-red-500/10 text-red-400 rounded-xl text-xs font-mono text-center border border-red-500/20"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono pl-1">
              Username
            </label>
            <div 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.01] border transition-all duration-200 ${
                focusedInput === 'username' 
                  ? 'border-primary/50 bg-white/[0.03] shadow-[0_0_15px_rgba(167,139,250,0.15)]' 
                  : 'border-white/5 hover:border-white/10'
              }`}
            >
              <User className={`w-4 h-4 transition-colors ${focusedInput === 'username' ? 'text-primary' : 'text-muted-foreground'}`} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocusedInput('username')}
                onBlur={() => setFocusedInput(null)}
                placeholder="Pick a username"
                className="bg-transparent border-none outline-none w-full text-foreground text-sm font-medium placeholder:text-muted-foreground/50"
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono pl-1">
              Email Address
            </label>
            <div 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.01] border transition-all duration-200 ${
                focusedInput === 'email' 
                  ? 'border-primary/50 bg-white/[0.03] shadow-[0_0_15px_rgba(167,139,250,0.15)]' 
                  : 'border-white/5 hover:border-white/10'
              }`}
            >
              <Mail className={`w-4 h-4 transition-colors ${focusedInput === 'email' ? 'text-primary' : 'text-muted-foreground'}`} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                placeholder="name@example.com"
                className="bg-transparent border-none outline-none w-full text-foreground text-sm font-medium placeholder:text-muted-foreground/50"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono pl-1">
              Password
            </label>
            <div 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.01] border transition-all duration-200 ${
                focusedInput === 'password' 
                  ? 'border-primary/50 bg-white/[0.03] shadow-[0_0_15px_rgba(167,139,250,0.15)]' 
                  : 'border-white/5 hover:border-white/10'
              }`}
            >
              <Lock className={`w-4 h-4 transition-colors ${focusedInput === 'password' ? 'text-primary' : 'text-muted-foreground'}`} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
                placeholder="Create a strong password"
                className="bg-transparent border-none outline-none w-full text-foreground text-sm font-medium placeholder:text-muted-foreground/50"
                required
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-6 bg-gradient-to-r from-primary to-blue-600 text-white font-extrabold rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 hover:shadow-primary/30 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? 'Creating Account...' : 'Get Started'}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="mt-8 text-center text-muted-foreground text-xs font-medium">
          Already registered?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
