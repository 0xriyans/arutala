import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { User, Package, MapPin, LogOut, Settings, Clock, Truck, Check, Box, Tag } from 'lucide-react';
import { formatRupiah } from '../data/products';
import { useAuth } from '../context/auth-context';
import { useToast } from '../context/toast-context';

export const ProfileRoute: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'details' | 'addresses'>('orders');
  const { user, isAuthenticated, logout } = useAuth();
  const { addToast } = useToast();

  const [orders, setOrders] = useState<any[]>([]);
  
  // Profile Form
  const [profileForm, setProfileForm] = useState({ name: '', address: '', city: '', postalCode: '' });
  
  // Password Form
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        address: (user as any).address || '',
        city: (user as any).city || '',
        postalCode: (user as any).postalCode || ''
      });
    }
  }, [user]);

  // Fetch orders and stats
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchData = async () => {
      try {
        if (user?.role !== 'admin') {
          // Fetch user orders
          const authToken = localStorage.getItem('arutala_token');
          const res = await fetch('/api/orders/me', { headers: { Authorization: `Bearer ${authToken}` } });
          if (res.ok) {
            const myOrders = await res.json();
            setOrders(myOrders);
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile data", err);
      }
    };
    fetchData();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.hash = '#/login';
      return;
    }
    if (user?.role === 'admin') {
      window.location.hash = '#/admin';
      return;
    }
    document.title = "My Atelier Profile — ARUTALA";
    window.scrollTo({ top: 0 });
  }, [isAuthenticated, user, activeTab]);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Form Handlers
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileForm)
      });
      if (res.ok) {
        addToast('Profile updated successfully', 'success');
        if (token) fetchUser(token);
      } else {
        addToast('Failed to update profile', 'error');
      }
    } catch (err) {
      addToast('An error occurred', 'error');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ old_password: passwordForm.oldPassword, new_password: passwordForm.newPassword })
      });
      if (res.ok) {
        addToast('Password changed successfully', 'success');
        setPasswordForm({ oldPassword: '', newPassword: '' });
      } else {
        const error = await res.json();
        addToast(error.detail || 'Failed to change password', 'error');
      }
    } catch (err) {
      addToast('An error occurred', 'error');
    }
  };

  return (
    <div className="bg-background min-h-screen pt-32 pb-24" id="profile-route-page">
      <div className="max-w-6xl mx-auto px-6 md:px-12 space-y-16">
        
        {/* Header */}
        <div className="space-y-4 border-b border-cream pb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <p className="text-[10px] tracking-[0.4em] uppercase font-sans font-medium text-gray-400">
              {user.title || (user.role === 'admin' ? 'Administrator' : 'Private Client')}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground tracking-tight">
              {user.name.split(' ')[0]} <span className="italic font-normal">{user.name.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-sm font-sans text-gray-500 font-light">
              {user.email}
            </p>
          </div>
          <button 
            onClick={() => {
              logout();
              addToast('Signed out successfully.', 'info');
            }}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-sans font-medium text-foreground/50 hover:text-red-900 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Sidebar Menu */}
          <div className="md:w-1/4 flex flex-row md:flex-col overflow-x-auto gap-2 pb-4 md:pb-0 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
            {user.role !== 'admin' && (
              <button 
                onClick={() => setActiveTab('orders')}
                className={`flex-shrink-0 md:w-full flex items-center gap-3 px-4 py-3 text-left transition-all cursor-pointer rounded-sm md:rounded-none ${activeTab === 'orders' ? 'bg-muted text-foreground md:border-l-2 border-b-2 md:border-b-0 border-foreground' : 'text-foreground/50 hover:bg-muted/50 md:border-l-2 border-b-2 md:border-b-0 border-transparent'}`}
              >
                <Package size={16} />
                <span className="text-[11px] uppercase tracking-wider font-sans font-medium whitespace-nowrap">Order History</span>
              </button>
            )}
            {user.role !== 'admin' && (
              <button 
                onClick={() => setActiveTab('details')}
                className={`flex-shrink-0 md:w-full flex items-center gap-3 px-4 py-3 text-left transition-all cursor-pointer rounded-sm md:rounded-none ${activeTab === 'details' ? 'bg-muted text-foreground md:border-l-2 border-b-2 md:border-b-0 border-foreground' : 'text-foreground/50 hover:bg-muted/50 md:border-l-2 border-b-2 md:border-b-0 border-transparent'}`}
              >
                <User size={16} />
                <span className="text-[11px] uppercase tracking-wider font-sans font-medium whitespace-nowrap">Account Details</span>
              </button>
            )}
            {user.role !== 'admin' && (
              <button 
                onClick={() => setActiveTab('addresses')}
                className={`flex-shrink-0 md:w-full flex items-center gap-3 px-4 py-3 text-left transition-all cursor-pointer rounded-sm md:rounded-none ${activeTab === 'addresses' ? 'bg-muted text-foreground md:border-l-2 border-b-2 md:border-b-0 border-foreground' : 'text-foreground/50 hover:bg-muted/50 md:border-l-2 border-b-2 md:border-b-0 border-transparent'}`}
              >
                <MapPin size={16} />
                <span className="text-[11px] uppercase tracking-wider font-sans font-medium whitespace-nowrap">Addresses</span>
              </button>
            )}
          </div>

          {/* Main Content Area */}
          <div className="md:w-3/4">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl font-light text-foreground border-b border-cream pb-4">Recent Orders</h2>
                  {orders.length > 0 ? (
                    <div className="space-y-8">
                      {orders.map(order => (
                        <div key={order.id} className="border border-cream bg-background hover:border-foreground/20 transition-colors">
                          <div className="p-6 flex flex-col md:flex-row justify-between gap-4 border-b border-cream/50">
                            <div className="space-y-1">
                              <p className="text-xs text-foreground/50 font-sans">Order {order.order_ref || `#${order.id}`}</p>
                              <p className="text-sm font-serif font-medium">{formatRupiah(order.total)}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] uppercase tracking-widest font-sans px-3 py-1 bg-muted text-foreground">
                                {order.status}
                              </span>
                            </div>
                          </div>
                          
                          {/* Visual Tracker */}
                          <div className="p-6 bg-muted/20 overflow-x-auto">
                            <div className="relative flex justify-between items-center w-full min-w-[500px] mx-auto px-4 md:px-12 py-4">
                              <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-0.5 bg-cream -z-10"></div>
                              <div className={`absolute left-10 top-1/2 -translate-y-1/2 h-0.5 bg-accent-gold -z-10 transition-all duration-1000 ${
                                order.status === 'Processing' ? 'w-[33%]' : 
                                order.status === 'Shipped' ? 'w-[66%]' : 
                                order.status === 'Delivered' ? 'w-[calc(100%-80px)]' : 'w-0'
                              }`}></div>
                              
                              <div className="flex flex-col items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${order.status !== 'Pending' ? 'bg-accent-gold border-accent-gold text-white' : 'bg-background border-cream text-foreground/30'}`}>
                                  <Clock size={14} />
                                </div>
                                <span className="text-[9px] uppercase tracking-wider font-sans font-medium">Pending</span>
                              </div>
                              <div className="flex flex-col items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${['Processing', 'Shipped', 'Delivered'].includes(order.status) ? 'bg-accent-gold border-accent-gold text-white' : 'bg-background border-cream text-foreground/30'}`}>
                                  <Package size={14} />
                                </div>
                                <span className="text-[9px] uppercase tracking-wider font-sans font-medium">Processing</span>
                              </div>
                              <div className="flex flex-col items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${['Shipped', 'Delivered'].includes(order.status) ? 'bg-accent-gold border-accent-gold text-white' : 'bg-background border-cream text-foreground/30'}`}>
                                  <Truck size={14} />
                                </div>
                                <span className="text-[9px] uppercase tracking-wider font-sans font-medium">Shipped</span>
                              </div>
                              <div className="flex flex-col items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${order.status === 'Delivered' ? 'bg-accent-gold border-accent-gold text-white' : 'bg-background border-cream text-foreground/30'}`}>
                                  <Check size={14} />
                                </div>
                                <span className="text-[9px] uppercase tracking-wider font-sans font-medium">Delivered</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 border border-cream text-center bg-muted/30">
                      <p className="text-sm text-foreground/50 italic font-serif">You have not placed any orders yet.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'details' && (
                <div className="space-y-12 max-w-2xl">
                  <div className="space-y-6">
                    <h2 className="font-serif text-2xl font-light text-foreground border-b border-cream pb-4">Account Details</h2>
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider font-sans text-foreground/60">Full Name</label>
                        <input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full bg-transparent border-b border-cream py-2 text-sm focus:outline-none focus:border-foreground transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider font-sans text-foreground/60">Email Address (Cannot be changed)</label>
                        <input type="email" disabled value={user.email} className="w-full bg-transparent border-b border-cream py-2 text-sm text-foreground/50 cursor-not-allowed" />
                      </div>
                      <button type="submit" className="px-6 py-3 bg-foreground text-background text-[10px] uppercase tracking-widest font-sans font-medium hover:bg-foreground/90 transition-colors cursor-pointer">
                        Update Profile
                      </button>
                    </form>
                  </div>
                  
                  <div className="space-y-6">
                    <h2 className="font-serif text-2xl font-light text-foreground border-b border-cream pb-4">Change Password</h2>
                    <form onSubmit={handleChangePassword} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider font-sans text-foreground/60">Current Password</label>
                        <input type="password" required value={passwordForm.oldPassword} onChange={e => setPasswordForm({...passwordForm, oldPassword: e.target.value})} className="w-full bg-transparent border-b border-cream py-2 text-sm focus:outline-none focus:border-foreground transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider font-sans text-foreground/60">New Password</label>
                        <input type="password" required minLength={8} value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} className="w-full bg-transparent border-b border-cream py-2 text-sm focus:outline-none focus:border-foreground transition-colors" />
                      </div>
                      <button type="submit" className="px-6 py-3 border border-foreground text-foreground text-[10px] uppercase tracking-widest font-sans font-medium hover:bg-foreground hover:text-background transition-colors cursor-pointer">
                        Update Password
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="space-y-6 max-w-2xl">
                  <div className="flex items-center justify-between border-b border-cream pb-4">
                    <h2 className="font-serif text-2xl font-light text-foreground">Shipping Address</h2>
                  </div>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider font-sans text-foreground/60">Street Address</label>
                      <input type="text" placeholder="e.g. Jl. Sudirman Kav 21" value={profileForm.address} onChange={e => setProfileForm({...profileForm, address: e.target.value})} className="w-full bg-transparent border-b border-cream py-2 text-sm focus:outline-none focus:border-foreground transition-colors" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider font-sans text-foreground/60">City</label>
                        <input type="text" placeholder="e.g. Jakarta Pusat" value={profileForm.city} onChange={e => setProfileForm({...profileForm, city: e.target.value})} className="w-full bg-transparent border-b border-cream py-2 text-sm focus:outline-none focus:border-foreground transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-wider font-sans text-foreground/60">Postal Code</label>
                        <input type="text" placeholder="e.g. 10220" value={profileForm.postalCode} onChange={e => setProfileForm({...profileForm, postalCode: e.target.value})} className="w-full bg-transparent border-b border-cream py-2 text-sm focus:outline-none focus:border-foreground transition-colors" />
                      </div>
                    </div>
                    <button type="submit" className="px-6 py-3 bg-foreground text-background text-[10px] uppercase tracking-widest font-sans font-medium hover:bg-foreground/90 transition-colors cursor-pointer">
                      Save Address
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};
