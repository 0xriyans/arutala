import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth-context';
import { useToast } from '../../context/toast-context';
import { LogOut } from 'lucide-react';

export const AdminProfile: React.FC = () => {
  const { user, token, fetchUser, logout } = useAuth();
  const { addToast } = useToast();

  const [profileForm, setProfileForm] = useState({ name: '' });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || '' });
    }
  }, [user]);

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

  if (!user) return null;

  return (
    <div className="space-y-12 max-w-2xl animate-fade-in">
      <div className="space-y-6">
        <h3 className="text-[10px] uppercase tracking-widest font-sans font-semibold text-foreground/40 border-b border-cream pb-2">Profile Information</h3>
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
        <h3 className="text-[10px] uppercase tracking-widest font-sans font-semibold text-foreground/40 border-b border-cream pb-2">Security</h3>
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
      <div className="pt-8 border-t border-cream">
        <button 
          onClick={() => {
            logout();
            window.location.hash = '#/login';
          }} 
          className="px-6 py-3 border border-foreground/20 text-foreground/70 bg-transparent text-[10px] uppercase tracking-widest font-sans font-medium hover:text-red-500 hover:border-red-500/50 transition-colors cursor-pointer flex items-center justify-center gap-3 w-max"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
