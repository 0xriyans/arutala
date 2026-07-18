import React, { useState, useEffect } from 'react';
import { Package, Search, ArrowRight, CheckCircle2, Clock, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatRupiah } from '../data/products';

interface TrackedOrder {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  items: any[];
  total: number;
  shipping: any;
}

export const TrackOrderRoute: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<TrackedOrder | null>(null);

  useEffect(() => {
    document.title = "Track Order — ARUTALA";
    window.scrollTo({ top: 0 });
    
    // Check if order ID is in URL params
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const urlOrderId = params.get('id');
    if (urlOrderId) {
      setOrderId(urlOrderId);
      handleTrack(null, urlOrderId);
    }
  }, []);

  const handleTrack = (e: React.FormEvent | null, forceId?: string) => {
    if (e) e.preventDefault();
    
    const idToSearch = forceId || orderId;
    if (!idToSearch) return;

    setIsSearching(true);
    setSearched(false);
    setResult(null);

    // Simulate network delay
    setTimeout(() => {
      // Mock lookup from localStorage (if any) or generate dummy data for demo
      try {
        const storedOrdersStr = localStorage.getItem('arutala_orders');
        if (storedOrdersStr) {
          const storedOrders = JSON.parse(storedOrdersStr);
          const found = storedOrders.find((o: any) => o.id === idToSearch || o.id === `#${idToSearch}`);
          if (found) {
            setResult(found);
            setIsSearching(false);
            setSearched(true);
            return;
          }
        }
      } catch (err) {}

      // If not found in localStorage, let's just mock a success for ANY format that looks like an order ID
      // so the demo looks good even if they type a random one.
      if (idToSearch.length > 5) {
        setResult({
          id: idToSearch.startsWith('#') ? idToSearch : `#${idToSearch.toUpperCase()}`,
          date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
          status: 'Processing',
          items: [{ name: 'Santal Blanc', quantity: 1, price: 2150000 }],
          total: 2150000,
          shipping: { address: 'Demo Address, Jakarta' }
        });
      } else {
        setResult(null); // Too short, invalid
      }
      
      setIsSearching(false);
      setSearched(true);
    }, 1200);
  };

  const renderStatusIcon = (status: string) => {
    switch(status) {
      case 'Processing': return <Clock size={24} className="text-accent-gold" />;
      case 'Shipped': return <Truck size={24} className="text-blue-500" />;
      case 'Delivered': return <CheckCircle2 size={24} className="text-green-500" />;
      default: return <Package size={24} className="text-gray-400" />;
    }
  };

  return (
    <div className="bg-background min-h-screen pt-32 pb-24" id="track-order-page">
      <div className="max-w-3xl mx-auto px-6 md:px-12 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-6">
          <p className="text-[10px] tracking-[0.4em] uppercase font-sans font-medium text-foreground/40">
            Guest Services
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground tracking-tight">
            Track Your <span className="italic text-accent-gold">Order</span>
          </h1>
          <p className="text-sm font-sans text-foreground/60 font-light max-w-md mx-auto">
            Enter your order reference number to check the current status of your shipment.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleTrack} className="bg-cream/20 border border-cream p-6 md:p-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] tracking-wider uppercase font-sans text-foreground/60 font-medium">Order Reference (e.g. #ORD-123)</label>
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input
                  type="text"
                  required
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Order ID"
                  className="w-full bg-transparent border border-cream pl-10 pr-4 py-3 text-sm font-sans focus:outline-none focus:border-foreground transition-colors text-foreground"
                />
              </div>
              <p className="text-[10px] text-foreground/40 font-sans italic mt-1">Hint: Try #ORD-123 for a demo</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] tracking-wider uppercase font-sans text-foreground/60 font-medium">Email Address (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email used for checkout"
                className="w-full bg-transparent border border-cream px-4 py-3 text-sm font-sans focus:outline-none focus:border-foreground transition-colors text-foreground"
              />
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full bg-foreground text-background py-4 text-xs tracking-[0.2em] font-sans font-medium uppercase hover:bg-foreground/90 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-wait"
            >
              <span>{isSearching ? 'Locating Order...' : 'Track Order'}</span>
              {!isSearching && <ArrowRight size={14} />}
            </button>
          </div>
        </form>

        {/* Results */}
        <AnimatePresence>
          {searched && !isSearching && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12"
            >
              {result ? (
                <div className="border border-cream bg-background p-6 md:p-10 space-y-8 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cream pb-6">
                    <div>
                      <p className="text-[10px] tracking-widest uppercase font-sans text-foreground/50 mb-1">Order Details</p>
                      <h3 className="font-serif text-2xl text-foreground">{result.id}</h3>
                      <p className="text-xs font-sans text-foreground/50 mt-1">Placed on {result.date}</p>
                    </div>
                    <div className="flex items-center space-x-3 bg-cream/30 px-4 py-2 border border-cream">
                      {renderStatusIcon(result.status)}
                      <span className="text-sm font-sans font-medium uppercase tracking-wider text-foreground">
                        {result.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] tracking-widest uppercase font-sans text-foreground/50 border-b border-cream pb-2">Items Included</h4>
                    <div className="space-y-4">
                      {result.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm font-sans">
                          <span className="text-foreground"><span className="text-foreground/50 mr-2">{item.quantity}x</span> {item.name}</span>
                          <span className="text-foreground/70">{formatRupiah(item.price)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-cream pt-4 flex justify-between items-center">
                      <span className="text-xs font-sans uppercase tracking-widest text-foreground/60">Total</span>
                      <span className="font-serif text-lg text-foreground">{formatRupiah(result.total)}</span>
                    </div>
                  </div>
                  
                  {result.shipping && (
                     <div className="bg-muted p-4 border border-cream text-xs font-sans text-foreground/70 space-y-1">
                       <p className="font-semibold text-foreground mb-2">Shipping Destination:</p>
                       <p>{result.shipping.address}</p>
                     </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-cream">
                  <Package size={32} className="mx-auto text-foreground/20 mb-4" />
                  <h3 className="font-serif text-xl text-foreground mb-2">Order Not Found</h3>
                  <p className="text-sm font-sans text-foreground/60 max-w-sm mx-auto">
                    We couldn't locate an order with that reference number. Please check your confirmation email and try again.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
