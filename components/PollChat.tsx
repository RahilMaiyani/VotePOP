'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Poll } from '../lib/types';
import { Avatar } from './Avatar';
import { ChatIcon, SendIcon } from './Icons';
import { vibrateTap, vibrateSuccess, vibrateSelect } from '../lib/haptics';

interface PollChatProps {
  pollId: string;
  messages: ChatMessage[];
  activeUser: {
    username: string;
    name: string;
    avatarType: any;
    avatarBgColor: string;
  } | null;
  onPollUpdated: (updatedPoll: Poll) => void;
  onRequestIdentity: () => void;
}

const QUICK_CHATS = [
  'Count me in!',
  'What time are we reaching?',
  'Bringing extra gear',
  'Can someone pick me up?',
  'Fee paid!',
];

export const PollChat: React.FC<PollChatProps> = ({
  pollId,
  messages = [],
  activeUser,
  onPollUpdated,
  onRequestIdentity,
}) => {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [chatError, setChatError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]);

  const handleSendMessage = async (customText?: string) => {
    setChatError('');
    const messageToSend = customText || text;

    if (!messageToSend.trim()) return;

    if (!activeUser) {
      vibrateSelect();
      setChatError('Please enter your name or sign in above before chatting!');
      onRequestIdentity();
      return;
    }

    vibrateTap();
    setSending(true);

    try {
      const res = await fetch(`/api/polls/${pollId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: messageToSend.trim(),
          sender: activeUser,
        }),
      });

      const data = await res.json();
      if (res.ok && data.poll) {
        if (!customText) setText('');
        vibrateSuccess();
        onPollUpdated(data.poll);
      } else {
        setChatError(data.error || 'Failed to send message');
      }
    } catch {
      setChatError('Network error while sending message');
    } finally {
      setSending(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const formatTime = (ts: number) => {
    if (!ts) return '';
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <section className="bg-white border-[2.5px] border-black rounded-3xl p-4 sm:p-5 shadow-[4px_4px_0px_#000] space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FFE600] border-1.5 border-black flex items-center justify-center shadow-[1px_1px_0px_#000]">
            <ChatIcon size={16} />
          </div>
          <div>
            <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-black leading-none">
              Squad Chat & Banter
            </h3>
            <p className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">
              Coordinate gear, rides, or arrival time
            </p>
          </div>
        </div>

        <span className="px-2 py-0.5 bg-[#CEFF00] border-1.5 border-black rounded-full font-black text-[10px] shadow-[1px_1px_0px_#000]">
          {messages.length} {messages.length === 1 ? 'msg' : 'msgs'}
        </span>
      </div>

      {chatError && (
        <div className="p-2 bg-[#FF5533]/20 border border-[#FF5533] rounded-xl text-black font-extrabold text-xs">
          {chatError}
        </div>
      )}

      {/* Message Stream */}
      <div className="space-y-2.5 max-h-64 sm:max-h-72 overflow-y-auto pr-1 py-1">
        {messages.length === 0 ? (
          <div className="py-7 text-center bg-gray-50 border border-dashed border-black/30 rounded-2xl">
            <p className="font-black text-xs uppercase text-gray-700">No squad messages yet!</p>
            <p className="text-[10px] font-bold text-gray-500 mt-0.5">
              Drop a note about arrival time, extra rackets, or turf fees below.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = activeUser && activeUser.username.toLowerCase() === msg.sender.username.toLowerCase();

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <Avatar
                  name={msg.sender.name}
                  avatarType={msg.sender.avatarType}
                  avatarBgColor={msg.sender.avatarBgColor}
                  size="xs"
                />

                <div
                  className={`max-w-[80%] sm:max-w-[72%] p-2.5 rounded-2xl border-2 border-black text-xs shadow-[2px_2px_0px_#000] ${
                    isMe
                      ? 'bg-[#CEFF00]/40 rounded-tr-xs text-right'
                      : 'bg-white rounded-tl-xs text-left'
                  }`}
                >
                  <div className={`flex items-center gap-1.5 mb-0.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className="font-black text-[11px] text-black">{msg.sender.name}</span>
                    <span className="text-[9px] font-bold text-gray-500">{formatTime(msg.createdAt)}</span>
                  </div>
                  <p className="font-bold text-gray-900 break-words leading-snug whitespace-pre-wrap">
                    {msg.text}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick chat suggestions */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
        {QUICK_CHATS.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              vibrateSelect();
              setText(q);
            }}
            className="shrink-0 px-2.5 py-1 bg-gray-100 hover:bg-[#FFE600] text-black font-extrabold text-[10px] uppercase rounded-lg border border-black/40 shadow-[1px_1px_0px_#000] transition-colors cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleFormSubmit} className="flex gap-2 pt-1 border-t border-black/20">
        <input
          type="text"
          placeholder={
            activeUser
              ? `Chat as ${activeUser.name}...`
              : 'Enter name above or sign in to chat...'
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border-2 border-black bg-white font-bold text-xs text-black placeholder:text-gray-400 focus:outline-hidden focus:bg-[#FFE600]/10 shadow-[1.5px_1.5px_0px_#000]"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="shrink-0 px-3.5 py-2 bg-[#FFE600] text-black font-black text-xs uppercase border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center gap-1 cursor-pointer disabled:opacity-50 transition-all"
        >
          <SendIcon size={14} />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </section>
  );
};
