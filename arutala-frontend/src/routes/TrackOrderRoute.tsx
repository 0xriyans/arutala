import React, { useState, useEffect } from 'react';
import { Package, Search, ArrowRight, CheckCircle2, Clock, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatRupiah } from '../data/products';

interface TrackedOrder {
  id: string;
  date: string;
  status: string;
  payment_status: string;
  items: any[];
  total: number;
  customer_address: string;
  customer_city: string;
  customer_postalCode: string;
  tracking_number?: string;
  shipping_courier?: string;
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

    const fetchOrderData = async () => {
      try {
        const res = await fetch(`/api/orders/track/${idToSearch}`);
        
        if (res.ok) {
          const data = await res.json();
          // Format date if exists
          const formattedDate = data.date ? new Date(data.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Unknown';
          
          setResult({
            id: data.order_ref || data.id,
            date: formattedDate,
            status: data.status,
            payment_status: data.payment_status,
            items: data.items,
            total: data.total,
            customer_address: data.customer_address,
            customer_city: data.customer_city,
            customer_postalCode: data.customer_postalCode,
            tracking_number: data.tracking_number,
            shipping_courier: data.shipping_courier
          });
        } else {
          setResult(null);
        }
      } catch (err) {
        console.error("Failed to fetch order", err);
        setResult(null);
      } finally {
        setIsSearching(false);
        setSearched(true);
      }
    };
    
    fetchOrderData();
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
              <label className="text-[10px] tracking-wider uppercase font-sans text-foreground/60 font-medium">Order Reference (e.g. INV-240718-00001)</label>
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
              <p className="text-[10px] text-foreground/40 font-sans italic mt-1">Hint: Check your confirmation email for the order reference</p>
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
                      <div className="flex flex-col">
                        <span className="text-sm font-sans font-medium uppercase tracking-wider text-foreground">
                          {result.status}
                        </span>
                        <span className="text-[10px] font-sans text-foreground/60 uppercase tracking-widest mt-1 border-t border-cream pt-1">
                          Payment: {result.payment_status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {result.tracking_number && (
                    <div className="bg-[#0a0a0a] border border-[#d4af37]/30 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] tracking-widest uppercase font-sans text-[#d4af37] mb-1">Tracking Resi ({result.shipping_courier || 'Courier'})</p>
                        <p className="font-mono text-xl text-foreground tracking-wider">{result.tracking_number}</p>
                      </div>
                      <div className="mt-4 md:mt-0 flex items-center space-x-4">
                        <a 
                          href={`https://cekresi.com/?noresi=${result.tracking_number}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-[#d4af37] text-background px-4 py-2 text-xs font-sans font-medium uppercase tracking-wider hover:bg-[#b0902c] transition-colors"
                        >
                          TRACK PACKAGE
                        </a>
                        <div className="text-right hidden md:block">
                          <Truck size={24} className="text-[#d4af37]/50 inline-block" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    <h4 className="text-[10px] tracking-widest uppercase font-sans text-foreground/50 border-b border-cream pb-2">Items Included</h4>
                    <div className="space-y-4">
                      {result.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm font-sans">
                          <span className="text-foreground"><span className="text-foreground/50 mr-2">{item.quantity}x</span> {item.productName || item.name}</span>
                          <span className="text-foreground/70">{formatRupiah(item.price)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-cream pt-4 flex justify-between items-center">
                      <span className="text-xs font-sans uppercase tracking-widest text-foreground/60">Total</span>
                      <span className="font-serif text-lg text-foreground">{formatRupiah(result.total)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 border border-cream text-xs font-sans text-foreground/70 space-y-1">
                    <p className="font-semibold text-foreground mb-2">Shipping Destination:</p>
                    <p>{result.customer_address}</p>
                    <p>{result.customer_city}, {result.customer_postalCode}</p>
                  </div>
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
