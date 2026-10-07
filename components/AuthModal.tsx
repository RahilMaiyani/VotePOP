'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Avatar, AVATAR_OPTIONS, POP_COLORS } from './Avatar';
import { AvatarType } from '../lib/types';
import { CloseIcon, ShieldCheckIcon, UserIcon, CheckIcon } from './Icons';
import { vibrateTap, vibrateSelect, vibrateSuccess } from '../lib/haptics';

export const AuthModal: React.FC = () => {
  const { user, isAuthModalOpen, closeAuthModal, login, register, updateAvatar, logout } = useAuth();
  
  // Tabs: 'register' | 'login' for guests; 'profile' for logged in users
  const [tab, setTab] = useState<'register' | 'login'>('register');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  // Avatar customization state
  const [selectedAvatarType, setSelectedAvatarType] = useState<AvatarType>(user?.avatarType || 'initials');
  const [selectedBgColor, setSelectedBgColor] = useState<string>(user?.avatarBgColor || '#CEFF00');

  // Sync avatar selections when user changes
  useEffect(() => {
    if (user) {
      setSelectedAvatarType(user.avatarType);
      setSelectedBgColor(user.avatarBgColor);
    }
  }, [user]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (tab === 'register') {
      if (!username.trim() || !name.trim() || !password.trim()) {
        setError('Please fill in all fields (username, name, and password)');
        setSubmitting(false);
        return;
      }
      const res = await register(username.trim(), name.trim(), password);
      if (!res.success) {
        setError(res.error || 'Failed to register');
        setSubmitting(false);
        return;
      }
      // Registered successfully, user is now logged in and can customize avatar
    } else if (tab === 'login') {
      if (!username.trim() || !password.trim()) {
        setError('Please enter both username and password');
        setSubmitting(false);
        return;
      }
      const res = await login(username.trim(), password);
      if (!res.success) {
        setError(res.error || 'Invalid username or password');
        setSubmitting(false);
        return;
      }
      closeAuthModal();
    }

    setSubmitting(false);
  };

  const handleSaveAvatar = async () => {
    vibrateTap();
    await updateAvatar(selectedAvatarType, selectedBgColor);
    vibrateSuccess();
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      closeAuthModal();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-white border-[3px] border-black shadow-[6px_6px_0px_#000] p-5 sm:p-6 rounded-3xl overflow-hidden my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3.5 border-b-2 border-black mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFE600] border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#000]">
              <ShieldCheckIcon size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-black text-lg sm:text-xl tracking-tight text-black uppercase leading-none">
                {user ? 'Squad Profile' : tab === 'register' ? 'Register Account' : 'Sign In'}
              </h2>
              <p className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">
                {user ? 'Verified Squad Member' : 'Save your votes & avatar'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              vibrateTap();
              closeAuthModal();
            }}
            className="w-8 h-8 rounded-lg border-2 border-black bg-[#FF6EA7] flex items-center justify-center font-bold shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[#FF5533]/20 border-2 border-[#FF5533] rounded-xl text-black font-extrabold text-xs">
            {error}
          </div>
        )}

        {/* ----------------- VIEW 1: USER IS ALREADY LOGGED IN ----------------- */}
        {user ? (
          <div className="space-y-4">
            {/* Identity Card */}
            <div className="p-3.5 bg-[#CEFF00]/30 border-2 border-black rounded-2xl flex items-center justify-between shadow-[2px_2px_0px_#000]">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar
                  name={user.name}
                  avatarType={selectedAvatarType}
                  avatarBgColor={selectedBgColor}
                  size="md"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-black text-sm text-black leading-tight truncate">{user.name}</p>
                    <span className="px-1.5 py-0.2 bg-black text-white text-[9px] font-black rounded-sm uppercase">Active</span>
                  </div>
                  <p className="text-xs font-bold text-gray-700">@{user.username}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  vibrateTap();
                  logout();
                }}
                className="px-3 py-1.5 bg-[#FF5533] text-white font-black text-xs uppercase rounded-xl border-2 border-black shadow-[1.5px_1.5px_0px_#000] hover:bg-black active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer shrink-0"
              >
                Log Out
              </button>
            </div>

            {/* Avatar Selection section */}
            <div className="bg-gray-50 border-2 border-black rounded-2xl p-4 shadow-[2px_2px_0px_#000]">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-black uppercase tracking-wider text-black">
                  Customize Your Avatar Icon
                </label>
                <span className="text-[10px] font-bold text-gray-500 uppercase">SVG Vector</span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {AVATAR_OPTIONS.map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => {
                      vibrateSelect();
                      setSelectedAvatarType(item.type);
                    }}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 border-black transition-all cursor-pointer ${
                      selectedAvatarType === item.type
                        ? 'bg-[#FFE600] shadow-[2.5px_2.5px_0px_#000] -translate-y-0.5'
                        : 'bg-white hover:bg-gray-100 shadow-[1px_1px_0px_#000]'
                    }`}
                  >
                    <Avatar
                      name={user.name}
                      avatarType={item.type}
                      avatarBgColor={selectedBgColor}
                      size="sm"
                    />
                    <span className="text-[10px] font-bold text-black truncate w-full text-center">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Pop Color Picker */}
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
                Select Badge Color
              </label>
              <div className="flex items-center justify-between gap-2">
                {POP_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      vibrateSelect();
                      setSelectedBgColor(color);
                    }}
                    className={`w-9 h-9 rounded-full border-2 border-black transition-all cursor-pointer ${
                      selectedBgColor === color
                        ? 'scale-110 shadow-[3px_3px_0px_#000] ring-2 ring-black'
                        : 'shadow-[1.5px_1.5px_0px_#000]'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSaveAvatar}
              className="w-full py-3 bg-[#CEFF00] text-black font-black text-sm uppercase rounded-2xl border-[2.5px] border-black shadow-[4px_4px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {savedNotice ? (
                <>
                  <CheckIcon size={16} strokeWidth={3} />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Avatar & Continue</span>
              )}
            </button>
          </div>
        ) : (
          /* ----------------- VIEW 2: GUEST (REGISTER OR SIGN IN) ----------------- */
          <div>
            {/* Clear Tabs: Register vs Sign In */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => {
                  vibrateTap();
                  setTab('register');
                  setError('');
                }}
                className={`py-2.5 px-3 font-black text-xs sm:text-sm uppercase rounded-xl border-2 border-black transition-all cursor-pointer ${
                  tab === 'register'
                    ? 'bg-[#CEFF00] shadow-[3px_3px_0px_#000] translate-x-[-1px] translate-y-[-1px]'
                    : 'bg-gray-100 text-gray-600 shadow-[1px_1px_0px_#000]'
                }`}
              >
                Register (New)
              </button>
              <button
                type="button"
                onClick={() => {
                  vibrateTap();
                  setTab('login');
                  setError('');
                }}
                className={`py-2.5 px-3 font-black text-xs sm:text-sm uppercase rounded-xl border-2 border-black transition-all cursor-pointer ${
                  tab === 'login'
                    ? 'bg-[#FFE600] shadow-[3px_3px_0px_#000] translate-x-[-1px] translate-y-[-1px]'
                    : 'bg-gray-100 text-gray-600 shadow-[1px_1px_0px_#000]'
                }`}
              >
                Sign In
              </button>
            </div>

            <p className="text-xs font-bold text-gray-600 mb-4 bg-gray-50 p-2.5 rounded-xl border border-black/30">
              {tab === 'register'
                ? 'Create a quick profile to cast votes with your verified name & chosen avatar.'
                : 'Already registered? Enter your handle and password to sign in.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                  Username (@handle) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. rahil"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black bg-white font-bold text-sm text-black placeholder:text-gray-400 focus:outline-hidden focus:bg-[#FFE600]/10 shadow-[2px_2px_0px_#000]"
                  required
                />
              </div>

              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                    Display Name / Nickname *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahil Maiyani"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black bg-white font-bold text-sm text-black placeholder:text-gray-400 focus:outline-hidden focus:bg-[#00E5FF]/10 shadow-[2px_2px_0px_#000]"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  placeholder="At least 3 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black bg-white font-bold text-sm text-black placeholder:text-gray-400 focus:outline-hidden focus:bg-[#FF6EA7]/10 shadow-[2px_2px_0px_#000]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-3 py-3.5 bg-[#CEFF00] text-black font-black text-sm uppercase rounded-2xl border-[2.5px] border-black shadow-[4px_4px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Please wait...' : tab === 'register' ? 'Register & Choose Avatar 🎯' : 'Sign In 🔑'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};