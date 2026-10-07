'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../components/AuthContext';
import { Avatar } from '../../../components/Avatar';
import { QRCodeModal } from '../../../components/QRCodeModal';
import { Poll, PollOption } from '../../../lib/types';
import { triggerNeoConfetti } from '../../../lib/confetti';
import {
  vibrateTap,
  vibrateSelect,
  vibrateSuccess,
  vibrateDecide,
} from '../../../lib/haptics';
import {
  ArrowLeftIcon,
  CheckIcon,
  LockIcon,
  TrophyIcon,
  QrCodeIcon,
  PlusIcon,
  SparklesIcon,
  ShieldCheckIcon,
} from '../../../components/Icons';

export default function PollDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const pollId = resolvedParams.id;

  const { user, openAuthModal } = useAuth();

  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [votingOptionId, setVotingOptionId] = useState<string | null>(null);
  const [customOptionText, setCustomOptionText] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Guest name input if not logged in
  const [guestName, setGuestName] = useState('');
  const [hasEnteredGuestName, setHasEnteredGuestName] = useState(false);

  // Load guest name from localStorage
  useEffect(() => {
    try {
      const savedGuest = localStorage.getItem('votepop_guest_name');
      if (savedGuest) {
        setGuestName(savedGuest);
        setHasEnteredGuestName(true);
      }
    } catch {
      // Ignore
    }
  }, []);

  const fetchPoll = async () => {
    try {
      const res = await fetch(`/api/polls/${pollId}`);
      const data = await res.json();
      if (res.ok && data.poll) {
        setPoll(data.poll);
      } else {
        setError(data.error || 'Poll not found');
      }
    } catch {
      setError('Failed to fetch poll');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoll();
    // Auto-refresh poll every 4 seconds for live sync
    const interval = setInterval(fetchPoll, 4000);
    return () => clearInterval(interval);
  }, [pollId]);

  const activeVoter = user
    ? {
        username: user.username,
        name: user.name,
        avatarType: user.avatarType,
        avatarBgColor: user.avatarBgColor,
      }
    : guestName.trim()
    ? {
        username: guestName.trim().toLowerCase().replace(/[^a-z0-9_]/g, ''),
        name: guestName.trim(),
        avatarType: 'initials' as const,
        avatarBgColor: '#CEFF00',
      }
    : null;

  const handleSaveGuestName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    vibrateTap();
    localStorage.setItem('votepop_guest_name', guestName.trim());
    setHasEnteredGuestName(true);
  };

  const handleVote = async (optionId: string) => {
    if (!poll || poll.isClosed) return;

    if (!activeVoter) {
      vibrateTap();
      setHasEnteredGuestName(false);
      return;
    }

    vibrateSelect();
    setVotingOptionId(optionId);

    try {
      const res = await fetch(`/api/polls/${pollId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          optionId,
          voter: activeVoter,
        }),
      });

      const data = await res.json();
      if (res.ok && data.poll) {
        setPoll(data.poll);
        vibrateSuccess();
        triggerNeoConfetti();
      }
    } catch {
      // Handle error
    } finally {
      setVotingOptionId(null);
    }
  };

  const handleAddCustomOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poll || !customOptionText.trim()) return;

    if (!activeVoter) {
      setHasEnteredGuestName(false);
      return;
    }

    vibrateTap();
    setIsAddingCustom(true);

    try {
      const res = await fetch(`/api/polls/${pollId}/option`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: customOptionText.trim(),
          voter: activeVoter,
        }),
      });

      const data = await res.json();
      if (res.ok && data.poll) {
        setPoll(data.poll);
        setCustomOptionText('');
        vibrateSuccess();
        triggerNeoConfetti();
      }
    } catch {
      // Handle error
    } finally {
      setIsAddingCustom(false);
    }
  };

  const handleFinalize = async (decidedOptionId?: string) => {
    if (!poll) return;
    vibrateDecide();

    try {
      const res = await fetch(`/api/polls/${pollId}/finalize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decidedOptionId,
          action: poll.isClosed ? 'unlock' : 'lock',
        }),
      });

      const data = await res.json();
      if (res.ok && data.poll) {
        setPoll(data.poll);
        if (!poll.isClosed) {
          triggerNeoConfetti();
        }
      }
    } catch {
      // Handle error
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center bg-white border-[3px] border-black rounded-3xl shadow-[6px_6px_0px_#000]">
        <p className="font-black text-base uppercase text-gray-700 animate-pulse">
          Loading poll details...
        </p>
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="py-16 px-6 text-center bg-white border-[3px] border-black rounded-3xl shadow-[6px_6px_0px_#000] space-y-4">
        <h2 className="font-black text-2xl uppercase text-[#FF5533]">Poll Not Found</h2>
        <p className="text-sm font-bold text-gray-700">
          This poll may have been removed or the link is invalid.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-[#FFE600] text-black font-black text-xs uppercase rounded-xl border-2 border-black shadow-[3px_3px_0px_#000]"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.voters.length, 0);

  // Calculate winner / leading option
  const sortedOptions = [...poll.options].sort((a, b) => b.voters.length - a.voters.length);
  const leadingOption = sortedOptions[0];
  const isDecided = poll.isClosed;
  const decidedOption = poll.decidedOptionId
    ? poll.options.find((o) => o.id === poll.decidedOptionId)
    : leadingOption;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${currentOrigin}/poll/${poll.id}`;

  return (
    <div className="space-y-6">
      {/* Back button & Share Bar */}
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/"
          onClick={vibrateTap}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black font-black text-xs uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
        >
          <ArrowLeftIcon size={14} strokeWidth={3} />
          <span>All Polls</span>
        </Link>

        <button
          onClick={() => {
            vibrateTap();
            setShowShareModal(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00E5FF] text-black font-black text-xs uppercase rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
        >
          <QrCodeIcon size={15} />
          <span>Share & QR</span>
        </button>
      </div>

      {/* Main Poll Header Card */}
      <section className="bg-white border-[3px] border-black rounded-3xl p-6 sm:p-7 shadow-[6px_6px_0px_#000] relative">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="px-3 py-1 bg-[#CEFF00] border-2 border-black rounded-full font-black text-xs uppercase tracking-wider shadow-[1.5px_1.5px_0px_#000]">
            {poll.category}
          </span>

          {isDecided ? (
            <span className="flex items-center gap-1 px-3 py-1 bg-[#FF5533] text-white border-2 border-black rounded-full font-black text-xs uppercase shadow-[1.5px_1.5px_0px_#000]">
              <LockIcon size={12} strokeWidth={2.5} />
              <span>Poll Decided</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-[#FFE600] border-2 border-black rounded-full font-black text-xs uppercase shadow-[1.5px_1.5px_0px_#000]">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              <span>Voting Open</span>
            </span>
          )}
        </div>

        {/* Statement / Title */}
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black leading-tight mb-3">
          {poll.title}
        </h1>

        {/* Optional Notes Section */}
        {poll.notes && (
          <div className="mb-4 p-3.5 bg-yellow-50 border-2 border-black rounded-2xl shadow-[2px_2px_0px_#000]">
            <p className="text-[11px] font-black uppercase tracking-wider text-gray-700 mb-0.5">
              Organizer Notes & Rules:
            </p>
            <p className="text-xs sm:text-sm font-bold text-gray-900 whitespace-pre-wrap leading-relaxed">
              {poll.notes}
            </p>
          </div>
        )}

        {/* Creator & Meta info */}
        <div className="flex items-center justify-between pt-3 border-t-2 border-black text-xs">
          <div className="flex items-center gap-2">
            <Avatar
              name={poll.createdBy.name}
              avatarType={poll.createdBy.avatarType}
              avatarBgColor={poll.createdBy.avatarBgColor}
              size="xs"
            />
            <span className="font-bold text-gray-700">
              Created by <strong className="text-black">{poll.createdBy.name}</strong>
            </span>
          </div>

          <span className="font-black text-black">
            {totalVotes} {totalVotes === 1 ? 'total vote' : 'total votes'}
          </span>
        </div>
      </section>

      {/* WINNER / DECISION BANNER */}
      {isDecided && decidedOption && (
        <section className="bg-[#FFE600] border-[3px] border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000] text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black rounded-full font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#000] mb-3">
            <TrophyIcon size={16} />
            <span>Official Squad Verdict</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black uppercase text-black tracking-tight mb-1">
            {decidedOption.text}
          </h2>
          <p className="font-extrabold text-sm text-gray-900 mb-4">
            Crowned with {decidedOption.voters.length} squad votes!
          </p>

          <button
            onClick={() => {
              vibrateSuccess();
              triggerNeoConfetti();
            }}
            className="px-5 py-2.5 bg-white text-black font-black text-xs uppercase rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
          >
            Celebrate ??
          </button>
        </section>
      )}

      {/* Current Leader Bar if not decided */}
      {!isDecided && leadingOption && leadingOption.voters.length > 0 && (
        <div className="p-3.5 bg-[#CEFF00]/40 border-2 border-black rounded-2xl shadow-[3px_3px_0px_#000] flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#FFE600] border-1.5 border-black flex items-center justify-center shrink-0 shadow-[1px_1px_0px_#000]">
              <TrophyIcon size={16} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-700 block">
                Current Leader
              </span>
              <p className="font-black text-sm text-black truncate leading-tight">
                {leadingOption.text}
              </p>
            </div>
          </div>
          <span className="font-black text-xs shrink-0 ml-3 bg-white px-2.5 py-1 border-1.5 border-black rounded-lg shadow-[1px_1px_0px_#000]">
            {leadingOption.voters.length} votes
          </span>
        </div>
      )}

      {/* VOTER IDENTITY BAR / NAME PROMPT */}
      <section className="bg-white border-2 border-black rounded-2xl p-4 shadow-[3px_3px_0px_#000]">
        {activeVoter && hasEnteredGuestName ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Avatar
                name={activeVoter.name}
                avatarType={activeVoter.avatarType}
                avatarBgColor={activeVoter.avatarBgColor}
                size="sm"
              />
              <div>
                <p className="text-xs font-black text-black">
                  Voting as: <span className="underline">{activeVoter.name}</span>
                </p>
                <p className="text-[10px] font-bold text-gray-600">
                  {user ? `@${user.username} (Verified)` : 'Tap option to cast or update vote'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                vibrateTap();
                if (user) {
                  openAuthModal();
                } else {
                  setHasEnteredGuestName(false);
                }
              }}
              className="px-2.5 py-1 bg-gray-100 border-1.5 border-black rounded-lg font-black text-[11px] uppercase cursor-pointer"
            >
              Change
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-[#FFE600] border-1.5 border-black flex items-center justify-center">
                <ShieldCheckIcon size={14} />
              </div>
              <h3 className="font-black text-xs uppercase tracking-wider text-black">
                Enter Your Name To Vote
              </h3>
            </div>

            <form onSubmit={handleSaveGuestName} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Your name or nickname..."
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border-2 border-black bg-white font-bold text-xs text-black placeholder:text-gray-400 focus:outline-hidden shadow-[1.5px_1.5px_0px_#000]"
                required
              />
              <button
                type="submit"
                className="shrink-0 px-4 py-2 bg-[#CEFF00] font-black text-xs uppercase border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                Set Name
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                vibrateTap();
                openAuthModal();
              }}
              className="text-[11px] font-black text-gray-700 underline cursor-pointer"
            >
              Or Sign In with Squad ID (pick avatar) ?
            </button>
          </div>
        )}
      </section>

      {/* OPTIONS & LIVE RESULTS LIST */}
      <section className="space-y-3.5">
        <h3 className="font-black text-sm uppercase tracking-wider text-black flex items-center gap-1.5">
          <SparklesIcon size={16} />
          <span>Options & Real-Time Results</span>
        </h3>

        {poll.options.map((opt) => {
          const voteCount = opt.voters.length;
          const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
          const userVotedForThis =
            activeVoter &&
            opt.voters.some(
              (v) => (v.username || v.name).toLowerCase() === activeVoter.username.toLowerCase()
            );

          return (
            <div
              key={opt.id}
              className={`relative bg-white border-[2.5px] border-black rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_#000] transition-all overflow-hidden ${
                userVotedForThis ? 'ring-2 ring-black bg-yellow-50/50' : ''
              }`}
            >
              {/* Animated Progress Bar fill */}
              <div
                className="absolute inset-y-0 left-0 opacity-25 pointer-events-none transition-all duration-700 ease-out"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: opt.color,
                }}
              />

              <div className="relative z-10">
                {/* Top Row: Option Title & Vote Action */}
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-4 h-4 rounded-full border-1.5 border-black shrink-0 shadow-[1px_1px_0px_#000]"
                      style={{ backgroundColor: opt.color }}
                    />
                    <h4 className="font-black text-base sm:text-lg text-black uppercase leading-tight truncate">
                      {opt.text}
                    </h4>
                  </div>

                  {!isDecided && (
                    <button
                      onClick={() => handleVote(opt.id)}
                      disabled={votingOptionId === opt.id}
                      className={`shrink-0 px-4 py-2 font-black text-xs uppercase rounded-xl border-2 border-black transition-all cursor-pointer flex items-center gap-1.5 ${
                        userVotedForThis
                          ? 'bg-[#CEFF00] shadow-[2px_2px_0px_#000]'
                          : 'bg-white hover:bg-gray-100 shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
                      }`}
                    >
                      {userVotedForThis ? (
                        <>
                          <CheckIcon size={14} />
                          <span>Voted</span>
                        </>
                      ) : (
                        <span>Vote</span>
                      )}
                    </button>
                  )}
                </div>

                {/* Progress bar line */}
                <div className="w-full h-3 bg-gray-100 border-2 border-black rounded-full overflow-hidden mb-2.5">
                  <div
                    className="h-full border-r-2 border-black transition-all duration-500 ease-out"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: opt.color,
                    }}
                  />
                </div>

                {/* Vote stats row */}
                <div className="flex items-center justify-between text-xs font-black text-gray-800 mb-2.5">
                  <span>
                    {voteCount} {voteCount === 1 ? 'vote' : 'votes'}
                  </span>
                  <span>{percentage}%</span>
                </div>

                {/* Voters List Badges */}
                {opt.voters.length > 0 && (
                  <div className="pt-2.5 border-t border-black/20">
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1.5">
                      Voted by:
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {opt.voters.map((voter, vIdx) => (
                        <div
                          key={vIdx}
                          className="flex items-center gap-1.5 px-2 py-1 bg-white border-1.5 border-black rounded-full shadow-[1px_1px_0px_#000]"
                        >
                          <Avatar
                            name={voter.name}
                            avatarType={voter.avatarType}
                            avatarBgColor={voter.avatarBgColor}
                            size="xs"
                          />
                          <span className="text-[11px] font-extrabold text-black">
                            {voter.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* ADD CUSTOM OPTION INPUT (if enabled and not closed) */}
      {!isDecided && poll.allowCustomOptions && (
        <section className="bg-white border-[2.5px] border-black rounded-2xl p-5 shadow-[4px_4px_0px_#000]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md bg-[#00E5FF] border-1.5 border-black flex items-center justify-center shadow-[1px_1px_0px_#000]">
              <PlusIcon size={14} strokeWidth={3} />
            </div>
            <h4 className="font-black text-xs uppercase tracking-wider text-black">
              Got Another Idea? Add Your Option
            </h4>
          </div>

          <form onSubmit={handleAddCustomOption} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="e.g. Sunday 7 AM or Turf C"
              value={customOptionText}
              onChange={(e) => setCustomOptionText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-black bg-white font-bold text-xs text-black placeholder:text-gray-400 focus:outline-hidden shadow-[1.5px_1.5px_0px_#000]"
              required
            />
            <button
              type="submit"
              disabled={isAddingCustom}
              className="shrink-0 px-4 py-2.5 bg-[#00E5FF] text-black font-black text-xs uppercase rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer disabled:opacity-50"
            >
              {isAddingCustom ? 'Adding...' : 'Add & Vote'}
            </button>
          </form>
        </section>
      )}

      {/* ORGANIZER ACTIONS (Lock & Finalize) */}
      <section className="pt-4 border-t-2 border-black flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-bold text-gray-600">
          {isDecided ? 'Poll is locked.' : 'Ready to close and decide?'}
        </p>

        <button
          onClick={() => handleFinalize()}
          className={`px-4 py-2 rounded-xl border-2 border-black font-black text-xs uppercase shadow-[2.5px_2.5px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer ${
            isDecided
              ? 'bg-white text-black'
              : 'bg-[#FF5533] text-white hover:bg-black'
          }`}
        >
          {isDecided ? 'Reopen Poll' : 'Lock & Finalize Decision ??'}
        </button>
      </section>

      {/* QR Code & Share Modal */}
      <QRCodeModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        url={shareUrl}
        pollTitle={poll.title}
      />
    </div>
  );
}
