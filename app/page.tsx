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
  UserIcon,
  CricketBatIcon,
  PickleballIcon,
  FireIcon,
  BoltIcon,
  CheckIcon,
  ShareIcon,
  ChatIcon,
} from '../components/Icons';
import { vibrateTap, vibrateSelect, vibrateSuccess } from '../lib/haptics';

type FilterTab = 'all' | 'mine' | 'voted';

interface PresetTemplate {
  name: string;
  icon: React.FC<{ size?: number; className?: string }>;
  category: string;
  title: string;
  options: string[];
  notes: string;
}

const TEMPLATES: PresetTemplate[] = [
  {
    name: 'Turf Cricket',
    icon: CricketBatIcon,
    category: 'Cricket',
    title: 'Saturday Turf Cricket: Which slot works best?',
    options: ['6:00 AM - 8:00 AM (Morning)', '8:00 AM - 10:00 AM', '6:00 PM - 8:00 PM (Floodlights)', '8:00 PM - 10:00 PM (Night)'],
    notes: 'Split turf charges equally (~Rs 150/player). Arrive 15 min early with white shoes.',
  },
  {
    name: 'Pickleball Match',
    icon: PickleballIcon,
    category: 'Pickleball',
    title: 'Pickleball Doubles: Pick Court & Day',
    options: ['Friday 7:00 PM (Court 1)', 'Saturday 8:30 AM (Court 2)', 'Sunday 5:30 PM (Court 1)'],
    notes: 'Bring paddle and water bottle. High-durability balls provided by host.',
  },
  {
    name: 'Squad Dinner',
    icon: FireIcon,
    category: 'Food',
    title: 'Friday Squad Dinner: Where are we eating?',
    options: ['Woodfired Pizza Cafe', 'Biryani & BBQ House', 'Asian Wok & Dimsum', 'Rooftop Lounge'],
    notes: 'Need table reservation booked by 5 PM sharp!',
  },
  {
    name: 'Weekend Hangout',
    icon: BoltIcon,
    category: 'Hangout',
    title: 'Weekend Plan: What should we do?',
    options: ['Board Games & Coffee', 'Bowling Alley & Arcade', 'Movie in Cinema', 'Road Trip & Dhaba'],
    notes: 'Vote by Thursday night so we can finalize bookings!',
  },
];

export default function HomePage() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [showHowItWorks, setShowHowItWorks] = useState(true);
  const [localCreatedPollIds, setLocalCreatedPollIds] = useState<string[]>([]);
  const [localVotedPollIds, setLocalVotedPollIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState('');

  // Delete modal state
  const [pollToDelete, setPollToDelete] = useState<{ id: string; title: string; createdBy: any } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Poll creation form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [guestCreatorName, setGuestCreatorName] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [allowCustomOptions, setAllowCustomOptions] = useState(true);
  const [allowMultipleVotes, setAllowMultipleVotes] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Load localStorage data
  useEffect(() => {
    try {
      const created = JSON.parse(localStorage.getItem('votepop_created_polls') || '[]');
      if (Array.isArray(created)) setLocalCreatedPollIds(created);
      const voted = JSON.parse(localStorage.getItem('votepop_voted_polls') || '[]');
      if (Array.isArray(voted)) setLocalVotedPollIds(voted);
      const guestName = localStorage.getItem('votepop_guest_name');
      if (guestName && !guestCreatorName) setGuestCreatorName(guestName);
    } catch {
      // Ignore
    }
  }, []);

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

  const handleApplyTemplate = (tpl: PresetTemplate) => {
    vibrateTap();
    setTitle(tpl.title);
    setCategory(tpl.category);
    setNotes(tpl.notes);
    setOptions(tpl.options);
    setShowCreateModal(true);
  };

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

    if (!user && !guestCreatorName.trim()) {
      setFormError('Please enter your name as creator (or sign in)');
      return;
    }

    setSubmitting(true);
    vibrateTap();

    const creatorData = user
      ? {
          username: user.username,
          name: user.name,
          avatarType: user.avatarType,
          avatarBgColor: user.avatarBgColor,
        }
      : {
          username: guestCreatorName.trim().toLowerCase().replace(/[^a-z0-9_]/g, '') || 'friend',
          name: guestCreatorName.trim(),
          avatarType: 'initials' as const,
          avatarBgColor: '#CEFF00',
        };

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
          createdBy: creatorData,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Failed to create poll');
        setSubmitting(false);
        return;
      }

      // Record poll ID locally
      try {
        const stored = JSON.parse(localStorage.getItem('votepop_created_polls') || '[]');
        if (Array.isArray(stored) && !stored.includes(data.poll.id)) {
          stored.push(data.poll.id);
          localStorage.setItem('votepop_created_polls', JSON.stringify(stored));
        }
        if (!user && guestCreatorName.trim()) {
          localStorage.setItem('votepop_guest_name', guestCreatorName.trim());
        }
      } catch {
        // Ignore
      }

      vibrateSuccess();
      router.push(`/poll/${data.poll.id}`);
    } catch {
      setFormError('Failed to connect to server');
      setSubmitting(false);
    }
  };

  const confirmDeletePoll = async () => {
    if (!pollToDelete) return;
    setIsDeleting(true);
    vibrateTap();

    const requesterUser = user?.username || guestCreatorName || pollToDelete.createdBy.username;
    const requesterName = user?.name || guestCreatorName || pollToDelete.createdBy.name;

    try {
      const res = await fetch(`/api/polls/${pollToDelete.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: requesterUser,
          name: requesterName,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // Remove from local list
        setPolls((prev) => prev.filter((p) => p.id !== pollToDelete.id));
        try {
          const stored = JSON.parse(localStorage.getItem('votepop_created_polls') || '[]');
          const updated = stored.filter((id: string) => id !== pollToDelete.id);
          localStorage.setItem('votepop_created_polls', JSON.stringify(updated));
          setLocalCreatedPollIds(updated);
        } catch {
          // ignore
        }
        vibrateSuccess();
        setToastMessage('Poll deleted successfully!');
        setTimeout(() => setToastMessage(''), 2500);
      } else {
        alert(data.error || 'Failed to delete poll');
      }
    } catch {
      alert('Network error while deleting poll');
    } finally {
      setIsDeleting(false);
      setPollToDelete(null);
    }
  };

  // Helper to determine if poll is owned by active user
  const isCreatedByUser = (poll: Poll) => {
    if (!poll || !poll.createdBy) return false;
    if (localCreatedPollIds.includes(poll.id)) return true;
    if (user) {
      return (
        user.username.toLowerCase() === poll.createdBy.username.toLowerCase() ||
        user.name.toLowerCase() === poll.createdBy.name.toLowerCase()
      );
    }
    if (guestCreatorName.trim()) {
      return (
        guestCreatorName.trim().toLowerCase() === poll.createdBy.name.toLowerCase() ||
        guestCreatorName.trim().toLowerCase() === poll.createdBy.username.toLowerCase()
      );
    }
    return false;
  };

  // Helper to determine if user voted in poll
  const hasUserVoted = (poll: Poll) => {
    if (localVotedPollIds.includes(poll.id)) return true;
    if (user) {
      return poll.options.some((opt) =>
        opt.voters.some(
          (v) =>
            v.username.toLowerCase() === user.username.toLowerCase() ||
            v.name.toLowerCase() === user.name.toLowerCase()
        )
      );
    }
    return false;
  };

  // Filtered polls
  const myPolls = polls.filter(isCreatedByUser);
  const votedPolls = polls.filter(hasUserVoted);

  const displayedPolls =
    activeTab === 'mine'
      ? myPolls
      : activeTab === 'voted'
      ? votedPolls
      : polls;

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-[#CEFF00] border-2 border-black rounded-2xl text-center font-black text-xs uppercase shadow-[2px_2px_0px_#000] animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Hero Banner */}
      <section className="bg-white border-[3px] border-black shadow-[6px_6px_0px_#000] rounded-3xl p-5 sm:p-8 relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-[#CEFF00] border-2 border-black rounded-full font-black text-[10px] sm:text-[11px] uppercase tracking-wider shadow-[1.5px_1.5px_0px_#000]">
            Squad Decision Engine
          </span>
          <span className="px-3 py-1 bg-[#00E5FF] border-2 border-black rounded-full font-black text-[10px] sm:text-[11px] uppercase tracking-wider shadow-[1.5px_1.5px_0px_#000]">
            Instant WhatsApp & QR Sharing
          </span>
        </div>

        <h1 className="text-2xl sm:text-5xl font-black tracking-tight text-black uppercase leading-[1.08] mb-3">
          No More 50-Message Group Chat Debates.
        </h1>
        <p className="text-xs sm:text-base font-bold text-gray-700 max-w-xl mb-5 sm:mb-6">
          Set up a poll for cricket turf slots, pickleball courts, or squad dinners. Friends vote in 2 taps, see live results, and chat in real-time.
        </p>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => {
              vibrateTap();
              // Reset creation form to clean state
              setTitle('');
              setCategory('');
              setNotes('');
              setOptions(['', '']);
              setShowCreateModal(true);
            }}
            className="px-5 sm:px-6 py-3 sm:py-3.5 bg-[#FFE600] text-black font-black text-xs sm:text-sm uppercase rounded-2xl border-[2.5px] border-black shadow-[4px_4px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none flex items-center gap-2 transition-all cursor-pointer"
          >
            <PlusIcon size={18} strokeWidth={3} />
            <span>Create A Poll</span>
          </button>

          {user ? (
            <button
              onClick={() => {
                vibrateTap();
                openAuthModal();
              }}
              className="px-4 sm:px-5 py-3 sm:py-3.5 bg-white text-black font-black text-xs sm:text-sm uppercase rounded-2xl border-[2.5px] border-black shadow-[3px_3px_0px_#000] hover:bg-gray-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
            >
              <Avatar
                name={user.name}
                avatarType={user.avatarType}
                avatarBgColor={user.avatarBgColor}
                size="xs"
              />
              <span>My Profile</span>
            </button>
          ) : (
            <button
              onClick={() => {
                vibrateTap();
                openAuthModal();
              }}
              className="px-4 sm:px-5 py-3 sm:py-3.5 bg-[#00E5FF] text-black font-black text-xs sm:text-sm uppercase rounded-2xl border-[2.5px] border-black shadow-[3px_3px_0px_#000] hover:bg-[#FFE600] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UserIcon size={16} />
              <span>Register / Sign In</span>
            </button>
          )}
        </div>
      </section>

      {/* 3-STEP ONBOARDING GUIDE FOR FIRST-TIME USERS */}
      {showHowItWorks && (
        <section className="bg-white border-[2.5px] border-black rounded-3xl p-4 sm:p-6 shadow-[5px_5px_0px_#000] relative">
          <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#FF6EA7] border-1.5 border-black flex items-center justify-center font-black text-xs shadow-[1px_1px_0px_#000]">
                ?
              </span>
              <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-black">
                How VotePOP Works in 3 Quick Steps
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowHowItWorks(false)}
              className="text-[10px] font-black uppercase text-gray-500 hover:text-black cursor-pointer underline"
            >
              Hide Guide
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Step 1 */}
            <div className="p-3.5 bg-[#FFE600]/25 border-2 border-black rounded-2xl shadow-[2px_2px_0px_#000] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-lg bg-[#FFE600] border-1.5 border-black flex items-center justify-center font-black text-xs shadow-[1px_1px_0px_#000]">
                    1
                  </span>
                  <PlusIcon size={16} />
                </div>
                <h4 className="font-black text-xs sm:text-sm uppercase text-black mb-1">
                  Create Instant Poll
                </h4>
                <p className="text-[11px] font-bold text-gray-700 leading-snug">
                  Add statement, turf time slots, & notes (court fees, rackets). No registration required!
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 bg-[#00E5FF]/20 border-2 border-black rounded-2xl shadow-[2px_2px_0px_#000] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-lg bg-[#00E5FF] border-1.5 border-black flex items-center justify-center font-black text-xs shadow-[1px_1px_0px_#000]">
                    2
                  </span>
                  <ShareIcon size={16} />
                </div>
                <h4 className="font-black text-xs sm:text-sm uppercase text-black mb-1">
                  Share 1-Tap or QR
                </h4>
                <p className="text-[11px] font-bold text-gray-700 leading-snug">
                  Blast the link to your WhatsApp squad or show the QR code on your phone screen.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 bg-[#CEFF00]/30 border-2 border-black rounded-2xl shadow-[2px_2px_0px_#000] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-lg bg-[#CEFF00] border-1.5 border-black flex items-center justify-center font-black text-xs shadow-[1px_1px_0px_#000]">
                    3
                  </span>
                  <ChatIcon size={16} />
                </div>
                <h4 className="font-black text-xs sm:text-sm uppercase text-black mb-1">
                  Squad Decides & Chats
                </h4>
                <p className="text-[11px] font-bold text-gray-700 leading-snug">
                  Watch live votes, crown the winner, and coordinate arrival times in the group chat.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* QUICK LAUNCH PRESET TEMPLATES */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#FFE600] border-1.5 border-black flex items-center justify-center shadow-[1px_1px_0px_#000]">
              <SparklesIcon size={13} />
            </div>
            <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-black">
              1-Tap Quick Start Templates
            </h3>
          </div>
          <span className="text-[10px] font-extrabold uppercase text-gray-500">
            Tap to prefill
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
          {TEMPLATES.map((tpl, idx) => {
            const Icon = tpl.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyTemplate(tpl)}
                className="p-2.5 bg-white hover:bg-gray-50 border-2 border-black rounded-2xl shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none text-left flex items-center gap-2 cursor-pointer transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-gray-100 border-1.5 border-black flex items-center justify-center shrink-0">
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <p className="font-black text-xs uppercase text-black truncate leading-tight">
                    {tpl.name}
                  </p>
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tight">
                    {tpl.category}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* POLLS SECTION WITH FILTER TABS */}
      <section className="space-y-4">
        {/* Navigation & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b-2 border-black">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => {
                vibrateSelect();
                setActiveTab('all');
              }}
              className={`px-3.5 py-1.5 font-black text-xs uppercase rounded-xl border-2 border-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-black text-white shadow-[2px_2px_0px_#FFE600]'
                  : 'bg-white text-black shadow-[2px_2px_0px_#000] hover:bg-gray-100'
              }`}
            >
              <span>All Polls</span>
              <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-black ${
                activeTab === 'all' ? 'bg-[#FFE600] text-black' : 'bg-gray-200 text-black'
              }`}>
                {polls.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                vibrateSelect();
                setActiveTab('mine');
              }}
              className={`px-3.5 py-1.5 font-black text-xs uppercase rounded-xl border-2 border-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'mine'
                  ? 'bg-[#CEFF00] text-black shadow-[2px_2px_0px_#000]'
                  : 'bg-white text-black shadow-[2px_2px_0px_#000] hover:bg-gray-100'
              }`}
            >
              <span>Created by Me</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-black text-white font-black">
                {myPolls.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                vibrateSelect();
                setActiveTab('voted');
              }}
              className={`px-3.5 py-1.5 font-black text-xs uppercase rounded-xl border-2 border-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'voted'
                  ? 'bg-[#00E5FF] text-black shadow-[2px_2px_0px_#000]'
                  : 'bg-white text-black shadow-[2px_2px_0px_#000] hover:bg-gray-100'
              }`}
            >
              <span>I Voted In</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-black text-white font-black">
                {votedPolls.length}
              </span>
            </button>
          </div>

          <button
            onClick={() => {
              vibrateTap();
              fetchPolls();
            }}
            className="text-xs font-black uppercase underline decoration-2 cursor-pointer self-end sm:self-auto"
          >
            Refresh Polls
          </button>
        </div>

        {/* Feed List */}
        {loading ? (
          <div className="py-12 text-center bg-white border-[2.5px] border-black rounded-2xl shadow-[4px_4px_0px_#000]">
            <p className="font-black text-sm uppercase text-gray-500 animate-pulse">
              Loading squad polls...
            </p>
          </div>
        ) : displayedPolls.length === 0 ? (
          <div className="py-12 px-6 text-center bg-white border-[2.5px] border-black rounded-3xl shadow-[5px_5px_0px_#000] space-y-3">
            <div className="w-14 h-14 bg-[#CEFF00] border-2 border-black rounded-2xl flex items-center justify-center mx-auto shadow-[3px_3px_0px_#000]">
              <VoteIcon size={26} />
            </div>

            {activeTab === 'mine' ? (
              <>
                <p className="font-black text-base sm:text-lg text-black uppercase">
                  You Haven&apos;t Created Any Polls Yet
                </p>
                <p className="text-xs font-bold text-gray-600 max-w-sm mx-auto">
                  Organizing turf cricket, weekend plans, or a dinner spot? Start your first poll in seconds!
                </p>
                <button
                  onClick={() => {
                    vibrateTap();
                    setShowCreateModal(true);
                  }}
                  className="mt-2 px-5 py-2.5 bg-[#FFE600] text-black font-black text-xs uppercase rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer"
                >
                  Create My First Poll
                </button>
              </>
            ) : activeTab === 'voted' ? (
              <>
                <p className="font-black text-base sm:text-lg text-black uppercase">
                  You Haven&apos;t Voted In Any Polls
                </p>
                <p className="text-xs font-bold text-gray-600 max-w-sm mx-auto">
                  Check out the squad polls in &ldquo;All Polls&rdquo; and cast your vote!
                </p>
                <button
                  onClick={() => {
                    vibrateSelect();
                    setActiveTab('all');
                  }}
                  className="mt-2 px-5 py-2.5 bg-[#00E5FF] text-black font-black text-xs uppercase rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer"
                >
                  Browse All Polls
                </button>
              </>
            ) : (
              <>
                <p className="font-black text-base sm:text-lg text-black uppercase">
                  No Squad Polls Created Yet
                </p>
                <p className="text-xs font-bold text-gray-600 max-w-sm mx-auto">
                  Be the squad leader! Create a quick poll and share the link on WhatsApp.
                </p>
                <button
                  onClick={() => {
                    vibrateTap();
                    setShowCreateModal(true);
                  }}
                  className="mt-2 px-5 py-2.5 bg-[#FFE600] text-black font-black text-xs uppercase rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer"
                >
                  Start First Squad Poll
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {displayedPolls.map((poll) => {
              const totalVotes = poll.options.reduce((sum, opt) => sum + opt.voters.length, 0);
              const leadingOpt = [...poll.options].sort((a, b) => b.voters.length - a.voters.length)[0];
              const isMine = isCreatedByUser(poll);

              return (
                <div
                  key={poll.id}
                  className="group relative bg-white border-[2.5px] border-black rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] transition-all flex flex-col justify-between"
                >
                  <Link
                    href={`/poll/${poll.id}`}
                    onClick={vibrateTap}
                    className="block focus:outline-hidden"
                  >
                    {/* Top Chips */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 bg-[#CEFF00] border-1.5 border-black rounded-md font-black text-[10px] uppercase tracking-wider shadow-[1px_1px_0px_#000]">
                          {poll.category}
                        </span>
                        {isMine && (
                          <span className="px-2 py-0.5 bg-black text-[#FFE600] border-1.5 border-black rounded-md font-black text-[9px] uppercase shadow-[1px_1px_0px_#000]">
                            Your Poll
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {poll.isClosed ? (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-[#FF5533] text-white border-1.5 border-black rounded-md font-black text-[9px] uppercase shadow-[1px_1px_0px_#000]">
                            <LockIcon size={10} />
                            <span>Decided</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-[#00E5FF] border-1.5 border-black rounded-md font-black text-[9px] uppercase shadow-[1px_1px_0px_#000]">
                            Open
                          </span>
                        )}

                        {/* Direct Delete button on card for creator */}
                        {isMine && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              vibrateTap();
                              setPollToDelete({ id: poll.id, title: poll.title, createdBy: poll.createdBy });
                            }}
                            className="w-6 h-6 rounded-md bg-red-100 hover:bg-[#FF5533] hover:text-white text-black border border-black flex items-center justify-center transition-colors cursor-pointer"
                            title="Delete this poll"
                          >
                            <TrashIcon size={12} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Question / Statement */}
                    <h3 className="font-black text-sm sm:text-base text-black uppercase leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {poll.title}
                    </h3>

                    {/* Optional Notes Preview */}
                    {poll.notes && (
                      <p className="text-[11px] font-semibold text-gray-600 line-clamp-1 mb-2.5 bg-gray-50 p-1.5 border border-black/30 rounded-lg">
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
                        <span className="text-[10px] font-black shrink-0 ml-2">
                          {leadingOpt.voters.length} votes
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Bottom Footer: Creator & Total Votes */}
                  <Link
                    href={`/poll/${poll.id}`}
                    onClick={vibrateTap}
                    className="pt-2.5 border-t-2 border-black flex items-center justify-between mt-1"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Avatar
                        name={poll.createdBy.name}
                        avatarType={poll.createdBy.avatarType}
                        avatarBgColor={poll.createdBy.avatarBgColor}
                        size="xs"
                      />
                      <span className="text-xs font-bold text-gray-700 truncate max-w-[100px] sm:max-w-[120px]">
                        {poll.createdBy.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-black text-black">
                        {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
                      </span>
                      <div className="w-5 h-5 rounded-full bg-[#FFE600] border-1.5 border-black flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                        <ArrowRightIcon size={11} strokeWidth={3} />
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CREATE POLL MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white border-[3px] border-black shadow-[7px_7px_0px_#000] p-5 sm:p-6 rounded-3xl max-h-[92vh] overflow-y-auto my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b-2 border-black mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FFE600] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
                  <PlusIcon size={20} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="font-black text-lg sm:text-xl uppercase tracking-tight text-black leading-none">
                    Create New Poll
                  </h3>
                  <p className="text-[10px] sm:text-[11px] font-bold text-gray-600 mt-0.5">
                    Fast decisions for your squad
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
              <div className="mb-4 p-3 bg-[#FF5533]/20 border-2 border-[#FF5533] rounded-xl text-black font-extrabold text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreatePoll} className="space-y-3.5">
              {/* Creator Attribution if not logged in */}
              {!user && (
                <div className="p-3 bg-[#00E5FF]/20 border-2 border-black rounded-2xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-black">
                      Your Name (Poll Creator) *
                    </label>
                    <button
                      type="button"
                      onClick={() => openAuthModal()}
                      className="text-[10px] font-black text-blue-700 underline uppercase"
                    >
                      Or Sign In
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Rahil Maiyani"
                    value={guestCreatorName}
                    onChange={(e) => setGuestCreatorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-black bg-white font-bold text-xs text-black placeholder:text-gray-400 focus:outline-hidden shadow-[1.5px_1.5px_0px_#000]"
                    required
                  />
                </div>
              )}

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
                  Custom Category (Any Tag)
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
                  <span>Optional Notes & Details</span>
                  <span className="text-[10px] text-gray-500 font-bold lowercase">fees, venue, gear</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Rs 1200 fee per player. Bring 2 rackets. Meeting directly at the turf!"
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
              <div className="pt-2 border-t-2 border-black space-y-2">
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
                className="w-full mt-3 py-3.5 bg-[#CEFF00] text-black font-black text-sm uppercase rounded-2xl border-[2.5px] border-black shadow-[4px_4px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <PlusIcon size={18} strokeWidth={3} />
                <span>{submitting ? 'Generating Poll & QR...' : 'Launch Poll & Generate QR'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {pollToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-sm bg-white border-[3px] border-black shadow-[6px_6px_0px_#000] p-5 rounded-3xl">
            <div className="flex items-center justify-between pb-2.5 border-b-2 border-black mb-3">
              <div className="flex items-center gap-2 text-[#FF5533]">
                <TrashIcon size={18} />
                <h3 className="font-black text-base uppercase text-black">Delete Poll?</h3>
              </div>
              <button
                type="button"
                onClick={() => setPollToDelete(null)}
                className="w-7 h-7 rounded-lg border-1.5 border-black bg-gray-100 flex items-center justify-center cursor-pointer"
              >
                <CloseIcon size={14} />
              </button>
            </div>

            <p className="text-xs font-bold text-gray-700 mb-4 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-black">&ldquo;{pollToDelete.title}&rdquo;</strong>? This will erase all votes and the group chat.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPollToDelete(null)}
                className="py-2.5 px-3 bg-gray-100 font-black text-xs uppercase border-2 border-black rounded-xl hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeletePoll}
                disabled={isDeleting}
                className="py-2.5 px-3 bg-[#FF5533] text-white font-black text-xs uppercase border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] hover:bg-black active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
