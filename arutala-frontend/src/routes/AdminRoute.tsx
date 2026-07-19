import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  products, 
  fetchProducts,
  formatRupiah, 
  Product 
} from '../data/products';
import { getSavedPromos, updatePromosInStore, resetPromosToDefault, QuantityPromo } from '../data/promos';
import { 
  Trash2, 
  Edit3, 
  Plus, 
  RotateCcw, 
  Compass, 
  ShoppingBag, 
  Sparkles, 
  Check, 
  Calendar, 
  TrendingUp, 
  User, 
  Mail, 
  MapPin, 
  X, 
  Sliders,
  DollarSign,
  Package,
  Layers,
  Sparkle,
  Tag,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/auth-context';
import { AdminAnalytics } from '../components/admin/AdminAnalytics';
import { AdminCustomers } from '../components/admin/AdminCustomers';
import { AdminInventory } from '../components/admin/AdminInventory';
import { AdminProfile } from '../components/admin/AdminProfile';
import { AdminLookups } from '../components/admin/AdminLookups';

interface Order {
  id: string;
  order_ref?: string;
  date: string;
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
  };
  items: {
    productSlug: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  payment_status?: string;
  tracking_number?: string;
}

interface QuizLog {
  id: string;
  date: string;
  answers: {
    [key: string]: string;
  };
  recommendedProductSlug: string;
}

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const AdminRoute: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'consultations' | 'promos' | 'analytics' | 'customers' | 'inventory' | 'lookups' | 'account'>('dashboard');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [productList, setProductList] = useState<Product[]>(() => [...products]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizLog[]>([]);
  const [promos, setPromos] = useState<QuantityPromo[]>([]);
  
  const [lookupConcentrations, setLookupConcentrations] = useState<{id: number, name: string}[]>([]);
  const [lookupVolumes, setLookupVolumes] = useState<{id: number, name: string}[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [familyFilter, setFamilyFilter] = useState('All');
  const [orderFilter, setOrderFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Form states for Add/Edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    family: 'Floral' as 'Floral' | 'Woody' | 'Citrus',
    subtitle: '',
    description: '',
    price: 3000000,
    primaryImage: '',
    secondaryImage: '',
    tertiaryImage: '',
    scentImage: '',
    ambienceImage: '',
    volume: '100ml / 3.4 FL.OZ',
    concentration: 'Eau de Parfum',
    story: '',
    topNotes: 'Bergamot, Pink Pepper',
    heartNotes: 'Rose, Jasmine',
    baseNotes: 'Sandalwood, Musk',
    showInShop: true,
    showInCollection: true
  });

  // Promo Form states for Add/Edit
  const [isPromoFormOpen, setIsPromoFormOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<QuantityPromo | null>(null);
  const [promoFormData, setPromoFormData] = useState({
    code: '',
    productSlug: 'all',
    minQuantity: 2,
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 10,
    description: ''
  });

  // Success / error toast banner sates
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const { user, isAuthenticated } = useAuth();

  const filteredProducts = productList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFamily = familyFilter === 'All' || p.family === familyFilter;
    return matchesSearch && matchesFamily;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, familyFilter, orderFilter, paymentFilter, activeTab]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      window.location.hash = '#/login';
      return;
    }
    document.title = "Atelier Admin — ARUTALA";
    loadAllData();

    const handleUpdate = () => {
      setProductList([...products]);
    };
    window.addEventListener('maison-products-updated', handleUpdate);
    return () => window.removeEventListener('maison-products-updated', handleUpdate);
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const loadAllData = async () => {
    // Load products from API
    await fetchProducts();
    setProductList([...products]);

    // Load promos
    setPromos(getSavedPromos());

    // Load lookups
    try {
      const concRes = await fetch('/api/lookups/concentrations');
      if (concRes.ok) {
        setLookupConcentrations(await concRes.json());
      }
      const volRes = await fetch('/api/lookups/volumes');
      if (volRes.ok) {
        setLookupVolumes(await volRes.json());
      }
    } catch (e) {
      console.error('Failed to load lookups', e);
    }

    // Load orders from API
    try {
      const token = localStorage.getItem('arutala_token');
      const orderRes = await fetch('/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        const mappedOrders = orderData.map((o: any) => ({
          ...o,
          id: o.id.toString(),
          status: o.status ? o.status.charAt(0).toUpperCase() + o.status.slice(1).toLowerCase() : o.status,
          payment_status: o.payment_status ? o.payment_status.charAt(0).toUpperCase() + o.payment_status.slice(1).toLowerCase() : o.payment_status,
          customer: {
            name: o.customer_name || 'Unknown',
            email: o.customer_email || 'No email',
            address: o.customer_address || '',
            city: o.customer_city || '',
            postalCode: o.customer_postalCode || ''
          }
        }));
        setOrders(mappedOrders.reverse());
      }
    } catch (e) {
      console.error('Failed to load orders', e);
    }

    // Load promos from API
    try {
      const token = localStorage.getItem('arutala_token');
      const promoRes = await fetch('/api/admin/promos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (promoRes.ok) {
        setPromos(await promoRes.json());
      }
    } catch (e) {
      console.error('Failed to load promos', e);
    }

    // Load quiz consultations from API
    fetch(import.meta.env.VITE_API_URL + '/quizzes/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('maison_token')}`
      }
    })
      .then(res => res.json())
      .then(data => setQuizHistory(data))
      .catch(err => {
        console.error("Failed to fetch quizzes", err);
        setQuizHistory([]);
      });
  };

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleOpenAddPromoForm = () => {
    setEditingPromo(null);
    setPromoFormData({
      code: '',
      productSlug: 'all',
      minQuantity: 2,
      discountType: 'percentage',
      discountValue: 10,
      description: ''
    });
    setIsPromoFormOpen(true);
  };

  const handleOpenEditPromoForm = (promo: QuantityPromo) => {
    setEditingPromo(promo);
    setPromoFormData({
      code: promo.code,
      productSlug: promo.productSlug,
      minQuantity: promo.minQuantity,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      description: promo.description
    });
    setIsPromoFormOpen(true);
  };

  const handleTogglePromoStatus = async (promoId: string) => {
    const promo = promos.find(p => p.id === promoId);
    if (!promo) return;
    
    try {
      const token = localStorage.getItem('arutala_token');
      const res = await fetch(`/api/admin/promos/${promoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...promo, isActive: !promo.isActive })
      });
      if (res.ok) {
        const updated = promos.map(p => p.id === promoId ? { ...p, isActive: !p.isActive } : p);
        setPromos(updated);
        showNotification("Promotion status modified.");
      }
    } catch (e) {
      showNotification("Failed to update promo.", "error");
    }
  };

  const handleDeletePromo = async (promoId: string) => {
    if (window.confirm("Discontinue this promotion permanently?")) {
      try {
        const token = localStorage.getItem('arutala_token');
        const res = await fetch(`/api/admin/promos/${promoId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const updated = promos.filter(p => p.id !== promoId);
          setPromos(updated);
          showNotification("Promotion discontinued.");
        }
      } catch (e) {
        showNotification("Failed to delete promo.", "error");
      }
    }
  };

  const handlePromoFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let targetProductName = "Any Fragrance";
    if (promoFormData.productSlug !== 'all') {
      const p = productList.find(prod => prod.slug === promoFormData.productSlug);
      if (p) {
        targetProductName = p.name;
      }
    }

    const payload = {
      code: promoFormData.code.toUpperCase().trim(),
      productSlug: promoFormData.productSlug,
      productName: targetProductName,
      minQuantity: Number(promoFormData.minQuantity),
      discountType: promoFormData.discountType,
      discountValue: Number(promoFormData.discountValue),
      description: promoFormData.description || (promoFormData.code.trim() 
        ? `Get ${promoFormData.discountValue}${promoFormData.discountType === 'percentage' ? '%' : ' IDR'} off with coupon code "${promoFormData.code.toUpperCase().trim()}"`
        : `Automatic discount on buying ${promoFormData.minQuantity} or more items`),
      isActive: editingPromo ? editingPromo.isActive : true
    };

    try {
      const token = localStorage.getItem('arutala_token');
      const url = editingPromo ? `/api/admin/promos/${editingPromo.id}` : '/api/admin/promos';
      const method = editingPromo ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        const savedPromo = await res.json();
        let updatedList = [...promos];
        if (editingPromo) {
          updatedList = updatedList.map(p => p.id === editingPromo.id ? savedPromo : p);
          showNotification("Promotion formulation refined.");
        } else {
          updatedList.unshift(savedPromo);
          showNotification("New promotional campaign launched.");
        }
        setPromos(updatedList);
        setIsPromoFormOpen(false);
      } else {
        showNotification("Failed to save promo. Code must be unique.", "error");
      }
    } catch (e) {
      showNotification("Network error.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenAddForm = () => {
    console.log("Opening Add form");
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      family: 'Floral',
      subtitle: '',
      description: '',
      price: 3300000,
      primaryImage: '',
      secondaryImage: '',
      tertiaryImage: '',
      scentImage: '',
      ambienceImage: '',
      volume: '',
      concentration: '',
      story: '',
      topNotes: '',
      heartNotes: '',
      baseNotes: '',
      showInShop: true,
      showInCollection: true
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'hidden';
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      slug: prod.slug,
      family: prod.family,
      subtitle: prod.subtitle,
      description: prod.description,
      price: prod.price,
      primaryImage: prod.images.primary,
      secondaryImage: prod.images.secondary,
      tertiaryImage: prod.images.tertiary || '',
      scentImage: prod.images.scent || '',
      ambienceImage: prod.images.ambience || '',
      volume: prod.volume,
      concentration: prod.concentration,
      story: prod.story,
      topNotes: prod.notes.top.join(', '),
      heartNotes: prod.notes.heart.join(', '),
      baseNotes: prod.notes.base.join(', '),
      showInShop: prod.showInShop !== false,
      showInCollection: prod.showInCollection !== false
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.style.overflow = 'hidden';
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    document.body.style.overflow = 'auto';
    setIsFormOpen(false);
  };

  const handleDeleteProduct = async (slug: string) => {
    if (window.confirm("Are you sure you want to retire this masterwork? This will remove it from the boutique list.")) {
      try {
        const token = localStorage.getItem('arutala_token');
        const res = await fetch(`/api/products/${slug}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          await fetchProducts();
          setProductList([...products]);
          showNotification("Fragrance successfully retired from boutique selection.");
        } else {
          showNotification("Failed to delete product.", "error");
        }
      } catch (e) {
        showNotification("Network error.", "error");
      }
    }
  };

  const handleResetCatalog = async () => {
    if (window.confirm("Reload catalog from the database? Any unsaved local changes will be discarded.")) {
      await fetchProducts();
      setProductList([...products]);
      showNotification("Catalog reloaded from database.");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-generate slug if empty
    const slugValue = formData.slug.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    if (!slugValue) {
      showNotification("A unique URL slug is required or could not be generated.", "error");
      return;
    }

    setIsSubmitting(true);

    // Prepare note list arrays
    const topArray = formData.topNotes.split(',').map(n => n.trim()).filter(Boolean);
    const heartArray = formData.heartNotes.split(',').map(n => n.trim()).filter(Boolean);
    const baseArray = formData.baseNotes.split(',').map(n => n.trim()).filter(Boolean);

    // Build some automatic note-descriptions to satisfy schema
    const noteDescriptions: { [key: string]: string } = {};
    [...topArray, ...heartArray, ...baseArray].forEach(note => {
      noteDescriptions[note] = `An essential scent facet introducing bespoke characteristics to the formula.`;
    });

    const finalProduct: Product = {
      slug: slugValue,
      name: formData.name,
      family: formData.family,
      subtitle: formData.subtitle,
      description: formData.description,
      price: Number(formData.price),
      images: {
        primary: formData.primaryImage,
        secondary: formData.secondaryImage,
        tertiary: formData.tertiaryImage,
        scent: formData.scentImage,
        ambience: formData.ambienceImage
      },
      notes: {
        top: topArray,
        heart: heartArray,
        base: baseArray
      },
      noteDescriptions,
      volume: formData.volume,
      concentration: formData.concentration,
      story: formData.story || `A signature masterpiece representing pure sensory luxury and architectural scent balance.`,
      showInShop: formData.showInShop,
      showInCollection: formData.showInCollection
    };

    const token = localStorage.getItem('arutala_token');
    try {
      if (editingProduct) {
        // PUT update
        const res = await fetch(`/api/products/${editingProduct.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(finalProduct)
        });
        if (res.ok) {
          showNotification(`"${formData.name}" details successfully updated.`);
        } else {
          showNotification("Failed to update product.", "error");
          return;
        }
      } else {
        // POST create
        if (productList.some(p => p.slug === slugValue)) {
          showNotification("A fragrance with this URL slug already exists. Please make it unique.", "error");
          return;
        }
        const res = await fetch('/api/products/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(finalProduct)
        });
        if (res.ok) {
          showNotification(`"${formData.name}" added to the boutique collection.`);
        } else {
          showNotification("Failed to create product.", "error");
          return;
        }
      }

      // Refresh from API
      await fetchProducts(true);
      setProductList([...products]);
      handleCloseForm();
    } catch (e) {
      showNotification("Network error.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Orders managers
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const token = localStorage.getItem('arutala_token');
      const res = await fetch(`/api/orders/${orderId}/status?status=${status}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() as Order['status'];
        const updated = orders.map(o => o.id === orderId ? { ...o, status: normalizedStatus } : o);
        setOrders(updated);
        showNotification(`Order ${orderId} marked as ${status}.`);
      }
    } catch (e) {
      showNotification("Failed to update order status.", "error");
    }
  };

  const handleSaveTrackingNumber = async (orderId: string, trackingNumber: string) => {
    if (!trackingNumber.trim()) return;
    try {
      const token = localStorage.getItem('arutala_token');
      const res = await fetch(`/api/orders/${orderId}/tracking`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ tracking_number: trackingNumber })
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        const normalizedStatus = updatedOrder.status ? updatedOrder.status.charAt(0).toUpperCase() + updatedOrder.status.slice(1).toLowerCase() : updatedOrder.status;
        const updated = orders.map(o => o.id === orderId ? { ...o, status: normalizedStatus, tracking_number: updatedOrder.tracking_number } : o);
        setOrders(updated);
        showNotification(`Tracking number saved and notification email sent!`);
      }
    } catch (e) {
      showNotification("Failed to save tracking number.", "error");
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm(`Delete order logs for ${orderId}?`)) {
      const updated = orders.filter(o => o.id !== orderId);
      setOrders(updated);
      localStorage.setItem('maison_orders', JSON.stringify(updated));
      showNotification("Order logs removed.");
    }
  };

  // Consultations logs managers
  const handleDeleteQuizLog = (quizId: string) => {
    if (window.confirm("Are you sure you want to delete this consultation log?")) {
      fetch(import.meta.env.VITE_API_URL + '/quizzes/' + quizId, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('maison_token')}`
        }
      }).then(() => {
        const updated = quizHistory.filter(q => q.id !== quizId);
        setQuizHistory(updated);
        showNotification("Consultation history log deleted.");
      }).catch(err => console.error("Failed to delete quiz:", err));
    }
  };

  const handleClearAllQuizzes = () => {
    if (window.confirm("Are you sure you want to clear ALL consultation logs? This cannot be undone.")) {
      fetch(import.meta.env.VITE_API_URL + '/quizzes/', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('maison_token')}`
        }
      }).then(() => {
        setQuizHistory([]);
        showNotification("Consultations log database wiped.");
      }).catch(err => console.error("Failed to clear quizzes:", err));
    }
  };

  // Calculate high level business metrics
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const activeOrdersCount = orders.filter(o => o.status === 'Processing' || o.status === 'Shipped').length;

  return (
    <div className="bg-background min-h-screen pt-32 pb-24 text-foreground selection:bg-accent flex flex-row w-full px-4 md:px-8 xl:px-12" id="admin-panel-container">
      
      {/* Sidebar Navigation */}
      <aside
        style={isSidebarExpanded
          ? { width: '256px', minWidth: '256px', maxWidth: '256px', flex: '0 0 256px' }
          : { width: '64px', minWidth: '64px', maxWidth: '64px', flex: '0 0 64px' }
        }
        className="border-r border-cream/50 flex flex-col sticky top-32 h-[calc(100vh-10rem)] pr-6 flex-shrink-0"
      >
        <div className="flex justify-between items-center mb-8 px-2">
          {isSidebarExpanded && <span className="text-[10px] tracking-[0.2em] font-bold font-sans uppercase">Menu</span>}
          <button onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} className="p-2 hover:bg-foreground/5 rounded-full text-foreground/50 transition-colors">
            {isSidebarExpanded ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: '100%', flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingBottom: '2rem' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'inventory', label: 'Inventory', icon: Package },
            { id: 'customers', label: 'Clients', icon: User },
            { id: 'products', label: 'Catalog', count: productList.length, icon: Layers },
            { id: 'promos', label: 'Promotions', count: promos.length, icon: Tag },
            { id: 'orders', label: 'Orders', count: orders.length, icon: ShoppingBag },
            { id: 'consultations', label: 'Consultations', count: quizHistory.length, icon: Sparkles },
            { id: 'lookups', label: 'Master Data', icon: Database },
            { id: 'account', label: 'Account Profile', icon: User }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return isSidebarExpanded ? (
              <div
                key={tab.id}
                role="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`group flex items-center w-full px-4 py-3 mb-1 cursor-pointer transition-all duration-300 border-l-[3px] ${
                  isActive 
                    ? 'border-foreground bg-foreground/[0.03]' 
                    : 'border-transparent hover:border-foreground/20 hover:bg-foreground/[0.01]'
                }`}
              >
                <Icon 
                  size={15} 
                  className={`flex-shrink-0 mr-4 transition-colors ${
                    isActive ? 'text-foreground' : 'text-foreground/40 group-hover:text-foreground/70'
                  }`} 
                />
                <span 
                  className={`flex-1 text-[10px] uppercase tracking-[0.2em] font-sans whitespace-nowrap overflow-hidden text-ellipsis transition-all ${
                    isActive ? 'font-bold text-foreground' : 'font-medium text-foreground/50 group-hover:text-foreground/80'
                  }`}
                >
                  {tab.label}
                </span>
                {tab.count !== undefined && (
                  <span 
                    className={`flex-shrink-0 ml-3 text-[9px] font-mono w-5 h-5 flex items-center justify-center rounded-full border transition-colors ${
                      isActive 
                        ? 'border-foreground/20 text-foreground bg-foreground/5' 
                        : 'border-foreground/10 text-foreground/40 group-hover:border-foreground/20'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </div>
            ) : (
              <div
                key={tab.id}
                role="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`group flex justify-center items-center w-full py-4 mb-1 cursor-pointer transition-all duration-300 border-l-[3px] relative ${
                  isActive 
                    ? 'border-foreground bg-foreground/[0.03]' 
                    : 'border-transparent hover:border-foreground/20'
                }`}
                title={tab.label}
              >
                <Icon 
                  size={18} 
                  className={`transition-colors ${
                    isActive ? 'text-foreground' : 'text-foreground/40 group-hover:text-foreground/70'
                  }`} 
                />
                {tab.count !== undefined && (
                  <span className={`absolute top-2 right-3 w-1.5 h-1.5 rounded-full ${isActive ? 'bg-foreground' : 'bg-foreground/30'}`} />
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full min-w-0 pl-6 md:pl-10 space-y-10 pb-12">
        
        {/* Unified Global Header for All Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-cream pb-8">
          <div className="space-y-2">
            <span className="text-[10px] tracking-[0.25em] uppercase text-foreground/50 font-sans font-bold">
              {activeTab === 'dashboard' ? 'Atelier Management Board' : 
               activeTab === 'analytics' ? 'Performance Metrics' : 
               activeTab === 'inventory' ? 'Stock & Logistics' : 
               activeTab === 'customers' ? 'Client Relations' : 
               activeTab === 'products' ? 'Product Management' : 
               activeTab === 'promos' ? 'Marketing & Offers' : 
               activeTab === 'orders' ? 'Sales & Fulfillment' : 
               activeTab === 'consultations' ? 'Sensory Diagnostics' : 
               'Administrator Settings'}
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-light text-foreground tracking-tight">
              {activeTab === 'dashboard' ? "Arutala Admin" : 
               activeTab === 'analytics' ? 'Analytics Dashboard' : 
               activeTab === 'inventory' ? 'Inventory Management' : 
               activeTab === 'customers' ? 'Client Registry' : 
               activeTab === 'products' ? 'Boutique Catalog' : 
               activeTab === 'promos' ? 'Quantity-Based Promotions' : 
               activeTab === 'orders' ? 'Simulated Orders' : 
               activeTab === 'consultations' ? 'Olfactive Consultations' : 
               'Account Profile'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            {activeTab === 'products' && (
              <>
                <button
                  onClick={handleResetCatalog}
                  className="px-5 py-3 border border-foreground/10 text-[10px] tracking-widest uppercase font-sans font-semibold text-foreground/70 hover:text-foreground hover:border-foreground hover:bg-foreground/5 transition-all duration-300 flex items-center gap-2"
                >
                  <RotateCcw size={12} />
                  Factory Reset
                </button>
                <button
                  onClick={handleOpenAddForm}
                  className="px-5 py-3 bg-foreground text-cream text-[10px] tracking-widest uppercase font-sans font-semibold hover:bg-foreground/90 transition-all duration-300 flex items-center gap-2 shadow-sm"
                >
                  <Plus size={14} />
                  Craft New Fragrance
                </button>
              </>
            )}
            
            {activeTab === 'promos' && (
              <button
                onClick={handleOpenAddPromoForm}
                className="px-5 py-3 bg-foreground text-cream text-[10px] tracking-widest uppercase font-sans font-semibold hover:bg-foreground/90 transition-all duration-300 flex items-center gap-2 shadow-sm"
              >
                <Plus size={14} />
                Add New Promo
              </button>
            )}
            
            {activeTab === 'consultations' && quizHistory.length > 0 && (
              <button
                onClick={handleClearAllQuizzes}
                className="px-5 py-3 border border-rose-200 text-rose-600 text-[10px] tracking-widest uppercase font-sans font-semibold hover:bg-rose-50 transition-all duration-300 flex items-center gap-2"
              >
                <Trash2 size={12} />
                Clear Logs
              </button>
            )}
          </div>
        </div>


        {/* Global Notifications Toast */}
        {typeof document !== 'undefined' ? createPortal(
          <div className="fixed top-6 right-6 z-[9999] pointer-events-none">
            <AnimatePresence>
              {notification && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className={`p-4 border text-xs font-sans tracking-wide flex items-center justify-between shadow-xl min-w-[300px] pointer-events-auto ${
                    notification.type === 'success' 
                      ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800 backdrop-blur-sm' 
                      : 'bg-rose-50/90 border-rose-200 text-rose-800 backdrop-blur-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Check size={16} />
                    <span>{notification.text}</span>
                  </div>
                  <button onClick={() => setNotification(null)} className="opacity-60 hover:opacity-100 cursor-pointer">
                    <X size={16} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>,
          document.body
        ) : null}

        {/* Dynamic High Level Business Metrics Cards */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Catalog Count */}
            <div className="bg-background border border-cream p-6 space-y-4">
              <div className="flex items-center justify-between text-foreground/40">
                <span className="text-[10px] tracking-widest uppercase font-sans">Boutique Catalog</span>
                <Package size={16} />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-3xl font-light">{productList.length}</h3>
                <p className="text-[10px] text-foreground/40 font-sans font-medium">Active masterworks listed</p>
              </div>
            </div>

            {/* Card 2: Revenue */}
            <div className="bg-background border border-cream p-6 space-y-4">
              <div className="flex items-center justify-between text-foreground/40">
                <span className="text-[10px] tracking-widest uppercase font-sans">Simulated Revenue</span>
                <DollarSign size={16} />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-3xl font-light text-foreground">{formatRupiah(totalRevenue)}</h3>
                <p className="text-[10px] text-emerald-600 font-sans font-medium flex items-center gap-1">
                  <TrendingUp size={10} /> Live simulation sales
                </p>
              </div>
            </div>

            {/* Card 3: Orders count */}
            <div className="bg-background border border-cream p-6 space-y-4">
              <div className="flex items-center justify-between text-foreground/40">
                <span className="text-[10px] tracking-widest uppercase font-sans">Simulated Orders</span>
                <ShoppingBag size={16} />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-3xl font-light">{orders.length}</h3>
                <p className="text-[10px] text-foreground/40 font-sans font-medium">
                  {activeOrdersCount} processing / shipped
                </p>
              </div>
            </div>

            {/* Card 4: Consultations count */}
            <div className="bg-background border border-cream p-6 space-y-4">
              <div className="flex items-center justify-between text-foreground/40">
                <span className="text-[10px] tracking-widest uppercase font-sans">Consultations Taken</span>
                <Sparkles size={16} />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-3xl font-light">{quizHistory.length}</h3>
                <p className="text-[10px] text-amber-700 font-sans font-medium flex items-center gap-1">
                  <Sparkle size={10} /> Scent quiz engagements
                </p>
              </div>
            </div>

          </div>
        )}
        {/* Active Tab Screen Panels */}
        <div>
          {activeTab === 'analytics' && <AdminAnalytics />}
          {activeTab === 'customers' && <AdminCustomers />}
          {activeTab === 'inventory' && <AdminInventory />}
          {activeTab === 'lookups' && <AdminLookups />}
          {activeTab === 'account' && <AdminProfile />}
          
          {/* TAB 1: Fragrances Catalog */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              {/* Top Action Bar: Search & Filter */}
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                  <input 
                    type="text" 
                    placeholder="Search masterworks..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-cream bg-background text-xs focus:outline-none focus:border-foreground transition-colors"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="relative flex-1 md:flex-none">
                    <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                    <select
                      value={familyFilter}
                      onChange={(e) => setFamilyFilter(e.target.value)}
                      className="w-full md:w-auto pl-9 pr-8 py-2 border border-cream bg-background text-xs appearance-none focus:outline-none focus:border-foreground transition-colors cursor-pointer"
                    >
                      <option value="All">All Families</option>
                      <option value="Floral">Floral</option>
                      <option value="Woody">Woody</option>
                      <option value="Citrus">Citrus</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map(product => (
                  <div key={product.slug} className="group border border-cream bg-background flex flex-col overflow-hidden hover:border-foreground/30 transition-colors">
                    <div className="aspect-[4/5] bg-gray-100 overflow-hidden relative">
                      <img src={product.images.primary} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-4 left-4">
                        <span className={`px-2 py-1 text-[9px] uppercase tracking-widest font-semibold shadow-sm ${
                          product.family === 'Woody' ? 'bg-amber-50 text-amber-800' :
                          product.family === 'Floral' ? 'bg-rose-50 text-rose-800' :
                          'bg-sky-50 text-sky-800'
                        }`}>
                          {product.family}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h4 className="font-serif text-xl text-foreground font-medium">{product.name}</h4>
                      <p className="text-xs text-foreground/50 font-serif italic line-clamp-1 mt-1 mb-4">{product.subtitle}</p>
                      
                      <div className="mt-auto space-y-4">
                        <div className="flex justify-between items-end border-t border-cream/50 pt-4">
                          <div>
                            <p className="text-[10px] text-foreground/40 font-mono mb-1">{product.volume}</p>
                            <p className="font-mono text-sm font-medium">{formatRupiah(product.price)}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleOpenEditForm(product)} className="p-2 border border-cream text-foreground/60 hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
                              <Edit3 size={14} />
                            </button>
                            <button onClick={() => handleDeleteProduct(product.slug)} className="p-2 border border-cream text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-colors cursor-pointer">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {paginatedProducts.length === 0 && (
                <div className="py-20 text-center space-y-3 bg-background border border-cream">
                  <Compass className="mx-auto text-foreground/20 animate-pulse" size={32} />
                  <p className="font-serif italic text-lg text-foreground/60">No boutique scents match your criteria.</p>
                  <p className="text-xs text-foreground/40 max-w-xs mx-auto">
                    Try adjusting your filters or search query.
                  </p>
                  <button
                    onClick={handleResetCatalog}
                    className="px-4 py-2 border border-foreground/30 text-[10px] tracking-widest uppercase font-sans font-medium hover:bg-foreground/5 transition-colors mt-4 cursor-pointer"
                  >
                    Restore Base Collection
                  </button>
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-cream">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-cream disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-mono text-foreground/60">Page {currentPage} of {totalPages}</span>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-cream disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: Customer Orders Log */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center bg-background border border-cream px-6 py-4">
                <div>
                  <h2 className="font-serif text-lg text-foreground">Filter Orders</h2>
                </div>
                <div className="flex gap-4">
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="border border-cream bg-transparent px-4 py-2 text-xs font-mono focus:outline-none focus:border-accent-gold cursor-pointer"
                  >
                    <option value="All">All Payments</option>
                    <option value="Pending">Pending</option>
                    <option value="Settlement">Settlement</option>
                    <option value="Expire">Expire</option>
                    <option value="Cancel">Cancel</option>
                  </select>
                  <select
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value)}
                    className="border border-cream bg-transparent px-4 py-2 text-xs font-mono focus:outline-none focus:border-accent-gold cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="bg-background border border-cream overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted border-b border-cream text-[10px] tracking-wider uppercase font-sans text-foreground/40 font-semibold">
                        <th className="px-6 py-4">Order Details</th>
                        <th className="px-6 py-4">Customer info</th>
                        <th className="px-6 py-4">Purchased masterworks</th>
                        <th className="px-6 py-4">Value</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream text-xs font-sans text-foreground/70">
                      {(() => {
                        const filteredOrders = orders.filter(o => 
                          (orderFilter === 'All' || o.status === orderFilter) && 
                          (paymentFilter === 'All' || o.payment_status === paymentFilter)
                        );
                        const totalOrdersPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
                        const paginatedOrders = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
                        
                        return (
                          <>
                            {paginatedOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                          
                          {/* Order metadata */}
                          <td className="px-6 py-4 space-y-1">
                            <span className="font-mono text-sm font-semibold text-foreground">
                              {order.order_ref || `#${order.id}`}
                            </span>
                            <p className="text-[10px] text-foreground/40 flex items-center gap-1">
                              <Calendar size={10} />
                              {new Date(order.date).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            <p className="text-[9px] uppercase tracking-widest text-foreground/60">
                              Payment: 
                              <span className={`ml-1 font-bold ${order.payment_status === 'Paid' || order.payment_status === 'Settlement' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {order.payment_status}
                              </span>
                            </p>
                          </td>

                          {/* Customer address */}
                          <td className="px-6 py-4 space-y-1">
                            <p className="font-medium text-foreground flex items-center gap-1">
                              <User size={10} className="text-foreground/30" />
                              {order.customer.name}
                            </p>
                            <p className="text-[10px] text-foreground/40 flex items-center gap-1">
                              <Mail size={10} className="text-foreground/30" />
                              {order.customer.email}
                            </p>
                            <p className="text-[10px] text-foreground/40 flex items-start gap-1 line-clamp-1 max-w-[200px]" title={`${order.customer.address}, ${order.customer.city} ${order.customer.postalCode}`}>
                              <MapPin size={10} className="text-foreground/30 mt-0.5 flex-shrink-0" />
                              {order.customer.address}, {order.customer.city}
                            </p>
                          </td>

                          {/* Line items thumbnail list */}
                          <td className="px-6 py-4">
                            <div className="space-y-1.5 max-w-[250px]">
                              {order.items.map((item, idx) => {
                                const matchedProduct = products.find(p => p.slug === item.product_slug);
                                const imageSrc = matchedProduct ? matchedProduct.images.primary : null;
                                
                                return (
                                  <div key={idx} className="flex items-center gap-2">
                                    <div className="w-6 h-8 bg-gray-50 overflow-hidden border border-cream flex-shrink-0">
                                      {imageSrc ? (
                                        <img src={imageSrc} alt="" className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full bg-foreground/5"></div>
                                      )}
                                    </div>
                                    <p className="text-[11px] font-medium text-foreground truncate flex-grow">
                                      {item.product_name} 
                                      <span className="text-foreground/40 pl-1 font-mono font-normal">x{item.quantity}</span>
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </td>

                          {/* Total Value */}
                          <td className="px-6 py-4 font-mono font-medium text-foreground">
                            {formatRupiah(order.total)}
                          </td>

                          {/* Status & Tracking */}
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex px-2 py-0.5 text-[9px] uppercase tracking-widest font-bold border rounded-none w-max ${
                                  order.status === 'Processing' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                  order.status === 'Shipped' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                  order.status === 'Delivered' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                                  'bg-rose-50 border-rose-200 text-rose-700'
                                }`}>
                                  {order.status}
                                </span>
                                <select 
                                  value={order.status}
                                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any)}
                                  className="bg-transparent border border-foreground/10 text-[9px] uppercase tracking-wider px-1 py-0.5 outline-none font-sans font-medium hover:border-foreground/40 cursor-pointer"
                                >
                                  <option value="Processing">Processing</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </div>

                              {/* Tracking Number Input */}
                              {(order.payment_status === 'Paid' || order.payment_status === 'Settlement') && order.status !== 'Cancelled' && (
                                <div className="mt-2 space-y-1">
                                  <p className="text-[9px] uppercase tracking-widest text-foreground/50">Tracking Resi</p>
                                  <div className="flex items-center gap-1">
                                    <input 
                                      type="text" 
                                      id={`tracking-${order.id}`}
                                      defaultValue={order.tracking_number || ''}
                                      placeholder="JNE123456789"
                                      className="border border-cream bg-transparent px-2 py-1 text-xs font-mono w-28 focus:outline-none focus:border-accent-gold"
                                    />
                                    <button 
                                      onClick={() => {
                                        const el = document.getElementById(`tracking-${order.id}`) as HTMLInputElement;
                                        if (el) handleSaveTrackingNumber(order.id, el.value);
                                      }}
                                      className="bg-foreground text-cream px-2 py-1 text-[9px] uppercase tracking-wider hover:bg-accent-gold transition-colors"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-all rounded-none"
                              title="Delete log"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                            ))}
                          </>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>

                {orders.length === 0 && (
                  <div className="py-20 text-center space-y-2">
                    <ShoppingBag className="mx-auto text-foreground/20" size={32} />
                    <p className="font-serif italic text-lg text-foreground/60">No simulated orders recorded.</p>
                    <p className="text-xs text-foreground/40 max-w-xs mx-auto">
                      Place an order by selecting a fragrance, proceeding to checkout inside the shopping bag, and completing the order.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Pagination Controls for Orders */}
              {(() => {
                const filteredOrders = orders.filter(o => 
                  (orderFilter === 'All' || o.status === orderFilter) && 
                  (paymentFilter === 'All' || o.payment_status === paymentFilter)
                );
                return Math.ceil(filteredOrders.length / ITEMS_PER_PAGE) > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-cream">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-cream disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
                    >
                      &lt;
                    </button>
                    <span className="text-xs font-mono text-foreground/60">Page {currentPage} of {Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)}</span>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredOrders.length / ITEMS_PER_PAGE), p + 1))}
                      disabled={currentPage === Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)}
                      className="p-2 border border-cream disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
                    >
                      &gt;
                    </button>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 3: Sensory Quiz Consultations Logs */}
          {activeTab === 'consultations' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-widest uppercase font-semibold text-foreground/40">
                  Olfactive Consultation Archives
                </span>
                {quizHistory.length > 0 && (
                  <button
                    onClick={handleClearAllQuizzes}
                    className="text-[10px] tracking-wider uppercase font-sans text-rose-600 hover:text-rose-800 transition-colors flex items-center gap-1.5 font-semibold"
                  >
                    <Trash2 size={12} />
                    Clear History logs
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(() => {
                  const totalQuizPages = Math.ceil(quizHistory.length / ITEMS_PER_PAGE);
                  const paginatedQuiz = quizHistory.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
                  
                  return (
                    <>
                      {paginatedQuiz.map((quiz) => (
                        <div key={quiz.id} className="bg-background border border-cream p-6 space-y-4 relative flex flex-col justify-between">
                          
                          <div className="space-y-3">
                            {/* Meta */}
                            <div className="flex items-center justify-between border-b border-muted pb-2 text-[10px] tracking-wide font-mono text-foreground/30">
                              <span>{quiz.id}</span>
                              <span>
                                {new Date(quiz.date).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>

                            {/* Answers Map */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {Object.entries(quiz.answers).map(([question, answer], idx) => (
                                <div key={idx} className="bg-foreground/5 p-3">
                                  <span className="block text-[8px] tracking-widest uppercase font-sans text-gray-400 mb-1">{question}</span>
                                  <p className="font-serif italic text-xs text-foreground/80">"{answer}"</p>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex items-center justify-between border-t border-foreground/5 pt-4">
                              <span className="text-[9px] tracking-[0.2em] uppercase font-sans font-semibold text-accent-gold">Matched Signature</span>
                              <span className="font-serif font-semibold text-foreground text-sm uppercase">{quiz.recommendedProductSlug}</span>
                            </div>
                            
                            <div className="flex justify-end pt-2">
                              <button
                                onClick={() => { window.location.hash = `#/product/${quiz.recommendedProductSlug}`; }}
                                className="text-[10px] uppercase font-sans font-semibold tracking-wider text-foreground hover:underline border border-foreground/10 px-2.5 py-1 bg-background"
                              >
                                View Scent
                              </button>
                            </div>
                          </div>

                          {/* Delete single log button floating */}
                          <button
                            onClick={() => handleDeleteQuizLog(quiz.id)}
                            className="absolute top-2 right-2 p-1 text-foreground/30 hover:text-rose-600 transition-colors"
                            title="Delete log entry"
                          >
                            <X size={12} />
                          </button>

                        </div>
                      ))}
                    </>
                  );
                })()}

                {quizHistory.length === 0 && (
                  <div className="col-span-full py-20 text-center space-y-2 bg-background border border-cream">
                    <Sparkles className="mx-auto text-foreground/20 animate-pulse" size={32} />
                    <p className="font-serif italic text-lg text-foreground/60">No consultations on file.</p>
                    <p className="text-xs text-foreground/40 max-w-xs mx-auto">
                      Take the Fragrance Aura Match Quiz on the homepage to register sensory diagnostic entries here!
                    </p>
                  </div>
                )}
              </div>
              
              {/* Pagination Controls for Consultations */}
              {Math.ceil(quizHistory.length / ITEMS_PER_PAGE) > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-cream">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-cream disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
                  >
                    &lt;
                  </button>
                  <span className="text-xs font-mono text-foreground/60">Page {currentPage} of {Math.ceil(quizHistory.length / ITEMS_PER_PAGE)}</span>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(quizHistory.length / ITEMS_PER_PAGE), p + 1))}
                    disabled={currentPage === Math.ceil(quizHistory.length / ITEMS_PER_PAGE)}
                    className="p-2 border border-cream disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
                  >
                    &gt;
                  </button>
                </div>
              )}

            </div>
          )}

          {/* TAB 4: Quantity-Based Promotions */}
          {activeTab === 'promos' && (
            <div className="space-y-6 animate-fade-in">
              
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-widest uppercase font-semibold text-foreground/40 font-sans">
                  Quantity-Based Promotions List
                </span>
              </div>

              {/* Table List of Promos */}
              <div className="bg-background border border-cream overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted border-b border-cream text-[10px] tracking-wider uppercase font-sans text-foreground/40 font-semibold">
                        <th className="px-6 py-4">Promo Details</th>
                        <th className="px-6 py-4">Target Product</th>
                        <th className="px-6 py-4">Min Quantity</th>
                        <th className="px-6 py-4">Discount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream text-xs font-sans text-foreground/70">
                      {(() => {
                        const totalPromoPages = Math.ceil(promos.length / ITEMS_PER_PAGE);
                        const paginatedPromos = promos.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
                        
                        return (
                          <>
                            {paginatedPromos.map((promo) => (
                              <tr key={promo.id} className="hover:bg-gray-50/50 transition-colors">
                                {/* Code and Description */}
                                <td className="px-6 py-4 space-y-1">
                                  <div className="flex items-center gap-2">
                                    {promo.code ? (
                                      <span className="font-mono text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200/60 px-2 py-0.5">
                                        {promo.code}
                                      </span>
                                    ) : (
                                      <span className="font-sans text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 uppercase tracking-wider">
                                        Automatic
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-foreground/60">{promo.description}</p>
                                </td>

                                {/* Target Product */}
                                <td className="px-6 py-4">
                                  <span className="font-serif text-sm font-medium text-foreground">
                                    {promo.productName}
                                  </span>
                                  <p className="text-[10px] font-mono text-foreground/40">{promo.productSlug}</p>
                                </td>

                                {/* Min Quantity */}
                                <td className="px-6 py-4 font-mono font-medium text-foreground">
                                  {promo.minQuantity} items
                                </td>

                                {/* Discount Value */}
                                <td className="px-6 py-4 font-mono font-semibold text-foreground">
                                  {promo.discountType === 'percentage' 
                                    ? `${promo.discountValue}%` 
                                    : formatRupiah(promo.discountValue)
                                  }
                                </td>

                                {/* Status toggle button */}
                                <td className="px-6 py-4">
                                  <button
                                    onClick={() => handleTogglePromoStatus(promo.id)}
                                    className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                                      promo.isActive 
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                                        : 'bg-gray-50 border-gray-200 text-gray-400'
                                    }`}
                                  >
                                    {promo.isActive ? 'Active' : 'Inactive'}
                                  </button>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => handleOpenEditPromoForm(promo)}
                                      className="p-2 text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all"
                                      title="Edit Promo"
                                    >
                                      <Edit3 size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleDeletePromo(promo.id)}
                                      className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 transition-all"
                                      title="Delete Promo"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>

                {promos.length === 0 && (
                  <div className="py-20 text-center space-y-3 bg-background">
                    <Tag className="mx-auto text-foreground/20" size={32} />
                    <p className="font-serif italic text-lg text-foreground/60">No quantity promotions configured.</p>
                    <p className="text-xs text-foreground/40 max-w-xs mx-auto font-sans">
                      Click "Add New Promo" to configure custom bulk or coupon code incentives.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Pagination Controls for Promotions */}
              {Math.ceil(promos.length / ITEMS_PER_PAGE) > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-cream">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-cream disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
                  >
                    &lt;
                  </button>
                  <span className="text-xs font-mono text-foreground/60">Page {currentPage} of {Math.ceil(promos.length / ITEMS_PER_PAGE)}</span>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(Math.ceil(promos.length / ITEMS_PER_PAGE), p + 1))}
                    disabled={currentPage === Math.ceil(promos.length / ITEMS_PER_PAGE)}
                    className="p-2 border border-cream disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
                  >
                    &gt;
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </main>

      {/* Slide-out Panel Form (for Add/Edit Products) */}
      {typeof document !== 'undefined' ? createPortal(
        <>
          <AnimatePresence>
        {isFormOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => handleCloseForm()}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm cursor-pointer"
          />
        )}
        
        {isFormOpen && (
          <motion.div
            key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-xl bg-background p-8 border-l border-cream shadow-2xl flex flex-col overflow-y-auto"
            >
              <div className="space-y-6 pb-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-cream pb-4">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-foreground/40 font-sans font-semibold">Boutique Scent formulation</span>
                  <h2 className="font-serif text-2xl text-foreground font-light">
                    {editingProduct ? `Refine ${editingProduct.name}` : "Craft New Scent"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => handleCloseForm()}
                  className="p-1 rounded-full text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-all"
                >
                  <X size={20} />
                </button>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-5 text-xs text-foreground/70" id="product-form">
                  
                  {/* Name and Slug */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-foreground/40 font-semibold">Fragrance Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Rêve Mystique"
                        className="w-full border border-cream px-3 py-2 focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none font-serif text-sm text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-foreground/40 font-semibold">Slug identifier (URL)</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="reve-mystique"
                        disabled={!!editingProduct}
                        className="w-full border border-cream px-3 py-2 focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none disabled:bg-gray-100/50 disabled:text-gray-400 font-mono text-xs text-foreground"
                        title={editingProduct ? "URL identifiers cannot be modified to protect link integrity." : ""}
                      />
                    </div>
                  </div>

                  {/* Family, Price, Volume */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-foreground/40 font-semibold">Family</label>
                      <select
                        value={formData.family}
                        onChange={(e) => setFormData({ ...formData, family: e.target.value as any })}
                        className="w-full border border-cream px-3 py-2 focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none"
                      >
                        <option value="Floral">Floral</option>
                        <option value="Woody">Woody</option>
                        <option value="Citrus">Citrus</option>
                      </select>
                    </div>

                    <div className="space-y-1 col-span-2">
                      <label className="text-[10px] uppercase tracking-wider text-foreground/40 font-semibold">Boutique Price (Rupiah)</label>
                      <input
                        type="number"
                        required
                        min="10000"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        placeholder="3500000"
                        className="w-full border border-cream px-3 py-2 focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none font-mono text-foreground"
                      />
                    </div>
                  </div>

                  {/* Concentration and Volume */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-foreground/40 font-semibold">Concentration</label>
                      <select
                        required
                        value={formData.concentration}
                        onChange={(e) => setFormData({ ...formData, concentration: e.target.value })}
                        className="w-full border border-cream px-3 py-2 focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none text-foreground"
                      >
                        <option value="" disabled>Select Concentration</option>
                        {lookupConcentrations.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-foreground/40 font-semibold">Volume Display</label>
                      <select
                        required
                        value={formData.volume}
                        onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                        className="w-full border border-cream px-3 py-2 focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none text-foreground"
                      >
                        <option value="" disabled>Select Volume</option>
                        {lookupVolumes.map(v => (
                          <option key={v.id} value={v.name}>{v.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Subtitle / Short Ingredients list */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-foreground/40 font-semibold">Olfactive Accords (Subtitle)</label>
                    <input
                      type="text"
                      required
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="Damascus Rose, Incense & Golden Amber"
                      className="w-full border border-cream px-3 py-2 focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none text-foreground"
                    />
                  </div>

                  {/* Short Description */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-foreground/40 font-semibold">Short description (Grid Teaser)</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="A lush, enigmatic interpretation of late afternoon sun on bare skin..."
                      className="w-full border border-cream px-3 py-2 focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none text-foreground"
                    />
                  </div>

                  {/* Story */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-foreground/40 font-semibold">Olfactive Story (Full detail page description)</label>
                    <textarea
                      rows={3}
                      value={formData.story}
                      onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                      placeholder="Inspired by walks along the sun-baked stone streets of Seville..."
                      className="w-full border border-cream px-3 py-2 focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none text-foreground"
                    />
                  </div>

                  {/* Image Uploads */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider text-foreground/40 font-semibold">Primary Image (Base64 Upload)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            try {
                              const base64 = await compressImage(e.target.files[0]);
                              setFormData({ ...formData, primaryImage: base64 });
                              showNotification("Primary image uploaded successfully.");
                            } catch (err) {
                              console.error("Failed to process image", err);
                            }
                          }
                        }}
                        className="w-full border border-cream px-3 py-2 focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none font-mono text-[10px] text-foreground"
                      />
                      {formData.primaryImage && (
                        <div className="relative w-16 h-16 border border-cream overflow-hidden">
                           <img src={formData.primaryImage} alt="Primary Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider text-foreground/40 font-semibold">Secondary Image (Base64 Upload)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            try {
                              const base64 = await compressImage(e.target.files[0]);
                              setFormData({ ...formData, secondaryImage: base64 });
                              showNotification("Secondary image uploaded successfully.");
                            } catch (err) {
                              console.error("Failed to process image", err);
                            }
                          }
                        }}
                        className="w-full border border-cream px-3 py-2 focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none font-mono text-[10px] text-foreground"
                      />
                      {formData.secondaryImage && (
                        <div className="relative w-16 h-16 border border-cream overflow-hidden">
                           <img src={formData.secondaryImage} alt="Secondary Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Additional Images Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider text-foreground/40 font-semibold">Tertiary Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            try {
                              const base64 = await compressImage(e.target.files[0]);
                              setFormData({ ...formData, tertiaryImage: base64 });
                              showNotification("Tertiary image uploaded successfully.");
                            } catch (err) {
                              console.error("Failed to process image", err);
                            }
                          }
                        }}
                        className="w-full border border-cream px-3 py-2 focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none font-mono text-[10px] text-foreground"
                      />
                      {formData.tertiaryImage && (
                        <div className="relative w-16 h-16 border border-cream overflow-hidden">
                           <img src={formData.tertiaryImage} alt="Tertiary Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider text-foreground/40 font-semibold">Scent Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            try {
                              const base64 = await compressImage(e.target.files[0]);
                              setFormData({ ...formData, scentImage: base64 });
                              showNotification("Scent image uploaded successfully.");
                            } catch (err) {
                              console.error("Failed to process image", err);
                            }
                          }
                        }}
                        className="w-full border border-cream px-3 py-2 focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none font-mono text-[10px] text-foreground"
                      />
                      {formData.scentImage && (
                        <div className="relative w-16 h-16 border border-cream overflow-hidden">
                           <img src={formData.scentImage} alt="Scent Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ambience Image Row */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-foreground/40 font-semibold">Ambience/Lifestyle Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          try {
                            const base64 = await compressImage(e.target.files[0]);
                            setFormData({ ...formData, ambienceImage: base64 });
                            showNotification("Ambience image uploaded successfully.");
                          } catch (err) {
                            console.error("Failed to process image", err);
                          }
                        }
                      }}
                      className="w-full border border-cream px-3 py-2 focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none font-mono text-[10px] text-foreground"
                    />
                    {formData.ambienceImage && (
                      <div className="relative w-16 h-16 border border-cream overflow-hidden">
                         <img src={formData.ambienceImage} alt="Ambience Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Scent formulation Notes inputs */}
                  <div className="p-4 bg-muted border border-cream space-y-3">
                    <h5 className="font-serif italic font-medium text-xs text-foreground">Scent formulation Notes Hierarchy</h5>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-foreground/40 font-semibold">Top Notes (comma-separated)</label>
                        <input
                          type="text"
                          required
                          value={formData.topNotes}
                          onChange={(e) => setFormData({ ...formData, topNotes: e.target.value })}
                          placeholder="Bergamot, Saffron, Pink Pepper"
                          className="w-full bg-background border border-cream px-3 py-2 focus:border-foreground focus:outline-none text-foreground"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-foreground/40 font-semibold">Heart Notes (comma-separated)</label>
                        <input
                          type="text"
                          required
                          value={formData.heartNotes}
                          onChange={(e) => setFormData({ ...formData, heartNotes: e.target.value })}
                          placeholder="Damascus Rose, Frankincense, Jasmine"
                          className="w-full bg-background border border-cream px-3 py-2 focus:border-foreground focus:outline-none text-foreground"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase tracking-widest text-foreground/40 font-semibold">Base Notes (comma-separated)</label>
                        <input
                          type="text"
                          required
                          value={formData.baseNotes}
                          onChange={(e) => setFormData({ ...formData, baseNotes: e.target.value })}
                          placeholder="Myosore Sandalwood, Golden Amber, White Musks"
                          className="w-full bg-background border border-cream px-3 py-2 focus:border-foreground focus:outline-none text-foreground"
                        />
                      </div>
                      <div className="space-y-3 pt-2 border-t border-cream">
                        <label className="text-[10px] uppercase tracking-wider text-foreground/80 font-semibold font-sans block">Visibility Settings</label>
                        <div className="flex flex-col gap-3">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.showInShop}
                              onChange={(e) => setFormData({ ...formData, showInShop: e.target.checked })}
                              className="w-4 h-4 accent-foreground"
                            />
                            <span className="text-[11px] uppercase tracking-wide text-foreground/70">Display in Shop Page</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.showInCollection}
                              onChange={(e) => setFormData({ ...formData, showInCollection: e.target.checked })}
                              className="w-4 h-4 accent-foreground"
                            />
                            <span className="text-[11px] uppercase tracking-wide text-foreground/70">Display in Collections Section</span>
                          </label>
                        </div>
                      </div>
                    </div>
                </div>

                {/* Submission Row */}
                <div className="pt-4 border-t border-cream flex gap-3 bg-background">
                  <button
                    type="button"
                    onClick={() => handleCloseForm()}
                    className="flex-1 border border-foreground/10 py-3.5 text-[10px] tracking-widest font-semibold uppercase font-sans hover:bg-foreground/5 transition-all text-foreground cursor-pointer"
                  >
                    Archive
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-foreground text-cream py-3.5 text-[10px] tracking-widest font-semibold uppercase font-sans hover:bg-foreground/90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? "Processing..." : editingProduct ? "Refine formulation" : "Release formulation"}
                  </button>
                </div>

                </form>
              </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-out Panel Form for Promos */}
      <AnimatePresence>
        {isPromoFormOpen && (
          <motion.div
            key="promo-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPromoFormOpen(false)}
            className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm cursor-pointer"
          />
        )}

        {isPromoFormOpen && (
          <motion.div
            key="promo-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-lg bg-background p-8 border-l border-cream shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6 pb-6">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-cream pb-4">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-foreground/40 font-sans font-semibold">Promotion Curators</span>
                    <h2 className="font-serif text-2xl text-foreground font-light">
                      {editingPromo ? `Refine Promo` : "Launch New Promo"}
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsPromoFormOpen(false)}
                    className="p-1 rounded-full text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Form fields */}
                <form onSubmit={handlePromoFormSubmit} className="space-y-5 text-xs text-foreground/70" id="promo-form">
                  
                  {/* Coupon Code and target product */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-foreground/40 font-semibold">
                        Coupon Code (Optional)
                      </label>
                      <input
                        type="text"
                        value={promoFormData.code}
                        onChange={(e) => setPromoFormData({ ...promoFormData, code: e.target.value })}
                        placeholder="e.g. RINTIKDUO"
                        className="w-full border border-cream px-3 py-2 focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none font-mono uppercase text-foreground text-sm"
                      />
                      <p className="text-[9px] text-foreground/40 leading-normal font-sans">
                        Leave blank to apply the discount automatically when the quantity rule is met.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-foreground/40 font-semibold font-sans">Target Product</label>
                      <select
                        value={promoFormData.productSlug}
                        onChange={(e) => setPromoFormData({ ...promoFormData, productSlug: e.target.value })}
                        className="w-full border border-cream px-3 py-2 focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none text-foreground text-xs"
                      >
                        <option value="all">Any Product (All Bag Items)</option>
                        {productList.map(p => (
                          <option key={p.slug} value={p.slug}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Min Quantity and discount type */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-foreground/40 font-semibold font-sans">Min Quantity</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={promoFormData.minQuantity}
                        onChange={(e) => setPromoFormData({ ...promoFormData, minQuantity: Number(e.target.value) })}
                        className="w-full border border-cream px-3 py-2 focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none text-foreground font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-foreground/40 font-semibold font-sans">Discount Type</label>
                      <select
                        value={promoFormData.discountType}
                        onChange={(e) => setPromoFormData({ ...promoFormData, discountType: e.target.value as any })}
                        className="w-full border border-cream px-3 py-2 focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none text-foreground text-xs"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Price (IDR)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-foreground/40 font-semibold font-sans">
                        Discount Value
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={promoFormData.discountValue}
                        onChange={(e) => setPromoFormData({ ...promoFormData, discountValue: Number(e.target.value) })}
                        className="w-full border border-cream px-3 py-2 focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none text-foreground font-mono text-xs"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-foreground/40 font-semibold font-sans">Promo Description</label>
                    <textarea
                      rows={3}
                      value={promoFormData.description}
                      onChange={(e) => setPromoFormData({ ...promoFormData, description: e.target.value })}
                      placeholder="e.g. Buy 2 or more bottles of Rintik Extrait and enjoy an exclusive 15% discount."
                      className="w-full border border-cream px-3 py-2 focus:border-foreground focus:outline-none transition-colors bg-transparent rounded-none text-foreground text-xs"
                    />
                  </div>

                  {/* Submit Row */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsPromoFormOpen(false)}
                      className="flex-1 border border-foreground/10 py-3.5 text-[10px] tracking-widest font-semibold uppercase font-sans hover:bg-foreground/5 transition-all text-foreground"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-foreground text-cream py-3.5 text-[10px] tracking-widest font-semibold uppercase font-sans hover:bg-foreground/90 transition-all shadow-sm"
                    >
                      {editingPromo ? "Update Promo" : "Launch Promo"}
                    </button>
                  </div>

                </form>

              </div>
            </motion.div>
        )}
      </AnimatePresence>
      </>, document.body) : null}

    </div>
  );
};
