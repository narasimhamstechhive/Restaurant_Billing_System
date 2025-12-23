import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, UtensilsCrossed, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '../api/auth';

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen flex relative overflow-hidden" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Dark Overlay for Luxury Feel */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Left Side - Image (covered by background) */}
      <div className="flex-1 relative z-10">
        {/* Optional overlay content can go here if needed */}
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-12 relative z-10">
        <div className="w-full max-w-md border border-white/30 rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <UtensilsCrossed size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-white/80">
              Sign in to your restaurant dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="text-sm font-semibold text-white">Username</label>
              <div className="relative flex items-center">
                <User size={20} className="absolute left-4 text-white/60" />
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full py-3.5 px-4 pl-12 rounded-xl border-2 border-white/50 bg-transparent text-white placeholder:text-white/60 focus:outline-none focus:border-white focus:ring-4 focus:ring-white/20 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-semibold text-white">Password</label>
              <div className="relative flex items-center">
                <Lock size={20} className="absolute left-4 text-white/60" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full py-3.5 px-4 pl-12 pr-12 rounded-xl border-2 border-white/50 bg-transparent text-white placeholder:text-white/60 focus:outline-none focus:border-white focus:ring-4 focus:ring-white/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-100 p-3 rounded-xl text-sm text-center font-medium">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2 mt-2">
              <div className="relative flex items-center">
                <button
                  type="submit"
                  className="btn-17 w-full py-3.5 px-4 pl-12 text-lg uppercase flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  <span className="text-container">
                    <span className="text">
                      {loading ? 'Signing in...' : 'Sign In'}
                    </span>
                  </span>
                  {!loading && <LogIn size={20} className="relative z-10" />}
                </button>
                <style dangerouslySetInnerHTML={{
                  __html: `
                    .btn-17 {
                      border: 2px solid rgba(255,255,255,0.5);
                      box-sizing: border-box;
                      background-color: transparent;
                      color: #fff;
                      cursor: pointer;
                      font-weight: 600;
                      line-height: 1.5;
                      margin: 0;
                      padding: 0.875rem 1rem 0.875rem 3rem;
                      text-transform: uppercase;
                      border-radius: 0.75rem;
                      z-index: 0;
                      position: relative;
                      overflow: hidden;
                      width: 100%;
                      transition: all 0.3s ease;
                    }
                    .btn-17:hover {
                      border-color: #fff;
                      background-color: rgba(255,255,255,0.1);
                    }
                    .btn-17 .text-container {
                      display: block;
                      mix-blend-mode: difference;
                      position: relative;
                      overflow: hidden;
                    }
                    .btn-17 .text {
                      display: block;
                      position: relative;
                    }
                    .btn-17:hover .text {
                      animation: move-up-alternate 0.3s forwards;
                    }
                    @keyframes move-up-alternate {
                      0% { transform: translateY(0); }
                      50% { transform: translateY(80%); }
                      51% { transform: translateY(-80%); }
                      to { transform: translateY(0); }
                    }
                    .btn-17:before,
                    .btn-17:after {
                      --skew: 0.2;
                      background: #fff;
                      content: "";
                      display: block;
                      height: 102%;
                      left: calc(-50% - 50% * var(--skew));
                      pointer-events: none;
                      position: absolute;
                      top: -104%;
                      transform: skew(calc(150deg * var(--skew))) translateY(var(--progress, 0));
                      transition: transform 0.2s ease;
                      width: 100%;
                    }
                    .btn-17:after {
                      --progress: 0%;
                      left: calc(50% + 50% * var(--skew));
                      top: 102%;
                      z-index: -1;
                    }
                    .btn-17:hover:before {
                      --progress: 100%;
                    }
                    .btn-17:hover:after {
                      --progress: -102%;
                    }
                  `
                }} />
              </div>
            </div>
          </form>

          <div className="mt-8 text-center text-white/60 text-sm">
            <p>© 2025 MS Tech Hive School. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

