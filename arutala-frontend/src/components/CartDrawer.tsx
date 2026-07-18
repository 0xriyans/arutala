import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard, CheckCircle2, Tag } from 'lucide-react';
import { useCart } from '../context/cart-context';
import { ProgressiveImage } from './ProgressiveImage';
import { formatRupiah } from '../data/products';

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
  } = useCart();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'success'>('cart');
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
  const [shippingForm, setShippingForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
  });

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

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (shippingForm.name && shippingForm.email && shippingForm.address) {
      const payload = {
        customer_name: shippingForm.name,
        customer_email: shippingForm.email,
        customer_address: shippingForm.address,
        customer_city: shippingForm.city,
        customer_postalCode: shippingForm.postalCode,
        shipping_cost: 0,
        shipping_courier: "Standard",
        items: cartItems.map(item => ({
          productSlug: item.product.slug,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        })),
        total: cartFinalTotal
      };

      try {
        const token = localStorage.getItem('arutala_token');
        const res = await fetch('/api/orders/', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const orderData = await res.json();
          // Midtrans token or DB ID
          setCompletedOrderId(orderData.id || "ORDER_SUCCESS");
          setCheckoutStep('success');
        } else {
          const errData = await res.json();
          console.error("Order failed", errData);
          alert("Order failed: " + (errData.detail || "Please make sure you are logged in."));
        }
      } catch (err) {
        console.error('Failed to log order', err);
      }
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
                <form onSubmit={handleCheckoutSubmit} className="space-y-6 py-2">
                  <p className="text-xs font-sans text-foreground/50 leading-relaxed">
                    Complete your shipping details below to place your order. Enjoy complimentary standard shipping and signature gift wrapping.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] tracking-wider uppercase font-sans text-foreground/50 font-medium">Full Name</label>
                      <input
                        type="text"
                        required
                        value={shippingForm.name}
                        onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                        placeholder="Jean-Baptiste Grenouille"
                        className="w-full border border-cream px-4 py-3 text-xs font-sans focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] tracking-wider uppercase font-sans text-foreground/50 font-medium">Email Address</label>
                      <input
                        type="email"
                        required
                        value={shippingForm.email}
                        onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                        placeholder="customer@arutala.com"
                        className="w-full border border-cream px-4 py-3 text-xs font-sans focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] tracking-wider uppercase font-sans text-foreground/50 font-medium">Street Address</label>
                      <input
                        type="text"
                        required
                        value={shippingForm.address}
                        onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                        placeholder="18 Rue de l'Orangerie"
                        className="w-full border border-cream px-4 py-3 text-xs font-sans focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] tracking-wider uppercase font-sans text-foreground/50 font-medium">City</label>
                        <input
                          type="text"
                          required
                          value={shippingForm.city}
                          onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                          placeholder="Paris"
                          className="w-full border border-cream px-4 py-3 text-xs font-sans focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] tracking-wider uppercase font-sans text-foreground/50 font-medium">Postal Code</label>
                        <input
                          type="text"
                          required
                          value={shippingForm.postalCode}
                          onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                          placeholder="75001"
                          className="w-full border border-cream px-4 py-3 text-xs font-sans focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-cream/40 border border-cream space-y-2">
                    <div className="flex items-center space-x-2 text-foreground/70">
                      <CreditCard size={14} />
                      <span className="text-[10px] tracking-wider uppercase font-sans">Payment Details</span>
                    </div>
                    <p className="text-xs font-sans text-foreground/50 leading-normal">
                      Demo Order: Direct secure settlement. No actual credit card required for testing this storefront.
                    </p>
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('cart')}
                      className="flex-1 border border-cream py-4 text-xs tracking-[0.2em] font-sans font-medium uppercase text-foreground/60 hover:text-foreground hover:border-foreground transition-all duration-300"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-foreground text-cream py-4 text-xs tracking-[0.2em] font-sans font-medium uppercase hover:bg-foreground/90 transition-all duration-300 shadow-sm"
                    >
                      Complete Order
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
                  <h4 className="font-serif text-2xl text-foreground font-medium pt-2">Merci pour votre commande</h4>
                  <p className="text-xs text-foreground/60 font-sans max-w-xs leading-relaxed">
                    Thank you for your order, <strong>{shippingForm.name}</strong>. We've sent a detailed confirmation to <strong>{shippingForm.email}</strong>.
                  </p>
                  <div className="p-4 bg-cream/20 border border-cream text-left w-full text-xs font-sans text-foreground/60 space-y-1">
                    <p><strong>Order ID:</strong> {completedOrderId}</p>
                    <p className="mt-2"><strong>Shipping to:</strong></p>
                    <p>{shippingForm.address}</p>
                    <p>{shippingForm.city}, {shippingForm.postalCode}</p>
                    <p className="pt-2 text-[10px] uppercase tracking-widest text-foreground/40 font-medium">Standard Complimentary Shipping</p>
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
                    <span className="font-serif italic font-medium">Complimentary</span>
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
