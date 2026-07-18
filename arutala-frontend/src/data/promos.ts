export interface QuantityPromo {
  id: string;
  code: string; // The coupon code needed to apply this promo. If empty/blank, it is applied automatically as a bulk discount!
  productSlug: string; // The specific product slug this promo applies to, or 'all' for any/all products.
  productName: string; // Human-friendly product name for displays
  minQuantity: number; // Minimum quantity required to unlock the discount (e.g. 2, 3)
  discountType: 'percentage' | 'fixed'; // Percentage (e.g., 15%) or Fixed amount (e.g., Rp 500,000)
  discountValue: number; // Value of the discount
  description: string; // Short notes/details (e.g., "Special Buy 2 Rintik promo")
  isActive: boolean; // Toggle active status
}

export const initialPromos: QuantityPromo[] = [
  {
    id: "promo-1",
    code: "RINTIKDUO",
    productSlug: "rintik",
    productName: "Rintik (Extrait de Parfum)",
    minQuantity: 2,
    discountType: "percentage",
    discountValue: 15,
    description: "Get 15% discount when you purchase at least 2 bottles of Rintik.",
    isActive: true
  },
  {
    id: "promo-2",
    code: "", // Empty code means AUTOMATIC discount!
    productSlug: "hening",
    productName: "Hening (Eau de Parfum)",
    minQuantity: 2,
    discountType: "fixed",
    discountValue: 500000,
    description: "Automatic Rp 500.000 bulk discount applied on purchase of 2+ bottles of Hening.",
    isActive: true
  },
  {
    id: "promo-3",
    code: "ATELIERDUO",
    productSlug: "all",
    productName: "Any Fragrance",
    minQuantity: 2,
    discountType: "percentage",
    discountValue: 10,
    description: "Enjoy 10% off across your entire cart when you purchase any 2 or more items.",
    isActive: true
  }
];

export const getSavedPromos = (): QuantityPromo[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('maison_promos');
    if (saved) {
      try {
        return JSON.parse(saved) as QuantityPromo[];
      } catch (e) {
        return initialPromos;
      }
    }
  }
  return initialPromos;
};

export const updatePromosInStore = (newPromos: QuantityPromo[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('maison_promos', JSON.stringify(newPromos));
    window.dispatchEvent(new CustomEvent('maison-promos-updated'));
  }
};

export const resetPromosToDefault = () => {
  updatePromosInStore(initialPromos);
};
