import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from '../context/toast-context';
import { useAuth } from '../context/auth-context';

export const ForgotPasswordRoute: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { addToast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      window.location.hash = '#/';
    }
  }, [isAuthenticated]);

  useEffect(() => {
    document.title = "Forgot Password — ARUTALA";
    window.scrollTo({ top: 0 });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSuccess(true);
        addToast('Password reset link has been generated.', 'success');
      } else {
        const err = await response.json();
        addToast(err.detail || 'Failed to request password reset.', 'error');
      }
    } catch (error) {
      addToast('A network error occurred. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen pt-32 pb-24 flex items-center justify-center px-4" id="forgot-password-route-page">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md space-y-10"
      >
        <div className="text-center space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-foreground tracking-tight">
            Forgot <span className="italic font-normal">Password</span>
          </h1>
          <p className="text-xs text-gray-500 font-sans font-light">
            Enter your email to receive a reset link.
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-cream/10 border border-cream p-6 text-center space-y-4">
            <p className="text-sm font-sans text-foreground">
              A recovery link has been generated for <strong>{email}</strong>.
            </p>
            <p className="text-xs text-foreground/60">
              (For this demo, please check the backend terminal for the simulated email containing the reset link).
            </p>
            <a 
              href="#/login"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-sans font-medium text-foreground hover:text-foreground/70 transition-colors pt-4"
            >
              <ArrowLeft size={14} /> Back to Login
            </a>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-cream pl-8 pr-4 py-3 text-sm font-sans focus:outline-none focus:border-foreground transition-colors placeholder-foreground/40 text-foreground"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading || !email}
              className={`w-full bg-foreground text-background py-4 flex items-center justify-center gap-2 transition-all duration-500 group ${isLoading || !email ? 'opacity-80' : 'hover:bg-foreground/90'}`}
            >
              {isLoading ? (
                <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-medium">Processing...</span>
              ) : (
                <>
                  <span className="text-xs tracking-widest uppercase font-sans font-medium">Send Reset Link</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="text-center">
              <a href="#/login" className="text-[10px] uppercase tracking-wider font-sans text-foreground/60 hover:text-foreground underline transition-colors">
                Return to login
              </a>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
