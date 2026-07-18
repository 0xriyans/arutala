import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../data/products';
import { getSavedPromos, QuantityPromo } from '../data/promos';

export interface CartItem {
  product: Product;
  quantity: number;
  options?: string[];
}

interface CartContextType {
  cartItems: CartItem[];
  isOpen: boolean;
  addToCart: (product: Product, quantity?: number, options?: string[]) => void;
  removeFromCart: (slug: string, options?: string[]) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
  cartCount: number;
  cartTotal: number;
  clearCart: () => void;
  // Promos and discounts
  promos: QuantityPromo[];
  appliedPromoCode: string | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  promoDiscount: number;
  cartFinalTotal: number;
  activePromosApplied: { promo: QuantityPromo; amount: number }[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [promos, setPromos] = useState<QuantityPromo[]>(() => getSavedPromos());
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);

  // Load promos on mount and listen to updates
  useEffect(() => {
    const handlePromosUpdated = () => {
      setPromos(getSavedPromos());
    };
    window.addEventListener('maison-promos-updated', handlePromosUpdated);
    return () => window.removeEventListener('maison-promos-updated', handlePromosUpdated);
  }, []);

  // Load cart and applied promo from localStorage on mount (SSR-safe)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('maison_cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
        const savedPromo = localStorage.getItem('maison_applied_promo');
        if (savedPromo) {
          setAppliedPromoCode(savedPromo);
        }
      } catch (error) {
        console.error('Failed to parse cart/promos from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage when it changes (SSR-safe)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('maison_cart', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }
  }, [cartItems]);

  const saveAppliedPromo = (code: string | null) => {
    setAppliedPromoCode(code);
    if (code) {
      localStorage.setItem('maison_applied_promo', code);
    } else {
      localStorage.removeItem('maison_applied_promo');
    }
  };

  const addToCart = (product: Product, quantity = 1, options?: string[]) => {
    setCartItems((prevItems) => {
      // Find an existing item with the EXACT same slug and options
      const existingIndex = prevItems.findIndex((item) => {
        const sameSlug = item.product.slug === product.slug;
        const sameOptions = JSON.stringify(item.options || []) === JSON.stringify(options || []);
        return sameSlug && sameOptions;
      });
      
      if (existingIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity,
        };
        return newItems;
      }
      return [...prevItems, { product, quantity, options }];
    });
    // Auto-open cart when adding an item for premium feedback
    setIsOpen(true);
  };

  const removeFromCart = (slug: string, options?: string[]) => {
    setCartItems((prevItems) => prevItems.filter((item) => {
      const sameSlug = item.product.slug === slug;
      const sameOptions = JSON.stringify(item.options || []) === JSON.stringify(options || []);
      return !(sameSlug && sameOptions);
    }));
  };

  const updateQuantity = (slug: string, quantity: number, options?: string[]) => {
    if (quantity <= 0) {
      removeFromCart(slug, options);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        const sameSlug = item.product.slug === slug;
        const sameOptions = JSON.stringify(item.options || []) === JSON.stringify(options || []);
        if (sameSlug && sameOptions) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const clearCart = () => {
    setCartItems([]);
    saveAppliedPromo(null);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Evaluate promos and calculate discounts
  let promoDiscount = 0;
  const activePromosApplied: { promo: QuantityPromo; amount: number }[] = [];

  // Sort promos: specific product promos first, "all" global promos second
  const sortedPromos = [...promos].sort((a, b) => {
    if (a.productSlug === 'all' && b.productSlug !== 'all') return 1;
    if (a.productSlug !== 'all' && b.productSlug === 'all') return -1;
    return 0;
  });

  sortedPromos.forEach(promo => {
    if (!promo.isActive) return;

    const isCoupon = promo.code.trim() !== '';
    if (isCoupon) {
      // If coupon is required, check if user has active coupon applied
      if (!appliedPromoCode || appliedPromoCode.trim().toLowerCase() !== promo.code.trim().toLowerCase()) {
        return;
      }
    }

    // Validate quantity conditions
    if (promo.productSlug === 'all') {
      if (cartCount >= promo.minQuantity) {
        let discountAmount = 0;
        if (promo.discountType === 'percentage') {
          discountAmount = cartTotal * (promo.discountValue / 100);
        } else {
          discountAmount = promo.discountValue;
        }
        // Limit discount to what's remaining
        discountAmount = Math.min(discountAmount, cartTotal - promoDiscount);
        if (discountAmount > 0) {
          promoDiscount += discountAmount;
          activePromosApplied.push({ promo, amount: discountAmount });
        }
      }
    } else {
      // Specific product
      const item = cartItems.find(i => i.product.slug === promo.productSlug);
      if (item && item.quantity >= promo.minQuantity) {
        let discountAmount = 0;
        const itemSubtotal = item.product.price * item.quantity;
        if (promo.discountType === 'percentage') {
          discountAmount = itemSubtotal * (promo.discountValue / 100);
        } else {
          discountAmount = promo.discountValue;
        }
        // Limit discount to what's remaining
        discountAmount = Math.min(discountAmount, cartTotal - promoDiscount);
        if (discountAmount > 0) {
          promoDiscount += discountAmount;
          activePromosApplied.push({ promo, amount: discountAmount });
        }
      }
    }
  });

  const cartFinalTotal = Math.max(0, cartTotal - promoDiscount);

  const applyPromoCode = (code: string) => {
    const trimmedCode = code.trim();
    if (!trimmedCode) {
      return { success: false, message: "Please enter a valid coupon code." };
    }

    const matchingPromo = promos.find(p => p.isActive && p.code.toLowerCase() === trimmedCode.toLowerCase());
    if (!matchingPromo) {
      return { success: false, message: "Coupon code is invalid or expired." };
    }

    // Verify quantity condition in advance
    if (matchingPromo.productSlug === 'all') {
      if (cartCount < matchingPromo.minQuantity) {
        return {
          success: false,
          message: `Requires at least ${matchingPromo.minQuantity} items in your bag to unlock this coupon.`
        };
      }
    } else {
      const item = cartItems.find(i => i.product.slug === matchingPromo.productSlug);
      if (!item || item.quantity < matchingPromo.minQuantity) {
        return {
          success: false,
          message: `Requires at least ${matchingPromo.minQuantity}x "${matchingPromo.productName}" in your bag to unlock this coupon.`
        };
      }
    }

    saveAppliedPromo(trimmedCode);
    return { success: true, message: `Coupon "${matchingPromo.code}" applied successfully!` };
  };

  const removePromoCode = () => {
    saveAppliedPromo(null);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        openCart,
        closeCart,
        cartCount,
        cartTotal,
        clearCart,
        promos,
        appliedPromoCode,
        applyPromoCode,
        removePromoCode,
        promoDiscount,
        cartFinalTotal,
        activePromosApplied,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
