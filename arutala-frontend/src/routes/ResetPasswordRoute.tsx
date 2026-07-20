import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../context/toast-context';
import { useAuth } from '../context/auth-context';

export const ResetPasswordRoute: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const { addToast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      window.location.hash = '#/';
    }
  }, [isAuthenticated]);

  useEffect(() => {
    document.title = "Reset Password — ARUTALA";
    window.scrollTo({ top: 0 });
    
    // Extract token from URL search params
    // Hash router logic: #/reset-password?token=...
    const hash = window.location.hash;
    if (hash.includes('?')) {
      const query = hash.split('?')[1];
      const params = new URLSearchParams(query);
      setToken(params.get('token'));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      addToast('Invalid or missing reset token.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: password }),
      });

      if (response.ok) {
        addToast('Password successfully reset.', 'success');
        setTimeout(() => {
          window.location.hash = '#/login';
        }, 1500);
      } else {
        const err = await response.json();
        addToast(err.detail || 'Failed to reset password.', 'error');
      }
    } catch (error) {
      addToast('A network error occurred. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="bg-background min-h-screen pt-32 pb-24 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="font-serif text-2xl text-foreground">Invalid Reset Link</p>
          <p className="text-sm font-sans text-foreground/60">Please request a new password reset link.</p>
          <a href="#/forgot-password" className="inline-block mt-4 underline text-xs uppercase tracking-widest text-foreground">
            Request Link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-32 pb-24 flex items-center justify-center px-4" id="reset-password-route-page">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md space-y-10"
      >
        <div className="text-center space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-foreground tracking-tight">
            Reset <span className="italic font-normal">Password</span>
          </h1>
          <p className="text-xs text-gray-500 font-sans font-light">
            Enter your new secure password below.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative flex items-center">
              <Lock className="absolute left-0 text-foreground/30" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="New Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-cream pl-8 pr-10 py-3 text-sm font-sans focus:outline-none focus:border-foreground transition-colors placeholder-foreground/40 text-foreground"
                required
                minLength={6}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 text-foreground/40 hover:text-foreground cursor-pointer transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading || password.length < 6}
            className={`w-full bg-foreground text-background py-4 flex items-center justify-center gap-2 transition-all duration-500 group ${isLoading || password.length < 6 ? 'opacity-80' : 'hover:bg-foreground/90'}`}
          >
            {isLoading ? (
              <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-medium">Updating...</span>
            ) : (
              <>
                <span className="text-xs tracking-widest uppercase font-sans font-medium">Update Password</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
