'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from './AuthContext';
import { Avatar } from './Avatar';
import { VoteIcon, PlusIcon, UserIcon } from './Icons';
import { vibrateTap } from '../lib/haptics';

export const Navbar: React.FC = () => {
  const { user, openAuthModal } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full px-4 py-3 bg-white/95 backdrop-blur-md border-b-[2.5px] border-black">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={vibrateTap}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FFE600] border-[2.5px] border-black flex items-center justify-center shadow-[2.5px_2.5px_0px_#000] group-hover:rotate-6 transition-transform">
            <VoteIcon size={22} strokeWidth={2.5} />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-black flex items-center gap-1 leading-none">
              VOTEPOP
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
              Squad Decision Engine
            </span>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            onClick={vibrateTap}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#CEFF00] text-black font-black text-xs uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
          >
            <PlusIcon size={16} />
            <span>Create Poll</span>
          </Link>

          {user ? (
            <button
              onClick={() => {
                vibrateTap();
                openAuthModal();
              }}
              className="flex items-center gap-2 p-1 pl-2.5 bg-white border-2 border-black rounded-full shadow-[2px_2px_0px_#000] hover:bg-gray-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              <span className="font-black text-xs text-black max-w-[80px] sm:max-w-[120px] truncate">
                {user.name}
              </span>
              <Avatar
                name={user.name}
                avatarType={user.avatarType}
                avatarBgColor={user.avatarBgColor}
                size="sm"
              />
            </button>
          ) : (
            <button
              onClick={() => {
                vibrateTap();
                openAuthModal();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00E5FF] text-black font-black text-xs uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
            >
              <UserIcon size={15} />
              <span>Squad ID</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
