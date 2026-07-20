import React, { useEffect, useState } from 'react';
import { products, formatRupiah, Product } from '../data/products';
import { ArrowRight } from 'lucide-react';

interface MiniProductCardProps {
  slug: string;
}

export const MiniProductCard: React.FC<MiniProductCardProps> = ({ slug }) => {
  const [product, setProduct] = useState<Product | undefined>(() => products.find(p => p.slug === slug));

  useEffect(() => {
    const handleUpdate = () => setProduct(products.find(p => p.slug === slug));
    window.addEventListener('maison-products-updated', handleUpdate);
    return () => window.removeEventListener('maison-products-updated', handleUpdate);
  }, [slug]);

  if (!product) {
    return null;
  }

  return (
    <a href={`#/product/${product.slug}`} className="block mt-3 mb-2 no-underline group">
      <div className="flex items-center gap-4 p-3 rounded-lg border border-foreground/10 bg-background/50 hover:bg-muted/50 transition-colors">
        <div className="w-16 h-16 rounded-md overflow-hidden bg-muted/30 shrink-0">
          <img src={product.images.primary} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-serif text-foreground truncate">{product.name}</h4>
          <p className="text-xs text-muted-foreground mb-1">{product.family}</p>
          <p className="text-xs font-medium text-foreground">{formatRupiah(product.price)}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-foreground text-cream flex items-center justify-center shrink-0">
          <ArrowRight size={14} />
        </div>
      </div>
    </a>
  );
};
