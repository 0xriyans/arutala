import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../context/toast-context';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className={`
              pointer-events-auto flex items-start gap-3 p-4 shadow-lg border
              ${toast.type === 'success' ? 'bg-muted border-cream text-foreground' : ''}
              ${toast.type === 'error' ? 'bg-red-50 border-red-100 text-red-900' : ''}
              ${toast.type === 'info' ? 'bg-background border-cream text-foreground' : ''}
            `}
          >
            <div className="mt-0.5 flex-shrink-0">
              {toast.type === 'success' && <CheckCircle2 size={16} className="text-foreground/70" />}
              {toast.type === 'error' && <AlertCircle size={16} className="text-red-700" />}
              {toast.type === 'info' && <Info size={16} className="text-foreground/70" />}
            </div>
            <p className="text-xs font-sans leading-relaxed pt-0.5">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
