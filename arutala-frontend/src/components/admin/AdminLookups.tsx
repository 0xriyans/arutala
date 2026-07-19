import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Database, Truck, Box, Layers, Droplet, UserCheck } from 'lucide-react';

interface LookupItem {
  id: number;
  name: string;
}

export const AdminLookups: React.FC = () => {
  const [couriers, setCouriers] = useState<LookupItem[]>([]);
  const [families, setFamilies] = useState<LookupItem[]>([]);
  const [volumes, setVolumes] = useState<LookupItem[]>([]);
  const [concentrations, setConcentrations] = useState<LookupItem[]>([]);
  const [notes, setNotes] = useState<LookupItem[]>([]);
  const [roles, setRoles] = useState<LookupItem[]>([]);

  const [newCourier, setNewCourier] = useState('');
  const [newFamily, setNewFamily] = useState('');
  const [newVolume, setNewVolume] = useState('');
  const [newConcentration, setNewConcentration] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newRole, setNewRole] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('arutala_token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [cRes, fRes, vRes, concRes, nRes, rRes] = await Promise.all([
        fetch('/api/admin/couriers', { headers }),
        fetch('/api/lookups/families'),
        fetch('/api/lookups/volumes'),
        fetch('/api/lookups/concentrations'),
        fetch('/api/admin/lookups/notes', { headers }),
        fetch('/api/admin/lookups/roles', { headers })
      ]);

      if (cRes.ok) setCouriers(await cRes.json());
      if (fRes.ok) setFamilies(await fRes.json());
      if (vRes.ok) setVolumes(await vRes.json());
      if (concRes.ok) setConcentrations(await concRes.json());
      if (nRes.ok) setNotes(await nRes.json());
      if (rRes.ok) setRoles(await rRes.json());
    } catch (e) {
      console.error('Failed to load lookups', e);
    }
  };

  const handleAddCourier = async () => {
    if (!newCourier.trim()) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('arutala_token');
      await fetch('/api/admin/couriers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newCourier })
      });
      setNewCourier('');
      fetchData();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLookup = async (type: string, value: string, setter: (val: string) => void) => {
    if (!value.trim()) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('arutala_token');
      await fetch(`/api/admin/lookups/${type}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: value })
      });
      setter('');
      fetchData();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourier = async (id: number) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('arutala_token');
      await fetch(`/api/admin/couriers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLookup = async (type: string, id: number) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('arutala_token');
      await fetch(`/api/admin/lookups/${type}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } finally {
      setIsLoading(false);
    }
  };

  const renderSection = (
    title: string, 
    items: LookupItem[], 
    icon: React.ReactNode, 
    newValue: string, 
    setNewValue: (val: string) => void, 
    onAdd: () => void,
    onDelete: (id: number) => void
  ) => (
    <div className="bg-background border border-cream p-6 space-y-4">
      <div className="flex items-center space-x-2 text-foreground mb-4">
        {icon}
        <h3 className="font-serif text-lg">{title}</h3>
      </div>
      
      <div className="flex gap-2 mb-4">
        <input 
          type="text" 
          placeholder={`Add new ${title.toLowerCase()}...`}
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="flex-1 bg-transparent border-b border-cream py-2 text-sm font-sans focus:outline-none focus:border-foreground transition-colors text-foreground"
        />
        <button 
          onClick={onAdd}
          disabled={isLoading || !newValue.trim()}
          className="bg-foreground text-background px-4 py-2 text-xs uppercase tracking-widest disabled:opacity-50 hover:bg-foreground/90 transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map(item => (
          <div key={item.id} className="flex justify-between items-center p-3 border border-cream/50 bg-cream/5">
            <span className="text-sm font-sans text-foreground">{item.name}</span>
            <button 
              onClick={() => onDelete(item.id)}
              disabled={isLoading}
              className="text-foreground/40 hover:text-red-500 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-cream pb-6">
        <div>
          <h2 className="font-serif text-2xl font-light text-foreground tracking-tight">Master Data</h2>
          <p className="text-xs text-foreground/60 font-sans mt-2">Manage lookup tables for the boutique.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderSection('Couriers', couriers, <Truck size={18} />, newCourier, setNewCourier, handleAddCourier, handleDeleteCourier)}
        {renderSection('Fragrance Families', families, <Layers size={18} />, newFamily, setNewFamily, () => handleAddLookup('families', newFamily, setNewFamily), (id) => handleDeleteLookup('families', id))}
        {renderSection('Fragrance Notes', notes, <Database size={18} />, newNote, setNewNote, () => handleAddLookup('notes', newNote, setNewNote), (id) => handleDeleteLookup('notes', id))}
        {renderSection('User Roles', roles, <UserCheck size={18} />, newRole, setNewRole, () => handleAddLookup('roles', newRole, setNewRole), (id) => handleDeleteLookup('roles', id))}
        {renderSection('Volumes', volumes, <Box size={18} />, newVolume, setNewVolume, () => handleAddLookup('volumes', newVolume, setNewVolume), (id) => handleDeleteLookup('volumes', id))}
        {renderSection('Concentrations', concentrations, <Droplet size={18} />, newConcentration, setNewConcentration, () => handleAddLookup('concentrations', newConcentration, setNewConcentration), (id) => handleDeleteLookup('concentrations', id))}
      </div>
    </div>
  );
};
