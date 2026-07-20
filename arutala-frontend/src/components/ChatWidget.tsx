import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, RotateCcw, CheckCircle2 } from 'lucide-react';
import { MiniProductCard } from './MiniProductCard';
import { useAuth } from '../context/auth-context';
import { useCart } from '../context/cart-context';
import { products } from '../data/products';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "Help me find my signature scent (Quiz)",
  "Recommend a fresh, everyday perfume",
  "I'm looking for a bold, evening fragrance",
  "Sweet and floral recommendations",
  "Woody and spicy recommendations",
  "Track my recent order",
  "What are fragrance notes?"
];

const getInitialMessage = (name?: string): Message => {
  if (name) {
    return { role: 'assistant', content: `Hello ${name}! I am your Arutala fragrance expert. How can I help you discover your perfect scent today, or perhaps you'd like to track an order?` };
  }
  return { role: 'assistant', content: 'Hello! I am your Arutala fragrance expert. How can I help you discover your perfect scent today, or perhaps you\'d like to track an order?' };
};

export const ChatWidget: React.FC = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  
  const initialMsg = getInitialMessage(user?.name);
  
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('arutala-chat-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      } catch (e) {
        return [initialMsg];
      }
    }
    return [initialMsg];
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Sync to local storage
  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('arutala-chat-history', JSON.stringify(messages));
  }, [messages, isOpen]);

  // Sync with backend DB if user is logged in
  useEffect(() => {
    if (user && user.id) {
      const syncHistory = async () => {
        try {
          const token = localStorage.getItem('arutala_token');
          // Try to fetch existing history from DB
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/chat/history`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.history && data.history.length > 0) {
              setMessages(data.history);
              return; // DB had history, loaded it.
            }
          }
          // If DB is empty but we have local messages, sync them UP to the DB
          if (messages.length > 1) {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/chat/history`, {
              method: 'POST',
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ history: messages })
            });
          }
        } catch (e) {
          console.error("Failed to sync chat history with DB", e);
        }
      };
      syncHistory();
    }
  }, [user?.id]); // Run only when user logs in

  // Update DB every time messages change if logged in
  useEffect(() => {
    if (user && user.id && messages.length > 1) {
      const saveToDb = async () => {
        try {
          const token = localStorage.getItem('arutala_token');
          await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/chat/history`, {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ history: messages })
          });
        } catch (e) {}
      };
      saveToDb();
    }
  }, [messages, user?.id]);

  const resetChat = () => {
    setMessages([getInitialMessage(user?.name)]);
    localStorage.removeItem('arutala-chat-history');
    if (user?.id) {
      // Clear DB history too
      const token = localStorage.getItem('arutala_token');
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/chat/history`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ history: [getInitialMessage(user?.name)] })
      });
    }
  };

  const handleAddToCart = (slug: string) => {
    const product = products.find(p => p.slug === slug);
    if (product) {
      addToCart(product, 1);
    }
  };

  const formatMessage = (content: string) => {
    // We need to parse [PRODUCT:slug] and [ADD_TO_CART:slug]
    const parts = content.split(/(\[(?:PRODUCT|ADD_TO_CART):[a-zA-Z0-9-]+\])/);
    
    return parts.map((part, index) => {
      if (part.startsWith('[PRODUCT:') && part.endsWith(']')) {
        const slug = part.substring(9, part.length - 1);
        return <MiniProductCard key={`prod-${index}`} slug={slug} />;
      }
      
      if (part.startsWith('[ADD_TO_CART:') && part.endsWith(']')) {
        const slug = part.substring(13, part.length - 1);
        // Automatically add to cart silently when this renders
        // However, React render should be pure. Use a button or a timeout hack.
        // It's safer to just render a small success widget, and trigger the action immediately
        useEffect(() => {
          handleAddToCart(slug);
        }, [slug]);

        return (
          <div key={`cart-${index}`} className="flex items-center gap-2 mt-2 mb-2 p-2 bg-accent-gold/10 border border-accent-gold/20 rounded-md">
            <CheckCircle2 size={16} className="text-accent-gold" />
            <span className="text-xs font-serif text-accent-gold">Item successfully added to your cart!</span>
          </div>
        );
      }
      
      return (
        <div key={index} className="space-y-2 markdown-styles">
          <ReactMarkdown 
            components={{
              p: ({node, ...props}) => <p className="mb-1" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
              li: ({node, ...props}) => <li className="mb-0.5" {...props} />,
              strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
              a: ({node, ...props}) => <a className="underline hover:text-accent-gold" {...props} />
            }}
          >
            {part}
          </ReactMarkdown>
        </div>
      );
    });
  };

  const handleSend = async (e?: React.FormEvent, customMsg?: string) => {
    e?.preventDefault();
    const msgToSend = customMsg || input;
    if (!msgToSend.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: msgToSend.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BOT_API_URL || 'http://localhost:8001'}/api/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages,
          customer_name: user?.name,
          customer_id: user?.id
        })
      });

      if (!response.ok) throw new Error('Failed to connect to stream');
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No readable stream');

      const decoder = new TextDecoder('utf-8');
      
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.substring(6);
            if (dataStr) {
              try {
                const data = JSON.parse(dataStr);
                if (data.text) {
                  setMessages(prev => {
                    const newMessages = [...prev];
                    const lastIndex = newMessages.length - 1;
                    newMessages[lastIndex] = { 
                      ...newMessages[lastIndex], 
                      content: newMessages[lastIndex].content + data.text 
                    };
                    return newMessages;
                  });
                }
              } catch (e) {
                // Ignore parsing errors for partial chunks
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'I apologize, but I seem to be having trouble connecting to my fragrance knowledge base right now. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="bg-background border border-foreground/20 shadow-2xl rounded-sm w-[350px] h-[500px] mb-4 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-foreground text-background p-4 flex justify-between items-center">
              <div>
                <h3 className="font-serif font-medium">Arutala Assistant</h3>
                <p className="text-[10px] font-sans uppercase tracking-widest opacity-70">Fragrance Expert</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={resetChat}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                  title="Reset Chat"
                >
                  <RotateCcw size={16} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-background custom-scrollbar space-y-4 overflow-x-hidden">
              <AnimatePresence mode="popLayout">
              {messages.map((msg, idx) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 20, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.05 }}
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}
                >
                  <div 
                    className={`max-w-[85%] p-3 text-xs font-sans leading-relaxed rounded-sm ${
                      msg.role === 'user' 
                        ? 'bg-foreground text-background' 
                        : 'bg-muted text-foreground border border-foreground/10'
                    }`}
                  >
                    {formatMessage(msg.content)}
                  </div>
                </motion.div>
              ))}
              </AnimatePresence>
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 10, x: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="flex justify-start w-full"
                >
                  <div className="bg-muted border border-foreground/10 px-4 py-3 rounded-sm flex space-x-1.5 items-center h-[38px]">
                    <motion.div className="w-1.5 h-1.5 bg-foreground/50 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0 }} />
                    <motion.div className="w-1.5 h-1.5 bg-foreground/50 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 }} />
                    <motion.div className="w-1.5 h-1.5 bg-foreground/50 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Quick Replies */}
            {messages.length === 1 && (
              <div className="px-3 pb-2 flex flex-wrap gap-2 justify-end">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(undefined, q)}
                    disabled={isLoading}
                    className="text-[10px] bg-muted/50 border border-foreground/20 hover:bg-foreground hover:text-background transition-colors rounded-full px-3 py-1.5"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 border-t border-foreground/10 bg-background flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a fragrance..."
                className="flex-1 bg-muted border border-foreground/10 px-3 py-2 text-xs font-sans focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/50 rounded-sm"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-foreground text-background px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-foreground/90 transition-colors rounded-sm"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        initial={false}
        animate={{
          scale: isOpen ? 1 : [1, 1.02, 1],
          boxShadow: isOpen 
            ? "0px 10px 30px rgba(0,0,0,0.15)" 
            : ["0px 10px 30px rgba(0,0,0,0.1)", "0px 10px 40px rgba(0,0,0,0.25)", "0px 10px 30px rgba(0,0,0,0.1)"]
        }}
        transition={{
          duration: 3,
          repeat: isOpen ? 0 : Infinity,
          ease: "easeInOut"
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-foreground/75 backdrop-blur-md border border-cream/20 text-cream shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-full flex items-center justify-center relative overflow-hidden transition-all hover:bg-foreground/85"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'close' : 'open'}
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute flex items-center justify-center w-full h-full"
          >
            {isOpen ? <X size={24} /> : (
              <div className="relative flex items-center justify-center w-full h-full">
                <MessageCircle size={24} strokeWidth={1.5} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
