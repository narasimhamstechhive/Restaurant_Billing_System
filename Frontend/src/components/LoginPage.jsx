import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, UtensilsCrossed } from 'lucide-react';
import { loginUser } from '../api/auth';

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await loginUser({ username, password });
      onLoginSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary-hover p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-surface w-full max-w-md p-12 rounded-3xl shadow-2xl border border-border"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <UtensilsCrossed size={32} />
          </div>
          <h1 className="text-3xl font-bold text-text-main mb-2">RestoBill</h1>
          <p className="text-text-muted">Sign in to manage your restaurant</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-sm font-medium text-text-muted">Username</label>
            <div className="relative flex items-center">
              <User size={20} className="absolute left-4 text-text-muted" />
              <input 
                type="text" 
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full py-3.5 px-4 pl-12 rounded-xl border border-border bg-background text-text-main focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-text-muted/50"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-text-muted">Password</label>
            <div className="relative flex items-center">
              <Lock size={20} className="absolute left-4 text-text-muted" />
              <input 
                type="password" 
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full py-3.5 px-4 pl-12 rounded-xl border border-border bg-background text-text-main focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-text-muted/50"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="bg-danger/10 text-danger p-3 rounded-lg text-sm text-center font-medium"
            >
              {error}
            </motion.div>
          )}

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 mt-4 hover:bg-primary-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
            disabled={loading}
          >
            {loading ? 'Signing in...' : (
              <>
                <span>Sign In</span>
                <LogIn size={20} />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-10 text-center text-text-muted text-sm">
          <p>MS Tech Hive School &copy; 2025</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
