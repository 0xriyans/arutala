import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { formatRupiah } from '../../data/products';
import { TrendingUp, Package, Activity } from 'lucide-react';

interface Order {
  id: string;
  date: string;
  total: number;
  items: {
    productSlug: string;
    productName: string;
    quantity: number;
  }[];
}

export const AdminAnalytics: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('arutala_token');
        const response = await fetch('/api/admin/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (err) {
        console.error("Failed to fetch orders for analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-foreground/40 font-sans tracking-widest text-xs uppercase animate-pulse">Loading Analytics...</div>;
  }

  // 1. Calculate Revenue by Date (last 7 days for example, but we'll group all available for this prototype)
  const revenueByDateMap: Record<string, number> = {};
  orders.forEach(order => {
    const dateObj = new Date(order.date);
    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    revenueByDateMap[dateStr] = (revenueByDateMap[dateStr] || 0) + order.total;
  });

  const chartData = Object.keys(revenueByDateMap).reverse().map(date => ({
    date,
    revenue: revenueByDateMap[date]
  }));
  
  if (chartData.length === 0) {
    // Mock data if no orders
    chartData.push(
      { date: 'Jul 10', revenue: 5000000 },
      { date: 'Jul 11', revenue: 3200000 },
      { date: 'Jul 12', revenue: 8400000 },
      { date: 'Jul 13', revenue: 4100000 },
      { date: 'Jul 14', revenue: 9500000 },
      { date: 'Jul 15', revenue: 6200000 },
      { date: 'Jul 16', revenue: 12500000 }
    );
  }

  // 2. Calculate Top Performing Scents
  const scentCounts: Record<string, { name: string, count: number }> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      if (item.productSlug === 'shipping') return;
      if (!scentCounts[item.productSlug]) {
        scentCounts[item.productSlug] = { name: item.productName, count: 0 };
      }
      scentCounts[item.productSlug].count += item.quantity;
    });
  });

  const totalItemsSold = Object.values(scentCounts).reduce((acc, curr) => acc + curr.count, 0);
  const sortedScents = Object.values(scentCounts).sort((a, b) => b.count - a.count).slice(0, 3);

  // Fallback mock data for top scents if no sales yet
  if (sortedScents.length === 0) {
    sortedScents.push(
      { name: 'Rintik', count: 45 },
      { name: 'Swarna', count: 32 },
      { name: 'Amerta', count: 28 }
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Revenue Chart Section */}
      <div className="bg-background border border-foreground/5 p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex items-center space-x-3 border-b border-foreground/5 pb-4">
          <TrendingUp size={18} className="text-accent-gold" />
          <h3 className="font-serif text-xl text-foreground">Revenue Dynamics</h3>
        </div>
        
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C6A87C" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#C6A87C" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#666' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#666' }}
                tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0px' }}
                itemStyle={{ color: '#C6A87C', fontSize: '12px' }}
                labelStyle={{ color: '#fff', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}
                formatter={(value: number) => [formatRupiah(value), "Revenue"]}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#C6A87C" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Scents Section */}
      <div className="bg-background border border-foreground/5 p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex items-center space-x-3 border-b border-foreground/5 pb-4">
          <Activity size={18} className="text-accent-gold" />
          <h3 className="font-serif text-xl text-foreground">Top Performing Scents</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedScents.map((scent, idx) => {
            const percentage = totalItemsSold > 0 ? Math.round((scent.count / totalItemsSold) * 100) : (45 - idx * 10);
            return (
              <div key={idx} className="relative group overflow-hidden border border-foreground/5 p-6 hover:border-accent-gold/30 transition-colors bg-cream/30">
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-accent-gold/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-widest font-sans text-foreground/40 uppercase">
                      Rank {idx + 1}
                    </span>
                    <span className="text-xs font-serif italic text-accent-gold font-medium">
                      {percentage}% Share
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="font-serif text-2xl text-foreground mb-1">{scent.name}</h4>
                    <p className="text-xs font-sans text-gray-500 uppercase tracking-widest">
                      {scent.count} Units Sold
                    </p>
                  </div>
                  
                  <div className="w-full bg-foreground/5 h-1 relative overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-accent-gold"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
