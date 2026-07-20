import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User as UserIcon, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useToast } from '../context/toast-context';
import { useAuth } from '../context/auth-context';

export const RegisterRoute: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const { addToast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      window.location.hash = '#/';
    }
  }, [isAuthenticated]);

  useEffect(() => {
    document.title = "Register — ARUTALA";
    window.scrollTo({ top: 0 });
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      addToast('Password must be at least 8 characters.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password }),
      });

      if (response.ok) {
        addToast('Account created successfully! Please log in.', 'success');
        window.location.hash = '#/login';
      } else {
        const err = await response.json();
        addToast(err.detail || 'Failed to create account.', 'error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      addToast('A network error occurred. Please try again later.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_token: credentialResponse.credential }),
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
          addToast(`Welcome, ${user.name}`, 'success');
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
        addToast(err.detail || 'Google registration failed.', 'error');
      }
    } catch (error) {
      console.error('Google registration error:', error);
      addToast('A network error occurred during Google registration.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen pt-32 pb-24 flex items-center justify-center px-4" id="register-route-page">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md space-y-10"
      >
        <div className="text-center space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-foreground tracking-tight">
            Create <span className="italic font-normal">Account</span>
          </h1>
          <p className="text-xs text-gray-500 font-sans font-light">
            Join the atelier to manage your olfactory journey.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div className="relative">
              <UserIcon className="absolute left-0 top-1/2 -translate-y-1/2 text-foreground/30" size={18} />
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-b border-cream pl-8 pr-4 py-3 text-sm font-sans focus:outline-none focus:border-foreground transition-colors placeholder-foreground/40 text-foreground"
                required
              />
            </div>

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

          <div className="flex items-start gap-2">
            <input type="checkbox" className="accent-foreground w-3 h-3 border border-foreground/20 rounded-none bg-transparent mt-1 cursor-pointer" required />
            <span className="text-[10px] uppercase tracking-wider font-sans text-foreground/60 leading-relaxed">
              I agree to the <a href="#/terms" className="underline hover:text-foreground">Terms of Service</a> and <a href="#/privacy" className="underline hover:text-foreground">Privacy Policy</a>.
            </span>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-foreground text-background py-4 flex items-center justify-center gap-2 hover:bg-foreground/90 transition-colors group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span className="text-xs tracking-widest uppercase font-sans font-medium">Create Account</span>
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

        <div className="w-full flex justify-center py-2 bg-transparent border border-cream/30 hover:bg-white/5 transition-colors">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              addToast('Google login failed or was cancelled.', 'error');
            }}
            theme="filled_black"
            text="continue_with"
            shape="rectangular"
            size="large"
            width="350"
          />
        </div>

        <div className="text-center">
          <p className="text-[10px] tracking-wider uppercase font-sans text-foreground/60">
            Already have an account?{' '}
            <a href="#/login" className="text-foreground underline font-medium hover:text-accent-gold transition-colors">Log In</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
