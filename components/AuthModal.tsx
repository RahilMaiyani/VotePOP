'use client';

import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Avatar, AVATAR_OPTIONS, POP_COLORS } from './Avatar';
import { AvatarType } from '../lib/types';
import { CloseIcon, ShieldCheckIcon, UserIcon } from './Icons';
import { vibrateTap, vibrateSelect } from '../lib/haptics';

export const AuthModal: React.FC = () => {
  const { user, isAuthModalOpen, closeAuthModal, login, register, updateAvatar, logout } = useAuth();
  const [mode, setMode] = useState<'register' | 'login' | 'avatar'>(user ? 'avatar' : 'register');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Avatar customization state
  const [selectedAvatarType, setSelectedAvatarType] = useState<AvatarType>(user?.avatarType || 'initials');
  const [selectedBgColor, setSelectedBgColor] = useState<string>(user?.avatarBgColor || '#CEFF00');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (mode === 'register') {
      if (!username.trim() || !name.trim() || !password.trim()) {
        setError('Please fill in all fields');
        setSubmitting(false);
        return;
      }
      const res = await register(username.trim(), name.trim(), password);
      if (!res.success) {
        setError(res.error || 'Failed to register');
        setSubmitting(false);
        return;
      }
      setMode('avatar');
    } else if (mode === 'login') {
      if (!username.trim() || !password.trim()) {
        setError('Please enter username and password');
        setSubmitting(false);
        return;
      }
      const res = await login(username.trim(), password);
      if (!res.success) {
        setError(res.error || 'Invalid credentials');
        setSubmitting(false);
        return;
      }
      closeAuthModal();
    } else if (mode === 'avatar') {
      await updateAvatar(selectedAvatarType, selectedBgColor);
      closeAuthModal();
    }

    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white border-[3px] border-black shadow-[6px_6px_0px_#000] p-6 rounded-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-black mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FFE600] border-2 border-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#000]">
              <ShieldCheckIcon size={18} strokeWidth={2.5} />
            </div>
            <h2 className="font-black text-xl tracking-tight text-black uppercase">
              {user && mode === 'avatar' ? 'Choose Your Avatar' : mode === 'register' ? 'Join Squad' : 'Sign In'}
            </h2>
          </div>
          <button
            onClick={() => {
              vibrateTap();
              closeAuthModal();
            }}
            className="w-8 h-8 rounded-lg border-2 border-black bg-[#FF6EA7] flex items-center justify-center font-bold shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* User profile already logged in view */}
        {user && mode !== 'avatar' && (
          <div className="mb-5 p-3.5 bg-[#CEFF00]/30 border-2 border-black rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar
                name={user.name}
                avatarType={user.avatarType}
                avatarBgColor={user.avatarBgColor}
                size="sm"
              />
              <div>
                <p className="font-black text-sm text-black leading-tight">{user.name}</p>
                <p className="text-xs font-bold text-gray-700">@{user.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMode('avatar')}
                className="text-xs font-black px-2.5 py-1.5 bg-[#00E5FF] border-2 border-black rounded-lg shadow-[1.5px_1.5px_0px_#000] cursor-pointer"
              >
                Change Avatar
              </button>
              <button
                type="button"
                onClick={logout}
                className="text-xs font-black px-2.5 py-1.5 bg-[#FF5533] text-white border-2 border-black rounded-lg shadow-[1.5px_1.5px_0px_#000] cursor-pointer"
              >
                Log Out
              </button>
            </div>
          </div>
        )}

        {/* Tab switchers if not logged in */}
        {!user && (
          <div className="grid grid-cols-2 gap-2 mb-5">
            <button
              type="button"
              onClick={() => {
                vibrateTap();
                setMode('register');
                setError('');
              }}
              className={`py-2 px-3 font-black text-sm rounded-xl border-2 border-black transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-[#CEFF00] shadow-[3px_3px_0px_#000] translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-gray-100 text-gray-600 shadow-[1px_1px_0px_#000]'
              }`}
            >
              Join Squad
            </button>
            <button
              type="button"
              onClick={() => {
                vibrateTap();
                setMode('login');
                setError('');
              }}
              className={`py-2 px-3 font-black text-sm rounded-xl border-2 border-black transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-[#FFE600] shadow-[3px_3px_0px_#000] translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-gray-100 text-gray-600 shadow-[1px_1px_0px_#000]'
              }`}
            >
              Sign In
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-[#FF5533]/20 border-2 border-[#FF5533] rounded-xl text-black font-bold text-xs">
            {error}
          </div>
        )}

        {/* Mode: AVATAR CUSTOMIZER */}
        {mode === 'avatar' ? (
          <div>
            <div className="text-center py-2 mb-4">
              <div className="inline-block relative">
                <Avatar
                  name={user?.name || name || 'Friend'}
                  avatarType={selectedAvatarType}
                  avatarBgColor={selectedBgColor}
                  size="xl"
                  className="mx-auto"
                />
              </div>
              <p className="mt-2 text-xs font-bold text-gray-600">Live Preview</p>
            </div>

            {/* Select Icon / Initials */}
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
              Select Round Icon
            </label>
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
                      ? 'bg-[#CEFF00] shadow-[3px_3px_0px_#000] -translate-y-0.5'
                      : 'bg-white hover:bg-gray-50 shadow-[1.5px_1.5px_0px_#000]'
                  }`}
                >
                  <Avatar
                    name={user?.name || name || 'Friend'}
                    avatarType={item.type}
                    avatarBgColor={selectedBgColor}
                    size="sm"
                  />
                  <span className="text-[11px] font-bold text-black truncate w-full text-center">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Select Pop Color */}
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
              Badge Pop Color
            </label>
            <div className="flex items-center justify-between gap-2 mb-5">
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

            <button
              type="button"
              onClick={async () => {
                await updateAvatar(selectedAvatarType, selectedBgColor);
                closeAuthModal();
              }}
              className="w-full py-3 bg-[#CEFF00] text-black font-black text-sm uppercase rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer"
            >
              Save Avatar & Continue
            </button>
          </div>
        ) : (
          /* Mode: REGISTER OR LOGIN FORM */
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                Username (@handle)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. rahil"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-black bg-white font-bold text-sm text-black placeholder:text-gray-400 focus:outline-hidden focus:bg-[#FFE600]/10 shadow-[2px_2px_0px_#000]"
                  required
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                  Full Name / Nickname
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahil Maiyani"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-black bg-white font-bold text-sm text-black placeholder:text-gray-400 focus:outline-hidden focus:bg-[#00E5FF]/10 shadow-[2px_2px_0px_#000]"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-black bg-white font-bold text-sm text-black placeholder:text-gray-400 focus:outline-hidden focus:bg-[#FF6EA7]/10 shadow-[2px_2px_0px_#000]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 py-3 bg-[#CEFF00] text-black font-black text-sm uppercase rounded-xl border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Please wait...' : mode === 'register' ? 'Join & Pick Avatar' : 'Sign In'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
