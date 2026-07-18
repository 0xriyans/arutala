export interface Product {
  id?: number;
  slug: string;
  name: string;
  family: 'Floral' | 'Woody' | 'Citrus';
  subtitle: string;
  description: string;
  price: number;
  images: {
    primary: string;
    secondary: string;
    tertiary?: string;
    scent?: string;
    ambience?: string;
  };
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  noteDescriptions: {
    [key: string]: string;
  };
  volume: string;
  concentration: string;
  story: string;
  isFeatured?: boolean;
  showInShop?: boolean;
  showInCollection?: boolean;
}

export const formatRupiah = (price: number): string => {
  return "Rp " + price.toLocaleString("id-ID");
};

// Mutable products array that all components reference.
// Populated on app startup by fetchProducts().
export const products: Product[] = [];

// Flag to track loading state
let _productsLoaded = false;
let _productsLoading = false;
let _loadPromise: Promise<Product[]> | null = null;

export const isProductsLoaded = () => _productsLoaded;

/**
 * Fetch all products from backend API.
 * Returns immediately if already loaded.
 * Multiple callers share the same in-flight promise.
 */
export const fetchProducts = async (): Promise<Product[]> => {
  if (_productsLoaded && products.length > 0) return products;
  
  if (_productsLoading && _loadPromise) return _loadPromise;
  
  _productsLoading = true;
  _loadPromise = (async () => {
    try {
      const res = await fetch('/api/products/?t=' + new Date().getTime());
      if (res.ok) {
        const data: Product[] = await res.json();
        products.length = 0;
        products.push(...data);
        _productsLoaded = true;
        
        // Dispatch event so any mounted components can re-render
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('maison-products-updated'));
        }
      }
    } catch (err) {
      console.error('Failed to fetch products from API:', err);
    } finally {
      _productsLoading = false;
    }
    return products;
  })();
  
  return _loadPromise;
};

export const updateProductsInStore = (newProducts: Product[]) => {
  products.length = 0;
  products.push(...newProducts);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('maison-products-updated'));
  }
};

export const resetProductsToDefault = async () => {
  // Re-fetch from API (the DB is source of truth now)
  _productsLoaded = false;
  await fetchProducts();
};
