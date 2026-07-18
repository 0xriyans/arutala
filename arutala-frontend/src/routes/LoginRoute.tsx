import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Info, Eye, EyeOff, Loader2 } from 'lucide-react';
import { dummyUsers } from '../data/users';
import { useAuth } from '../context/auth-context';
import { useToast } from '../context/toast-context';

export const LoginRoute: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    document.title = "Login — ARUTALA";
    window.scrollTo({ top: 0 });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Fetch user info using the new token
        const meResponse = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${data.access_token}`
          }
        });
        
        if (meResponse.ok) {
          const user = await meResponse.json();
          login(user, data.access_token);
          addToast(`Welcome back, ${user.name}`, 'success');
          if (user.role === 'admin') {
            window.location.hash = '#/admin';
          } else {
            window.location.hash = '#/profile';
          }
        } else {
          addToast('Failed to fetch user data.', 'error');
        }
      } else {
        const err = await response.json();
        addToast(err.detail || 'Invalid email or password. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      addToast('A network error occurred. Please try again later.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen pt-32 pb-24 flex items-center justify-center px-4" id="login-route-page">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md space-y-10"
      >
        <div className="text-center space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-foreground tracking-tight">
            Welcome <span className="italic font-normal">Back</span>
          </h1>
          <p className="text-xs text-gray-500 font-sans font-light">
            Enter your details to access your atelier account.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
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
            
            <div className="relative flex items-center">
              <Lock className="absolute left-0 text-foreground/30" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-cream pl-8 pr-10 py-3 text-sm font-sans focus:outline-none focus:border-foreground transition-colors placeholder-foreground/40 text-foreground"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 text-foreground/40 hover:text-foreground cursor-pointer transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="accent-foreground w-3 h-3 border border-foreground/20 rounded-none bg-transparent" />
              <span className="text-[10px] uppercase tracking-wider font-sans text-foreground/60 group-hover:text-foreground transition-colors">Remember Me</span>
            </label>
            <a href="#/forgot-password" className="text-[10px] uppercase tracking-wider font-sans text-foreground/60 hover:text-foreground underline transition-colors">
              Forgot Password?
            </a>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full bg-foreground text-background py-4 flex items-center justify-center gap-2 transition-all duration-500 group ${isLoading ? 'opacity-80' : 'hover:bg-foreground/90'}`}
          >
            {isLoading ? (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="text-[10px] tracking-[0.25em] uppercase font-sans font-medium"
              >
                Authenticating...
              </motion.span>
            ) : (
              <>
                <span className="text-xs tracking-widest uppercase font-sans font-medium">Sign In</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="relative flex items-center justify-center py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-cream"></div>
          </div>
          <span className="relative bg-background px-4 text-[10px] uppercase tracking-widest font-sans text-foreground/40">Or</span>
        </div>

        <button 
          type="button"
          className="w-full bg-transparent border border-cream text-foreground py-4 flex items-center justify-center gap-3 hover:bg-muted transition-colors"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="text-xs tracking-widest uppercase font-sans font-medium">Continue with Google</span>
        </button>

        <div className="text-center">
          <p className="text-[10px] tracking-wider uppercase font-sans text-foreground/60">
            Don't have an account?{' '}
            <a href="#/register" className="text-foreground underline font-medium hover:text-accent-gold transition-colors">Register</a>
          </p>
        </div>

        {/* Dummy Credentials Hint */}
        <div className="mt-8 bg-muted border border-cream p-4 space-y-3">
          <div className="flex items-center gap-2 text-foreground/60">
            <Info size={14} />
            <span className="text-[10px] uppercase tracking-widest font-sans font-medium">Testing Credentials</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs font-sans">
            <div>
              <p className="font-medium text-foreground">Admin Login:</p>
              <p className="text-foreground/60 select-all">admin@arutala.com</p>
              <p className="text-foreground/60 select-all">admin123</p>
            </div>
            <div>
              <p className="font-medium text-foreground">User Login:</p>
              <p className="text-foreground/60 select-all">user@arutala.com</p>
              <p className="text-foreground/60 select-all">user1234</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
