import React, { useEffect, useState } from 'react';
import { Package, AlertTriangle, Check, RefreshCw, Save } from 'lucide-react';
import { products, Product } from '../../data/products';

interface InventoryItem {
  quantity: number;
  low_stock_threshold: number;
}

export const AdminInventory: React.FC = () => {
  const [inventory, setInventory] = useState<Record<string, InventoryItem>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('arutala_token');
      const response = await fetch('/api/admin/inventory', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setInventory(data);
      }
    } catch (err) {
      console.error("Failed to fetch inventory", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUpdateStock = async (slug: string, newQuantity: number) => {
    try {
      setSaving(slug);
      const token = localStorage.getItem('arutala_token');
      const response = await fetch(`/api/admin/inventory/${slug}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ quantity: newQuantity })
      });
      
      if (response.ok) {
        const updatedItem = await response.json();
        setInventory(prev => ({
          ...prev,
          [slug]: {
            ...prev[slug],
            quantity: updatedItem.quantity
          }
        }));
      }
    } catch (err) {
      console.error("Failed to update inventory", err);
    } finally {
      setTimeout(() => setSaving(null), 500); // small delay for visual feedback
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginatedProducts = products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (loading) {
    return <div className="p-8 text-center text-foreground/40 font-sans tracking-widest text-xs uppercase animate-pulse">Loading Inventory Systems...</div>;
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-end mb-4">
        <button 
          onClick={fetchInventory}
          className="text-[10px] tracking-widest uppercase font-sans flex items-center space-x-1.5 text-foreground/50 hover:text-foreground transition-colors"
        >
          <RefreshCw size={12} />
          <span>Sync Database</span>
        </button>
      </div>

      <div className="bg-background border border-cream overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-foreground/5">
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest font-sans text-foreground/40 font-medium">Product Name</th>
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest font-sans text-foreground/40 font-medium text-center">Status</th>
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest font-sans text-foreground/40 font-medium text-center">Stock Limit</th>
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest font-sans text-foreground/40 font-medium text-right">Available Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5">
              {paginatedProducts.map((product) => {
                const inv = inventory[product.slug] || { quantity: 0, low_stock_threshold: 5 };
                const isLowStock = inv.quantity < inv.low_stock_threshold;
                const isOutOfStock = inv.quantity === 0;

                return (
                  <tr key={product.slug} className="hover:bg-foreground/[0.02] transition-colors group">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={product.images.primary} 
                          alt={product.name} 
                          className="w-12 h-12 object-cover border border-foreground/10"
                        />
                        <div>
                          <p className="font-serif text-foreground">{product.name}</p>
                          <p className="text-[10px] font-sans text-foreground/40 uppercase tracking-widest">
                            {product.volume}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {isOutOfStock ? (
                        <span className="inline-block bg-red-900/10 text-red-600 border border-red-900/20 px-2 py-1 text-[9px] uppercase tracking-widest font-sans font-semibold">
                          Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center space-x-1 bg-amber-900/10 text-amber-600 border border-amber-900/20 px-2 py-1">
                          <AlertTriangle size={10} />
                          <span className="text-[9px] uppercase tracking-widest font-sans font-semibold">Low Stock</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 bg-green-900/10 text-green-600 border border-green-900/20 px-2 py-1">
                          <Check size={10} />
                          <span className="text-[9px] uppercase tracking-widest font-sans font-semibold">Healthy</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-xs font-sans text-foreground/50">
                        {inv.low_stock_threshold}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <input 
                          type="number" 
                          min="0"
                          value={inv.quantity}
                          onChange={(e) => {
                            const newQ = parseInt(e.target.value) || 0;
                            setInventory(prev => ({
                              ...prev,
                              [product.slug]: { ...inv, quantity: newQ }
                            }));
                          }}
                          className="w-16 bg-background border border-foreground/20 text-center font-serif text-lg py-1 px-2 focus:outline-none focus:border-accent-gold transition-colors"
                        />
                        <button
                          onClick={() => handleUpdateStock(product.slug, inv.quantity)}
                          disabled={saving === product.slug}
                          className="w-8 h-8 flex items-center justify-center bg-foreground text-background hover:bg-accent-gold transition-colors disabled:opacity-50"
                        >
                          {saving === product.slug ? (
                            <RefreshCw size={12} className="animate-spin" />
                          ) : (
                            <Save size={12} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-cream">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 border border-cream disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
          >
            &lt;
          </button>
          <span className="text-[10px] font-mono text-foreground/60 uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 border border-cream disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};
