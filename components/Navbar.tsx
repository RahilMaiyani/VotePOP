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
    <header className="sticky top-0 z-40 w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/95 backdrop-blur-md border-b-[2.5px] border-black">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={vibrateTap}
          className="flex items-center gap-2 group cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FFE600] border-[2.5px] border-black flex items-center justify-center shadow-[2px_2px_0px_#000] group-hover:rotate-6 transition-transform">
            <VoteIcon size={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg sm:text-xl tracking-tight text-black leading-none">
              VOTEPOP
            </span>
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-gray-500 hidden sm:block">
              Squad Decision Engine
            </span>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/"
            onClick={vibrateTap}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#CEFF00] text-black font-black text-xs uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          >
            <PlusIcon size={14} />
            <span>New Poll</span>
          </Link>

          {user ? (
            <button
              onClick={() => {
                vibrateTap();
                openAuthModal();
              }}
              className="flex items-center gap-2 p-1 pl-2 sm:pl-2.5 bg-white border-2 border-black rounded-full shadow-[2px_2px_0px_#000] hover:bg-gray-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer max-w-[160px] sm:max-w-[200px]"
              title="Click to manage profile and avatar"
            >
              <div className="text-left min-w-0 pr-0.5">
                <p className="font-black text-xs text-black leading-none truncate max-w-[70px] sm:max-w-[100px]">
                  {user.name}
                </p>
                <p className="text-[9px] font-bold text-gray-500 leading-none truncate max-w-[70px] sm:max-w-[100px]">
                  @{user.username}
                </p>
              </div>
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
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00E5FF] text-black font-black text-xs uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-[#FFE600] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            >
              <UserIcon size={14} />
              <span>Register / Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};