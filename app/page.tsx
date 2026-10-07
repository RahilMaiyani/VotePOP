'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthContext';
import { Avatar } from '../components/Avatar';
import { Poll } from '../lib/types';
import {
  PlusIcon,
  TrashIcon,
  SparklesIcon,
  ArrowRightIcon,
  LockIcon,
  TrophyIcon,
  CloseIcon,
  VoteIcon,
} from '../components/Icons';
import { vibrateTap, vibrateSelect, vibrateSuccess } from '../lib/haptics';

export default function HomePage() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Poll creation form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [allowCustomOptions, setAllowCustomOptions] = useState(true);
  const [allowMultipleVotes, setAllowMultipleVotes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchPolls = async () => {
    try {
      const res = await fetch('/api/polls');
      const data = await res.json();
      if (res.ok && data.polls) {
        setPolls(data.polls);
      }
    } catch (e) {
      console.warn('Failed to fetch polls:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleAddOptionField = () => {
    vibrateSelect();
    if (options.length < 8) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOptionField = (index: number) => {
    vibrateSelect();
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Please enter a poll statement/question');
      return;
    }

    const validOptions = options.map((o) => o.trim()).filter((o) => o.length > 0);
    if (validOptions.length < 2) {
      setFormError('Please provide at least 2 valid options');
      return;
    }

    setSubmitting(true);
    vibrateTap();

    try {
      const res = await fetch('/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          category: category.trim() || 'General',
          notes: notes.trim() || undefined,
          options: validOptions,
          allowCustomOptions,
          allowMultipleVotes,
          createdBy: user
            ? {
              username: user.username,
              name: user.name,
              avatarType: user.avatarType,
              avatarBgColor: user.avatarBgColor,
            }
            : {
              username: 'guest',
              name: 'Squad Member',
              avatarType: 'initials',
              avatarBgColor: '#CEFF00',
            },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Failed to create poll');
        setSubmitting(false);
        return;
      }

      vibrateSuccess();
      router.push(`/poll/${data.poll.id}`);
    } catch {
      setFormError('Failed to connect to server');
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <section className="bg-white border-[3px] border-black shadow-[6px_6px_0px_#000] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-[#CEFF00] border-2 border-black rounded-full font-black text-[11px] uppercase tracking-wider shadow-[1.5px_1.5px_0px_#000]">
            Squad Decision Engine
          </span>
          <span className="px-3 py-1 bg-[#00E5FF] border-2 border-black rounded-full font-black text-[11px] uppercase tracking-wider shadow-[1.5px_1.5px_0px_#000]">
            Instant QR Sharing
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-black uppercase leading-[1.05] mb-3">
          No More 50-Message Group Chat Debates.
        </h1>
        <p className="text-sm sm:text-base font-bold text-gray-700 max-w-xl mb-6">
          Set up a poll for cricket turf slots, pickleball courts, or weekend hangouts. Friends scan the QR, enter their name, and the winning decision is crowned in real-time.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              vibrateTap();
              setShowCreateModal(true);
            }}
            className="px-6 py-3.5 bg-[#FFE600] text-black font-black text-sm uppercase rounded-2xl border-[2.5px] border-black shadow-[4px_4px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none flex items-center gap-2 transition-all cursor-pointer"
          >
            <PlusIcon size={18} strokeWidth={3} />
            <span>Create A Poll</span>
          </button>

          {!user && (
            <button
              onClick={() => {
                vibrateTap();
                openAuthModal();
              }}
              className="px-5 py-3.5 bg-white text-black font-black text-sm uppercase rounded-2xl border-[2.5px] border-black shadow-[3px_3px_0px_#000] hover:bg-gray-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
            >
              Set Squad Profile
            </button>
          )}
        </div>
      </section>

      {/* Active Polls Header */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#FF6EA7] border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_#000]">
              <SparklesIcon size={14} />
            </div>
            <h2 className="font-black text-xl uppercase tracking-tight text-black">
              Active Squad Polls
            </h2>
          </div>
          <button
            onClick={() => {
              vibrateTap();
              fetchPolls();
            }}
            className="text-xs font-black uppercase underline decoration-2 cursor-pointer"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center bg-white border-[2.5px] border-black rounded-2xl shadow-[4px_4px_0px_#000]">
            <p className="font-black text-sm uppercase text-gray-500 animate-pulse">
              Loading squad polls...
            </p>
          </div>
        ) : polls.length === 0 ? (
          <div className="py-12 px-6 text-center bg-white border-[2.5px] border-black rounded-2xl shadow-[4px_4px_0px_#000] space-y-3">
            <div className="w-12 h-12 bg-[#CEFF00] border-2 border-black rounded-2xl flex items-center justify-center mx-auto shadow-[2px_2px_0px_#000]">
              <VoteIcon size={24} />
            </div>
            <p className="font-black text-lg text-black uppercase">No Polls Created Yet</p>
            <p className="text-xs font-bold text-gray-600 max-w-sm mx-auto">
              Be the first to create a poll for your cricket match, pickleball rally, or group plans!
            </p>
            <button
              onClick={() => {
                vibrateTap();
                setShowCreateModal(true);
              }}
              className="mt-2 px-5 py-2.5 bg-[#FFE600] text-black font-black text-xs uppercase rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer"
            >
              Start First Poll
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {polls.map((poll) => {
              const totalVotes = poll.options.reduce((sum, opt) => sum + opt.voters.length, 0);
              const leadingOpt = [...poll.options].sort((a, b) => b.voters.length - a.voters.length)[0];

              return (
                <Link
                  key={poll.id}
                  href={`/poll/${poll.id}`}
                  onClick={vibrateTap}
                  className="group bg-white border-[2.5px] border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Chips */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 bg-[#CEFF00] border-1.5 border-black rounded-md font-black text-[10px] uppercase tracking-wider shadow-[1px_1px_0px_#000]">
                        {poll.category}
                      </span>
                      {poll.isClosed ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-[#FF5533] text-white border-1.5 border-black rounded-md font-black text-[10px] uppercase shadow-[1px_1px_0px_#000]">
                          <LockIcon size={10} />
                          <span>Decided</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-[#00E5FF] border-1.5 border-black rounded-md font-black text-[10px] uppercase shadow-[1px_1px_0px_#000]">
                          Open
                        </span>
                      )}
                    </div>

                    {/* Question / Statement */}
                    <h3 className="font-black text-base text-black uppercase leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {poll.title}
                    </h3>

                    {/* Optional Notes Preview */}
                    {poll.notes && (
                      <p className="text-xs font-semibold text-gray-600 line-clamp-1 mb-3 bg-gray-50 p-1.5 border border-black/30 rounded-lg">
                        {poll.notes}
                      </p>
                    )}

                    {/* Leading Option Highlight */}
                    {leadingOpt && leadingOpt.voters.length > 0 && (
                      <div className="p-2 bg-[#FFE600]/30 border-1.5 border-black rounded-xl mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <TrophyIcon size={14} className="shrink-0 text-black" />
                          <span className="text-xs font-extrabold text-black truncate">
                            {leadingOpt.text}
                          </span>
                        </div>
                        <span className="text-[11px] font-black shrink-0 ml-2">
                          {leadingOpt.voters.length} votes
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Footer: Creator & Total Votes */}
                  <div className="pt-3 border-t-2 border-black flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <Avatar
                        name={poll.createdBy.name}
                        avatarType={poll.createdBy.avatarType}
                        avatarBgColor={poll.createdBy.avatarBgColor}
                        size="xs"
                      />
                      <span className="text-xs font-bold text-gray-700 truncate max-w-[100px]">
                        {poll.createdBy.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-black">
                        {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#FFE600] border-1.5 border-black flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                        <ArrowRightIcon size={12} strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* CREATE POLL MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white border-[3px] border-black shadow-[7px_7px_0px_#000] p-6 rounded-3xl max-h-[90vh] overflow-y-auto my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-black mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FFE600] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
                  <PlusIcon size={20} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="font-black text-xl uppercase tracking-tight text-black">
                    Create New Poll
                  </h3>
                  <p className="text-[11px] font-bold text-gray-600">
                    Get quick consensus from your friends
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  vibrateTap();
                  setShowCreateModal(false);
                }}
                className="w-8 h-8 rounded-lg border-2 border-black bg-[#FF6EA7] flex items-center justify-center font-bold shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
              >
                <CloseIcon size={16} />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-[#FF5533]/20 border-2 border-[#FF5533] rounded-xl text-black font-bold text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreatePoll} className="space-y-4">
              {/* Question / Statement */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                  Poll Statement / Question *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Saturday Turf Cricket: Which time slot?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black bg-white font-bold text-sm text-black placeholder:text-gray-400 focus:outline-hidden focus:bg-[#FFE600]/10 shadow-[2px_2px_0px_#000]"
                  required
                />
              </div>

              {/* Custom Category Input */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
                  Custom Category (Any Name)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cricket, Pickleball, Dinner, Movie..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black bg-white font-bold text-sm text-black placeholder:text-gray-400 focus:outline-hidden focus:bg-[#00E5FF]/10 shadow-[2px_2px_0px_#000]"
                />
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-black mb-1 flex items-center justify-between">
                  <span>Optional Notes & Rules</span>
                  <span className="text-[10px] text-gray-500 font-bold lowercase">fees, venue, gear</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. ₹200 fee per player. Bring 2 rackets. Meeting directly at the turf!"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-black bg-white font-semibold text-xs text-black placeholder:text-gray-400 focus:outline-hidden focus:bg-[#CEFF00]/10 shadow-[2px_2px_0px_#000]"
                />
              </div>

              {/* Options Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black uppercase tracking-wider text-black">
                    Voting Options *
                  </label>
                  <span className="text-[11px] font-bold text-gray-500">
                    {options.length}/8 options
                  </span>
                </div>

                <div className="space-y-2">
                  {options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-[#FFE600] border-1.5 border-black flex items-center justify-center font-black text-xs shrink-0 shadow-[1px_1px_0px_#000]">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        placeholder={`Option ${idx + 1}`}
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border-2 border-black bg-white font-bold text-xs text-black placeholder:text-gray-400 focus:outline-hidden shadow-[1.5px_1.5px_0px_#000]"
                        required
                      />
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOptionField(idx)}
                          className="w-8 h-8 rounded-lg border-2 border-black bg-[#FF5533]/20 hover:bg-[#FF5533] hover:text-white flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                        >
                          <TrashIcon size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {options.length < 8 && (
                  <button
                    type="button"
                    onClick={handleAddOptionField}
                    className="mt-2.5 px-3 py-1.5 bg-[#CEFF00] border-2 border-black rounded-xl font-black text-xs uppercase shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusIcon size={14} strokeWidth={3} />
                    <span>Add Another Option</span>
                  </button>
                )}
              </div>

              {/* Toggles & Permissions */}
              <div className="pt-2 border-t-2 border-black space-y-2.5">
                <label className="flex items-center justify-between p-2.5 bg-gray-50 border-2 border-black rounded-xl cursor-pointer">
                  <div>
                    <p className="font-black text-xs text-black uppercase">
                      Allow Friends to Add Custom Options
                    </p>
                    <p className="text-[10px] font-bold text-gray-600">
                      Voters can type their own idea and vote for it
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowCustomOptions}
                    onChange={(e) => setAllowCustomOptions(e.target.checked)}
                    className="w-5 h-5 accent-black rounded border-2 border-black cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 bg-gray-50 border-2 border-black rounded-xl cursor-pointer">
                  <div>
                    <p className="font-black text-xs text-black uppercase">
                      Allow Multiple Votes Per Person
                    </p>
                    <p className="text-[10px] font-bold text-gray-600">
                      Can select more than 1 option (default is single choice)
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowMultipleVotes}
                    onChange={(e) => setAllowMultipleVotes(e.target.checked)}
                    className="w-5 h-5 accent-black rounded border-2 border-black cursor-pointer"
                  />
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-4 py-3.5 bg-[#CEFF00] text-black font-black text-sm uppercase rounded-2xl border-[2.5px] border-black shadow-[4px_4px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Generating Poll & QR...' : 'Launch Poll & Generate QR 🚀'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
