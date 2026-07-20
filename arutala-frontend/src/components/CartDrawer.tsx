import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard, CheckCircle2, Tag, Truck, Loader2 } from 'lucide-react';
import { useCart } from '../context/cart-context';
import { ProgressiveImage } from './ProgressiveImage';
import { formatRupiah } from '../data/products';
import { useAuth } from '../context/auth-context';

// TypeScript declarations for Midtrans Snap
declare global {
  interface Window {
    snap: {
      pay: (token: string, options: {
        onSuccess?: (result: any) => void;
        onPending?: (result: any) => void;
        onError?: (result: any) => void;
        onClose?: () => void;
      }) => void;
      embed: (token: string, options: {
        embedId: string;
        onSuccess?: (result: any) => void;
        onPending?: (result: any) => void;
        onError?: (result: any) => void;
      }) => void;
      hide: () => void;
    };
  }
}

interface Province {
  province_id: string;
  province: string;
}

interface City {
  city_id: string;
  city_name: string;
  type: string;
  postal_code: string;
}

interface ShippingService {
  service: string;
  description: string;
  cost: { value: number; etd: string; note: string }[];
}

export const CartDrawer: React.FC = () => {
  const {
    cartItems,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    cartTotal,
    clearCart,
    appliedPromoCode,
    applyPromoCode,
    removePromoCode,
    promoDiscount,
    cartFinalTotal,
    activePromosApplied,
    addToCart,
  } = useCart();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'success'>('cart');
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
  const [shippingForm, setShippingForm] = useState({
    name: '',
    email: '',
    recipientName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setShippingForm(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        recipientName: prev.recipientName || user.name || prev.name,
        phone: (user as any).phone || prev.phone,
        address: (user as any).address || prev.address,
        postalCode: (user as any).postalCode || prev.postalCode,
      }));
    }
  }, [user]);

  // RajaOngkir state
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState('');
  const [selectedCityId, setSelectedCityId] = useState('');
  const [shippingServices, setShippingServices] = useState<ShippingService[]>([]);
  const [selectedShippingCost, setSelectedShippingCost] = useState(0);
  const [selectedShippingLabel, setSelectedShippingLabel] = useState('');
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    setPromoSuccess(null);
    if (!promoInput.trim()) return;

    const res = applyPromoCode(promoInput);
    if (res.success) {
      setPromoSuccess(res.message);
      setPromoInput('');
    } else {
      setPromoError(res.message);
    }
  };

  const handleRemovePromo = () => {
    removePromoCode();
    setPromoSuccess(null);
    setPromoError(null);
  };

  // Body scroll lock while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Reset checkout step when drawer is closed
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setCheckoutStep('cart');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const res = await fetch('/api/shipping/provinces');
        const data = await res.json();
        if (data?.rajaongkir?.results) {
          setProvinces(data.rajaongkir.results);
        }
      } catch (err) { console.error('Failed to fetch provinces', err); }
      setLoadingProvinces(false);
    };
    fetchProvinces();
  }, []);

  // Fetch cities when province changes
  useEffect(() => {
    if (!selectedProvinceId) { setCities([]); return; }
    const fetchCities = async () => {
      setLoadingCities(true);
      setSelectedCityId('');
      setCities([]);
      setShippingServices([]);
      setSelectedShippingCost(0);
      setSelectedShippingLabel('');
      try {
        const res = await fetch(`/api/shipping/cities?province_id=${selectedProvinceId}`);
        const data = await res.json();
        if (data?.rajaongkir?.results) {
          setCities(data.rajaongkir.results);
        }
      } catch (err) { console.error('Failed to fetch cities', err); }
      setLoadingCities(false);
    };
    fetchCities();
  }, [selectedProvinceId]);

  // Fetch shipping cost when city changes
  useEffect(() => {
    if (!selectedCityId) { setShippingServices([]); setSelectedShippingCost(0); return; }
    const totalWeight = cartItems.reduce((sum, item) => sum + item.quantity * 400, 0); // 400g per bottle
    const fetchCost = async () => {
      setLoadingShipping(true);
      try {
        const res = await fetch('/api/shipping/cost', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ destination_city_id: selectedCityId, weight_grams: totalWeight, courier: 'jne' })
        });
        const data = await res.json();
        if (data?.rajaongkir?.results?.[0]?.costs) {
          setShippingServices(data.rajaongkir.results[0].costs);
          // Auto-select first
          const first = data.rajaongkir.results[0].costs[0];
          if (first) {
            setSelectedShippingCost(first.cost[0].value);
            setSelectedShippingLabel(`JNE ${first.service} (${first.cost[0].etd} hari)`);
          }
        }
      } catch (err) { console.error('Failed to fetch shipping cost', err); }
      setLoadingShipping(false);
    };
    fetchCost();
  }, [selectedCityId, cartItems]);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingForm.name || !shippingForm.email || !shippingForm.address || !selectedCityId || !shippingForm.recipientName) return;
    setIsProcessingPayment(true);

    const selectedCityObj = cities.find(c => c.city_id === selectedCityId);
    const cityName = selectedCityObj ? `${selectedCityObj.type} ${selectedCityObj.city_name}` : shippingForm.city;
    const finalTotal = cartFinalTotal + selectedShippingCost;

    // 1. Create order in backend
    const orderPayload = {
      customer_name: shippingForm.recipientName || shippingForm.name,
      customer_email: shippingForm.email,
      customer_address: shippingForm.address,
      customer_city: cityName,
      customer_postalCode: shippingForm.postalCode,
      shipping_cost: selectedShippingCost,
      shipping_courier: selectedShippingLabel || 'JNE',
      items: cartItems.map(item => ({
        productSlug: item.product.slug,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      })),
      total: finalTotal
    };

    try {
      const authToken = localStorage.getItem('arutala_token');
      const orderRes = await fetch('/api/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify(orderPayload)
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json();
        alert('Order failed: ' + (errData.detail || 'Please make sure you are logged in.'));
        setIsProcessingPayment(false);
        return;
      }

      const orderData = await orderRes.json();
      const orderId = String(orderData.id);

      if (!orderData.payment_token) {
        alert('Payment initialization failed. Missing token from server.');
        setIsProcessingPayment(false);
        return;
      }

      // 3. Redirect to payment page
      setIsProcessingPayment(false);
      closeCart();
      window.location.hash = `#/payment?token=${orderData.payment_token}&order_id=${orderData.order_ref}`;

    } catch (err) {
      console.error('Checkout failed', err);
      alert('An error occurred during checkout. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  const handleSuccessClose = () => {
    clearCart();
    setCheckoutStep('cart');
    setCompletedOrderId(null);
    closeCart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur & Fade Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm cursor-pointer"
            id="cart-backdrop"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-background shadow-2xl flex flex-col border-l border-cream"
            id="cart-panel"
          >
            {/* Header */}
            <div className="p-6 border-b border-cream flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingBag size={18} className="text-foreground" />
                <h3 className="text-xs tracking-[0.2em] uppercase font-sans font-medium text-foreground">
                  {checkoutStep === 'cart' && 'Your Olfactive Bag'}
                  {checkoutStep === 'shipping' && 'Secure Checkout'}
                  {checkoutStep === 'success' && 'Order Received'}
                </h3>
              </div>
              <button
                onClick={closeCart}
                className="p-1 rounded-full text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-all"
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
              {checkoutStep === 'cart' && (
                <>
                  {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-4 text-center">
                      <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center text-foreground/40">
                        <ShoppingBag size={24} />
                      </div>
                      <p className="font-serif italic text-lg text-foreground/70">Your bag is empty.</p>
                      <p className="text-xs text-foreground/40 font-sans max-w-xs leading-relaxed">
                        Explore our curation of haute fragrances and select your signature olfactory path.
                      </p>
                      <button
                        onClick={closeCart}
                        className="mt-2 text-xs tracking-[0.2em] uppercase font-sans font-medium text-foreground border-b border-foreground/30 pb-1 hover:border-foreground transition-all duration-300"
                      >
                        Continue Exploring
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      
                      {/* Smart Cart Free Shipping Progress Bar */}
                      <div className="space-y-3 pb-2 pt-2">
                        <p className="text-[9px] tracking-widest uppercase font-sans font-semibold text-foreground/80 text-center">
                          {cartFinalTotal >= 1500000 
                            ? "You have unlocked Complimentary Standard Shipping"
                            : `You are ${formatRupiah(1500000 - cartFinalTotal)} away from Complimentary Standard Shipping`}
                        </p>
                        <div className="w-full h-[2px] bg-cream/20 overflow-hidden">
                          <div 
                            className="h-full bg-accent-gold transition-all duration-1000 ease-out" 
                            style={{ width: `${Math.min((cartFinalTotal / 1500000) * 100, 100)}%` }} 
                          />
                        </div>
                      </div>

                      <AnimatePresence initial={false}>
                        {cartItems.map((item) => (
                          <motion.div
                            key={item.product.slug}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-start space-x-4 py-4 border-b border-cream"
                          >
                            {/* Product Thumbnail */}
                            <div className="w-20 h-24 bg-cream flex-shrink-0 overflow-hidden relative">
                              <ProgressiveImage
                                src={item.product.images.primary}
                                alt={item.product.name}
                                referrerPolicy="no-referrer"
                                className="object-cover object-center"
                              />
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 flex flex-col h-24 justify-between">
                              <div className="space-y-1">
                                <div className="flex items-start justify-between">
                                  <h4 className="font-serif text-base text-foreground font-medium leading-tight">
                                    {item.product.name}
                                  </h4>
                                  <p className="text-xs font-mono text-foreground font-medium pl-2">
                                    {formatRupiah(item.product.price * item.quantity)}
                                  </p>
                                </div>
                                  <p className="text-[10px] tracking-[0.1em] text-foreground/40 uppercase font-sans">
                                    {item.product.family} · {item.product.volume}
                                  </p>
                                  {item.options && item.options.length > 0 && (
                                    <p className="text-[9px] text-foreground/50 font-sans leading-tight mt-1">
                                      <span className="font-medium">Curated Vials:</span> {item.options.join(', ')}
                                    </p>
                                  )}
                                </div>

                              {/* Action Bar (Steppers + Remove) */}
                              <div className="flex items-center justify-between">
                                {/* Quantity Steppers */}
                                <div className="flex items-center border border-cream rounded-none bg-cream/20">
                                  <button
                                    onClick={() => updateQuantity(item.product.slug, item.quantity - 1, item.options)}
                                    className="p-1 px-2 text-foreground/40 hover:text-foreground transition-colors"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus size={12} />
                                  </button>
                                  <span className="text-xs font-mono text-foreground px-2">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.product.slug, item.quantity + 1, item.options)}
                                    className="p-1 px-2 text-foreground/40 hover:text-foreground transition-colors"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus size={12} />
                                  </button>
                                </div>

                                {/* Remove Button */}
                                <button
                                  onClick={() => removeFromCart(item.product.slug, item.options)}
                                  className="text-[10px] tracking-widest text-foreground/40 hover:text-red-500 font-sans uppercase flex items-center space-x-1 transition-colors duration-300"
                                >
                                  <Trash2 size={12} />
                                  <span>Remove</span>
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {/* Complementary Add-ons / Cross-selling */}
                      <div className="mt-8 pt-6 border-t border-cream space-y-4">
                        <span className="text-[10px] tracking-wider uppercase font-sans text-foreground/50 font-medium block">
                          Complementary Add-ons
                        </span>
                        
                        <div className="space-y-3">
                          {/* Add-on 1 */}
                          <div className="flex items-center justify-between p-3 bg-cream/10 border border-cream">
                            <div className="flex items-center space-x-3">
                              <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=200&h=200" alt="Gift Wrap" className="w-10 h-10 object-cover" />
                              <div>
                                <p className="text-xs font-serif text-foreground">Bespoke Gift Wrapping</p>
                                <p className="text-[10px] font-sans text-foreground/60">{formatRupiah(50000)}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                const giftWrap = {
                                  slug: "bespoke-gift-wrap",
                                  name: "Bespoke Gift Wrapping",
                                  family: "Floral",
                                  subtitle: "The Finishing Touch",
                                  description: "Hand-wrapped in premium artisanal paper with a personalized wax seal.",
                                  price: 50000,
                                  images: {
                                    primary: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800&h=1000",
                                    secondary: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800&h=1000"
                                  },
                                  notes: { top: [], heart: [], base: [] },
                                  noteDescriptions: {},
                                  volume: "Service",
                                  concentration: "Standard",
                                  story: "Elevate your unboxing experience."
                                };
                                // @ts-ignore
                                addToCart(giftWrap);
                              }}
                              className="text-[10px] font-sans uppercase tracking-widest text-foreground hover:bg-foreground hover:text-background px-3 py-1.5 border border-foreground transition-colors"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Promo Coupon Form */}
                      <div className="mt-8 pt-6 border-t border-cream space-y-4">
                        <span className="text-[10px] tracking-wider uppercase font-sans text-foreground/50 font-medium block">
                          Have a promo/coupon code?
                        </span>
                        
                        <form onSubmit={handleApplyPromo} className="flex gap-2">
                          <input
                            type="text"
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value)}
                            placeholder="e.g. RINTIKDUO, ATELIERDUO"
                            className="flex-grow border border-cream px-3 py-2 text-xs font-sans uppercase focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none text-foreground placeholder:text-foreground/30 placeholder:normal-case"
                          />
                          <button
                            type="submit"
                            className="bg-foreground text-cream px-4 py-2 text-[10px] tracking-widest uppercase font-sans font-medium hover:bg-foreground/90 transition-colors rounded-none"
                          >
                            Apply
                          </button>
                        </form>

                        {/* Error / Success messages */}
                        {promoError && (
                          <p className="text-[10px] font-sans text-rose-600 transition-all">{promoError}</p>
                        )}
                        {promoSuccess && (
                          <p className="text-[10px] font-sans text-emerald-600 transition-all">{promoSuccess}</p>
                        )}

                        {/* Active applied coupon badge */}
                        {appliedPromoCode && (
                          <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-2 text-xs">
                            <span className="flex items-center gap-1.5 font-sans font-medium">
                              <Tag size={12} className="text-emerald-600" />
                              Coupon: {appliedPromoCode.toUpperCase()}
                            </span>
                            <button
                              type="button"
                              onClick={handleRemovePromo}
                              className="text-[10px] text-rose-600 hover:text-rose-800 hover:underline font-sans font-semibold uppercase"
                            >
                              Remove
                            </button>
                          </div>
                        )}

                        {/* Automatic / active discounts in cart list */}
                        {activePromosApplied.length > 0 && (
                          <div className="bg-muted border border-cream p-3 space-y-2">
                            <span className="text-[9px] tracking-widest uppercase font-sans text-foreground/40 font-semibold block">
                              Active Promotions:
                            </span>
                            <div className="space-y-1">
                              {activePromosApplied.map(({ promo, amount }) => (
                                <div key={promo.id} className="flex justify-between items-center text-[11px] text-foreground/70">
                                  <span className="flex items-center gap-1.5 text-left pr-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 inline-block mr-1.5" />
                                    {promo.code ? `Promo code "${promo.code}"` : promo.description}
                                  </span>
                                  <span className="font-sans font-medium text-emerald-700 flex-shrink-0">-{formatRupiah(amount)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </>
              )}

              {checkoutStep === 'shipping' && (
                <form onSubmit={handleCheckoutSubmit} className="space-y-5 py-2">
                  <p className="text-xs font-sans text-foreground/50 leading-relaxed">
                    Complete your details below. Shipping cost is calculated automatically via JNE.
                  </p>
                  
                  <div className="space-y-4">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] tracking-wider uppercase font-sans text-foreground/50 font-medium">Full Name</label>
                        {user && <a href="#/profile" onClick={closeCart} className="text-[10px] text-accent-gold hover:underline">Edit in Profile</a>}
                      </div>
                      <input type="text" required value={shippingForm.name} disabled={!!user}
                        onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                        placeholder="Nama lengkap"
                        className="w-full border border-cream px-4 py-3 text-xs font-sans focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none disabled:opacity-50 disabled:cursor-not-allowed" />
                    </div>
                    {/* Email */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] tracking-wider uppercase font-sans text-foreground/50 font-medium">Email Address</label>
                        {user && <a href="#/profile" onClick={closeCart} className="text-[10px] text-accent-gold hover:underline">Edit in Profile</a>}
                      </div>
                      <input type="email" required value={shippingForm.email} disabled={!!user}
                        onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                        placeholder="email@example.com"
                        className="w-full border border-cream px-4 py-3 text-xs font-sans focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none disabled:opacity-50 disabled:cursor-not-allowed" />
                    </div>
                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="text-[10px] tracking-wider uppercase font-sans text-foreground/50 font-medium">Phone Number</label>
                      <input type="tel" required value={shippingForm.phone}
                        onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                        placeholder="08xxxxxxxxxx"
                        className="w-full border border-cream px-4 py-3 text-xs font-sans focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none" />
                    </div>
                    {/* Recipient Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] tracking-wider uppercase font-sans text-foreground/50 font-medium">Recipient Name (Nama Penerima)</label>
                      <input type="text" required value={shippingForm.recipientName}
                        onChange={(e) => setShippingForm({ ...shippingForm, recipientName: e.target.value })}
                        placeholder="Nama penerima paket"
                        className="w-full border border-cream px-4 py-3 text-xs font-sans focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none" />
                    </div>
                    {/* Address */}
                    <div className="space-y-1">
                      <label className="text-[10px] tracking-wider uppercase font-sans text-foreground/50 font-medium">Street Address</label>
                      <input type="text" required value={shippingForm.address}
                        onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                        placeholder="Jl. Kenanga No. 12"
                        className="w-full border border-cream px-4 py-3 text-xs font-sans focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none" />
                    </div>
                    {/* Province */}
                    <div className="space-y-1">
                      <label className="text-[10px] tracking-wider uppercase font-sans text-foreground/50 font-medium">Province</label>
                      <div className="relative">
                        <select required value={selectedProvinceId}
                          onChange={(e) => setSelectedProvinceId(e.target.value)}
                          className="w-full border border-cream px-4 py-3 text-xs font-sans focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none appearance-none cursor-pointer">
                          <option value="">{loadingProvinces ? 'Loading...' : 'Select Province'}</option>
                          {provinces.map(p => (
                            <option key={p.province_id} value={p.province_id} className="text-black">{p.province}</option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/40">
                          <svg width="10" height="6" viewBox="0 0 10 6"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
                        </div>
                      </div>
                    </div>
                    {/* City */}
                    <div className="space-y-1">
                      <label className="text-[10px] tracking-wider uppercase font-sans text-foreground/50 font-medium">City / District</label>
                      <div className="relative">
                        <select required value={selectedCityId}
                          onChange={(e) => {
                            setSelectedCityId(e.target.value);
                            const city = cities.find(c => c.city_id === e.target.value);
                            if (city) {
                              setShippingForm(prev => ({ ...prev, city: `${city.type} ${city.city_name}`, postalCode: city.postal_code }));
                            }
                          }}
                          disabled={!selectedProvinceId || loadingCities}
                          className="w-full border border-cream px-4 py-3 text-xs font-sans focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none appearance-none cursor-pointer disabled:opacity-40">
                          <option value="">{loadingCities ? 'Loading...' : 'Select City'}</option>
                          {cities.map(c => (
                            <option key={c.city_id} value={c.city_id} className="text-black">{c.type} {c.city_name}</option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/40">
                          <svg width="10" height="6" viewBox="0 0 10 6"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
                        </div>
                      </div>
                    </div>
                    {/* Postal Code (auto-filled) */}
                    <div className="space-y-1">
                      <label className="text-[10px] tracking-wider uppercase font-sans text-foreground/50 font-medium">Postal Code</label>
                      <input type="text" required value={shippingForm.postalCode}
                        onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                        placeholder="Postal code"
                        className="w-full border border-cream px-4 py-3 text-xs font-sans focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none" />
                    </div>
                  </div>

                  {/* Shipping Services */}
                  {loadingShipping && (
                    <div className="flex items-center gap-2 text-xs text-foreground/50 font-sans py-2">
                      <Loader2 size={14} className="animate-spin" /> Calculating shipping cost...
                    </div>
                  )}
                  {shippingServices.length > 0 && !loadingShipping && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-foreground/70">
                        <Truck size={14} />
                        <span className="text-[10px] tracking-wider uppercase font-sans font-medium">Shipping Method (JNE)</span>
                      </div>
                      <div className="space-y-2">
                        {shippingServices.map(svc => (
                          <label key={svc.service}
                            className={`flex items-center justify-between p-3 border cursor-pointer transition-all text-xs font-sans ${
                              selectedShippingLabel.includes(svc.service)
                                ? 'border-foreground bg-foreground/5'
                                : 'border-cream hover:border-foreground/30'
                            }`}>
                            <div className="flex items-center gap-3">
                              <input type="radio" name="shipping" checked={selectedShippingLabel.includes(svc.service)}
                                onChange={() => {
                                  setSelectedShippingCost(svc.cost[0].value);
                                  setSelectedShippingLabel(`JNE ${svc.service} (${svc.cost[0].etd} hari)`);
                                }}
                                className="accent-foreground" />
                              <div>
                                <span className="font-medium">JNE {svc.service}</span>
                                <span className="text-foreground/50 ml-2">{svc.cost[0].etd} hari</span>
                              </div>
                            </div>
                            <span className="font-medium">{formatRupiah(svc.cost[0].value)}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Order Summary */}
                  <div className="p-4 bg-cream/40 border border-cream space-y-2">
                    <div className="flex items-center space-x-2 text-foreground/70">
                      <CreditCard size={14} />
                      <span className="text-[10px] tracking-wider uppercase font-sans">Order Summary</span>
                    </div>
                    <div className="space-y-1 text-xs font-sans text-foreground/70">
                      <div className="flex justify-between"><span>Subtotal</span><span>{formatRupiah(cartTotal)}</span></div>
                      {promoDiscount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-{formatRupiah(promoDiscount)}</span></div>}
                      <div className="flex justify-between"><span>Shipping</span><span>{selectedShippingCost > 0 ? formatRupiah(selectedShippingCost) : '—'}</span></div>
                      <div className="flex justify-between font-semibold text-foreground pt-1 border-t border-cream mt-1">
                        <span>Total</span><span>{formatRupiah(cartFinalTotal + selectedShippingCost)}</span>
                      </div>
                    </div>
                    <p className="text-[10px] font-sans text-foreground/40 pt-1">
                      Payment via Midtrans (GoPay, OVO, BCA VA, Credit Card, etc.)
                    </p>
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button type="button" onClick={() => setCheckoutStep('cart')}
                      className="flex-1 border border-cream py-4 text-xs tracking-[0.2em] font-sans font-medium uppercase text-foreground/60 hover:text-foreground hover:border-foreground transition-all duration-300">
                      Back
                    </button>
                    <button type="submit" disabled={isProcessingPayment || selectedShippingCost === 0}
                      className="flex-1 bg-foreground text-cream py-4 text-xs tracking-[0.2em] font-sans font-medium uppercase hover:bg-foreground/90 transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {isProcessingPayment ? <><Loader2 size={14} className="animate-spin" /> Processing...</> : 'Pay Now'}
                    </button>
                  </div>
                </form>
              )}

              {checkoutStep === 'success' && (
                <div className="h-full flex flex-col items-center justify-center space-y-4 text-center py-8">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-16 h-16 rounded-full bg-cream flex items-center justify-center text-foreground"
                  >
                    <CheckCircle2 size={32} className="text-foreground" />
                  </motion.div>
                  <h4 className="font-serif text-2xl text-foreground font-medium pt-2">Thank You for Your Order</h4>
                  <p className="text-xs text-foreground/60 font-sans max-w-xs leading-relaxed">
                    Thank you for your order, <strong>{shippingForm.name}</strong>. We've sent a detailed confirmation to <strong>{shippingForm.email}</strong>.
                  </p>
                  <div className="p-4 bg-cream/20 border border-cream text-left w-full text-xs font-sans text-foreground/60 space-y-1">
                    <p><strong>Order ID:</strong> {completedOrderId}</p>
                    <p className="mt-2"><strong>Shipping to:</strong></p>
                    <p>{shippingForm.address}</p>
                    <p>{shippingForm.city}, {shippingForm.postalCode}</p>
                    <p className="pt-2 text-[10px] uppercase tracking-widest text-foreground/40 font-medium">{selectedShippingLabel || 'Standard Shipping'} — {formatRupiah(selectedShippingCost)}</p>
                  </div>
                  <div className="flex flex-col w-full space-y-2 mt-4">
                    <button
                      onClick={() => {
                        window.location.hash = `#/track-order?id=${completedOrderId}`;
                        handleSuccessClose();
                      }}
                      className="bg-foreground text-background w-full py-4 text-xs tracking-[0.2em] font-sans font-medium uppercase hover:bg-foreground/90 transition-all duration-300"
                    >
                      Track Order
                    </button>
                    <button
                      onClick={handleSuccessClose}
                      className="border border-cream text-foreground w-full py-4 text-xs tracking-[0.2em] font-sans font-medium uppercase hover:bg-cream transition-all duration-300"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Subtotal & Checkout CTA (Only visible in Cart view) */}
            {checkoutStep === 'cart' && cartItems.length > 0 && (
              <div className="p-6 border-t border-cream space-y-4 bg-background">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs tracking-wider uppercase font-sans text-foreground/50">
                    <span>Bag Subtotal</span>
                    <span className="font-sans">{formatRupiah(cartTotal)}</span>
                  </div>
                  
                  {promoDiscount > 0 && (
                    <div className="flex items-center justify-between text-xs tracking-wider uppercase font-sans text-emerald-600">
                      <span>Promo Discount</span>
                      <span className="font-sans">-{formatRupiah(promoDiscount)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs tracking-wider uppercase font-sans text-foreground/50">
                    <span>Shipping</span>
                    <span className="font-sans">{selectedShippingCost > 0 ? formatRupiah(selectedShippingCost) : 'Calculated at checkout'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm tracking-widest uppercase font-sans text-foreground font-semibold pt-1 border-t border-muted">
                    <span>Total Amount</span>
                    <span className="font-sans text-base">{formatRupiah(cartFinalTotal)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setCheckoutStep('shipping')}
                  className="w-full bg-foreground text-cream py-4 text-xs tracking-[0.2em] uppercase font-sans font-medium hover:bg-foreground/90 transition-colors duration-300 shadow-sm"
                >
                  Proceed to Checkout
                </button>
                <p className="text-[10px] text-foreground/30 text-center font-sans tracking-wide">
                  Direct courier delivery inside branded premium signature gift wrapping.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
