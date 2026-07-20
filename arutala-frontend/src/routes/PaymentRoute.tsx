import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/cart-context';
import { formatRupiah } from '../data/products';
import { Lock, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';

export const PaymentRoute: React.FC = () => {
  const { clearCart } = useCart();
  const snapContainerRef = useRef<HTMLDivElement>(null);
  const snapEmbedded = useRef<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Parse URL parameters
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(hash.split('?')[1]);
    const token = urlParams.get('token');
    const orderId = urlParams.get('order_id');

    if (!token || !orderId) {
      setError('Invalid payment session. Missing token or order ID.');
      setLoading(false);
      return;
    }

    // Fetch order details
    const fetchOrder = async () => {
      try {
        const authToken = localStorage.getItem('arutala_token');
        const res = await fetch(`/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
          
          // If already paid, redirect
          if (data.payment_status === 'paid' || data.payment_status === 'settlement') {
             window.location.hash = `#/track-order?id=${orderId}`;
             return;
          }
        }
      } catch (err) {
        console.error('Failed to fetch order', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();

    return () => {
      if (window.snap?.hide) {
        try { window.snap.hide(); } catch (e) {}
      }
    };
  }, [clearCart]);

  // Effect to embed snap only after loading is false and container is present
  useEffect(() => {
    if (!loading && !error && order && !snapEmbedded.current) {
      // Small timeout to ensure React has fully painted the DOM element
      const timer = setTimeout(() => {
        if (window.snap && snapContainerRef.current && !snapEmbedded.current) {
          try {
            snapEmbedded.current = true;
            window.snap.embed(new URLSearchParams(window.location.hash.split('?')[1]).get('token') as string, {
              embedId: 'snap-container-page',
              onSuccess: () => {
                clearCart();
                window.location.hash = `#/track-order?id=${order.id}`;
              },
              onPending: () => {
                clearCart();
                window.location.hash = `#/track-order?id=${order.id}`;
              },
              onError: () => {
                setError('Payment failed. Please try again.');
              }
            });
          } catch (err) {
            console.error('Snap embed error:', err);
            snapEmbedded.current = false;
            setError('Failed to load payment module.');
          }
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, error, order, clearCart]);

  return (
    <div className="bg-[#0a0a0a] min-h-screen relative overflow-x-hidden flex flex-col" id="payment-route-page">
      {/* Ambient glowing background effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent-gold/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-white/5 blur-[100px] pointer-events-none" />

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl pt-32 pb-24 flex-grow z-10 relative">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
            <Lock size={12} className="text-accent-gold" />
            <span className="text-[10px] tracking-[0.3em] uppercase font-sans font-medium text-white/70">
              Secure Checkout
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-white font-light mb-4 tracking-tight">
            Complete Your <span className="italic text-accent-gold">Payment</span>
          </h1>
          <p className="font-sans text-white/60 max-w-lg mx-auto text-sm leading-relaxed">
            Almost there! Please choose your preferred payment method below to finalize your purchase. Your transaction is protected by bank-grade encryption.
          </p>
        </div>
        
        {loading ? (
           <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-gold"></div>
           </div>
        ) : error ? (
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-12 text-center max-w-2xl mx-auto shadow-2xl">
            <p className="text-red-400 font-sans mb-8 text-lg">{error}</p>
            <button 
              onClick={() => window.location.hash = '#/'}
              className="bg-white text-black py-4 px-10 text-xs tracking-[0.2em] font-sans font-medium uppercase hover:bg-gray-200 transition-all duration-300 rounded-sm"
            >
              Return to Home
            </button>
          </div>
        ) : (
          <>
            <div className={`grid ${order ? 'grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12' : 'grid-cols-1 max-w-md mx-auto'} items-start`}>
            
            {/* Left Column: Order Summary (Only shown if order data exists) */}
            {order && (
              <div className="lg:col-span-6 order-2 lg:order-1">
                <div className="sticky top-32 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 lg:p-10 shadow-2xl">
                  
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                    <h3 className="text-sm tracking-[0.2em] uppercase font-sans font-medium text-white">
                      Order Summary
                    </h3>
                    <span className="text-[10px] bg-accent-gold/20 text-accent-gold px-3 py-1 rounded-full uppercase tracking-wider">
                      {order.order_ref || `#${order.id}`}
                    </span>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Items List */}
                    <div className="space-y-5">
                      {order.items?.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-start text-sm font-sans text-white/80 group">
                          <div className="flex items-start gap-4">
                            <div className="bg-white/10 w-8 h-8 flex items-center justify-center rounded-md text-xs font-medium text-white group-hover:bg-accent-gold group-hover:text-black transition-colors">
                              {item.quantity}x
                            </div>
                            <span className="leading-snug mt-1 max-w-[180px]">{item.productName || item.name}</span>
                          </div>
                          <span className="mt-1 font-medium">{formatRupiah(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-white/10 pt-6 space-y-4 text-sm font-sans text-white/60">
                      <div className="flex justify-between items-center">
                        <span>Subtotal</span>
                        <span className="text-white/90">{formatRupiah(order.total - order.shipping_cost)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Shipping ({order.shipping_courier})</span>
                        <span className="text-white/90">{formatRupiah(order.shipping_cost)}</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-white/20 pt-6 mt-2 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Total Due</p>
                        <p className="text-white font-medium text-2xl tracking-tight">{formatRupiah(order.total)}</p>
                      </div>
                    </div>
                    
                    <div className="pt-8 mt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck size={14} className="text-accent-gold" />
                        <p className="text-[10px] uppercase tracking-widest font-sans text-white/70">Customer Details</p>
                      </div>
                      <div className="bg-black/20 rounded-lg p-4 text-sm font-sans text-white/70 space-y-1 border border-white/5">
                        <p className="text-white font-medium">{order.customer_name}</p>
                        <p>{order.customer_address}</p>
                        <p>{order.customer_city}, {order.customer_postalCode}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Right Column: Payment Gateway */}
            <div className={`${order ? 'lg:col-span-6 flex flex-col justify-center' : 'col-span-1'} order-1 lg:order-2`}>
              
              <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden border border-white/10 relative transform transition-all hover:scale-[1.01] duration-500 mx-auto">
                {/* Custom top bar to blend Midtrans nicely */}
                <div className="bg-[#f8f9fa] border-b border-gray-200 p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard size={18} className="text-gray-400" />
                    <span className="text-[11px] font-sans font-semibold text-gray-700 uppercase tracking-widest">
                      Payment Gateway
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                  </div>
                </div>
                
                <div 
                  id="snap-container-page" 
                  ref={snapContainerRef}
                  className="w-full min-h-[500px] bg-white flex items-center justify-center"
                >
                  {/* If the iframe hasn't loaded yet, show a loader */}
                  {!window.snap && (
                    <div className="flex flex-col items-center justify-center space-y-4 py-20 text-gray-400">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-gold"></div>
                      <span className="text-xs font-sans tracking-widest uppercase">Loading Gateway...</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center justify-center text-center px-4">
                <p className="text-[10px] text-white/40 font-sans tracking-widest uppercase mb-1">Guaranteed Safe & Secure</p>
                <p className="text-xs text-white/30 font-sans">Powered by Midtrans Payment Gateway</p>
              </div>
              
              {!order && (
                <div className="mt-8 text-center flex flex-col items-center justify-center space-y-2">
                   <Lock size={16} className="text-white/30" />
                   <p className="text-xs text-white/40 font-sans tracking-wide">Order details are protected. Please complete your payment above.</p>
                </div>
              )}
            </div>
            
          </div>
          
          <div className="mt-16 md:mt-24 border-t border-white/10 pt-10 flex flex-col items-center justify-center text-center max-w-lg mx-auto px-4">
            <p className="font-serif italic text-accent-gold/80 text-xl mb-3">"Every great journey begins with a single scent."</p>
            <p className="font-sans text-white/50 text-sm leading-relaxed">
              We are carefully preparing your chosen fragrances to become a part of your story. Thank you for choosing Arutala.
            </p>
          </div>
          </>
        )}
      </div>
    </div>
  );
};
