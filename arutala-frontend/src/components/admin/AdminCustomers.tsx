import React, { useEffect, useState } from 'react';
import { User, Mail, DollarSign, Package, Award } from 'lucide-react';
import { formatRupiah } from '../../data/products';

interface Customer {
  id: string;
  name: string;
  email: string;
  role: string;
  total_orders: number;
  total_spent: number;
}

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('arutala_token');
        const response = await fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setCustomers(data);
        }
      } catch (err) {
        console.error("Failed to fetch customers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-foreground/40 font-sans tracking-widest text-xs uppercase animate-pulse">Loading Client Database...</div>;
  }

  // Identify VIPs (e.g. spent > 2.000.000 or ordered > 3 times)
  const sortedCustomers = [...customers].sort((a, b) => b.total_spent - a.total_spent);
  
  const totalPages = Math.ceil(sortedCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = sortedCustomers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-background border border-cream overflow-hidden mb-6">

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-foreground/5">
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest font-sans text-foreground/40 font-medium">Client</th>
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest font-sans text-foreground/40 font-medium">Status</th>
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest font-sans text-foreground/40 font-medium">Orders</th>
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest font-sans text-foreground/40 font-medium text-right">Total Acquired</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5">
              {paginatedCustomers.map((customer) => {
                const isVIP = customer.total_spent >= 2000000 || customer.total_orders >= 3;
                return (
                  <tr key={customer.id} className="hover:bg-foreground/[0.02] transition-colors group">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-cream border border-foreground/10 flex items-center justify-center text-xs font-serif text-foreground/60">
                          {customer.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-serif text-foreground">{customer.name}</p>
                          <p className="text-[10px] font-sans text-foreground/40 flex items-center space-x-1">
                            <Mail size={10} />
                            <span>{customer.email}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {isVIP ? (
                        <span className="inline-flex items-center space-x-1 bg-accent-gold/10 text-accent-gold px-2 py-1 border border-accent-gold/20">
                          <Award size={10} />
                          <span className="text-[9px] uppercase tracking-widest font-sans font-semibold">VIP Member</span>
                        </span>
                      ) : (
                        <span className="inline-block bg-foreground/5 text-foreground/50 px-2 py-1 text-[9px] uppercase tracking-widest font-sans">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2 text-sm font-sans text-foreground/70">
                        <Package size={14} className="text-foreground/40" />
                        <span>{customer.total_orders}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1 text-foreground">
                        <DollarSign size={14} className="text-foreground/40" />
                        <span className="font-mono">{formatRupiah(customer.total_spent)}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {customers.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-xs font-sans uppercase tracking-widest text-foreground/30">
                    No clients registered yet
                  </td>
                </tr>
              )}
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
