'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AvatarType } from '../lib/types';
import { vibrateTap, vibrateSuccess } from '../lib/haptics';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, name: string, password: string) => Promise<{ success: boolean; error?: string }>;
  updateAvatar: (avatarType: AvatarType, avatarBgColor: string) => Promise<void>;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('votepop_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to parse local user session:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    vibrateTap();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to sign in' };
      }
      setUser(data.user);
      localStorage.setItem('votepop_user', JSON.stringify(data.user));
      vibrateSuccess();
      return { success: true };
    } catch {
      return { success: false, error: 'Network connection error' };
    }
  };

  const register = async (username: string, name: string, password: string) => {
    vibrateTap();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, name, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to create account' };
      }
      setUser(data.user);
      localStorage.setItem('votepop_user', JSON.stringify(data.user));
      vibrateSuccess();
      return { success: true };
    } catch {
      return { success: false, error: 'Network connection error' };
    }
  };

  const updateAvatar = async (avatarType: AvatarType, avatarBgColor: string) => {
    if (!user) return;
    vibrateTap();
    const updated: UserProfile = { ...user, avatarType, avatarBgColor };
    setUser(updated);
    localStorage.setItem('votepop_user', JSON.stringify(updated));

    // Sync with server in background
    try {
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          name: user.name,
          avatarType,
          avatarBgColor,
          isUpdateOnly: true,
        }),
      });
    } catch {
      // Local session already updated
    }
  };

  const logout = () => {
    vibrateTap();
    setUser(null);
    localStorage.removeItem('votepop_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        updateAvatar,
        logout,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
