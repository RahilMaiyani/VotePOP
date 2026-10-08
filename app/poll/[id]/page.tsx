'use client';

import React, { useState, useEffect, use, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../components/AuthContext';
import { Avatar } from '../../../components/Avatar';
import { QRCodeModal } from '../../../components/QRCodeModal';
import { PollChat } from '../../../components/PollChat';
import { Poll } from '../../../lib/types';
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
  UserIcon,
  TrashIcon,
  CloseIcon,
  ShareIcon,
} from '../../../components/Icons';

export default function PollDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const pollId = resolvedParams.id;

  const { user, openAuthModal } = useAuth();

  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [voteError, setVoteError] = useState('');
  const [votingOptionId, setVotingOptionId] = useState<string | null>(null);
  const [customOptionText, setCustomOptionText] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Guest name input if not logged in
  const [guestName, setGuestName] = useState('');
  const [hasEnteredGuestName, setHasEnteredGuestName] = useState(false);
  const [locallyCreatedPolls, setLocallyCreatedPolls] = useState<string[]>([]);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Load guest name and created poll IDs from localStorage
  useEffect(() => {
    try {
      const savedGuest = localStorage.getItem('votepop_guest_name');
      if (savedGuest) {
        setGuestName(savedGuest);
        setHasEnteredGuestName(true);
      }
      const savedCreated = JSON.parse(localStorage.getItem('votepop_created_polls') || '[]');
      if (Array.isArray(savedCreated)) {
        setLocallyCreatedPolls(savedCreated);
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
    const interval = setInterval(fetchPoll, 3500);
    return () => clearInterval(interval);
  }, [pollId]);

  const activeVoter = user
    ? {
        username: user.username,
        name: user.name,
        avatarType: user.avatarType,
        avatarBgColor: user.avatarBgColor,
      }
    : hasEnteredGuestName && guestName.trim()
    ? {
        username: guestName.trim().toLowerCase().replace(/[^a-z0-9_]/g, ''),
        name: guestName.trim(),
        avatarType: 'initials' as const,
        avatarBgColor: '#CEFF00',
      }
    : null;

  const handleSaveGuestName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setVoteError('Please type your name first!');
      return;
    }
    vibrateTap();
    localStorage.setItem('votepop_guest_name', guestName.trim());
    setHasEnteredGuestName(true);
    setVoteError('');
  };

  const handleVote = async (optionId: string) => {
    if (!poll || poll.isClosed) return;

    if (!activeVoter) {
      vibrateSelect();
      setVoteError('Please enter your name below or Sign In to cast your vote!');
      nameInputRef.current?.focus();
      const el = document.getElementById('voter-identity-card');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setVoteError('');
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
        try {
          const voted = JSON.parse(localStorage.getItem('votepop_voted_polls') || '[]');
          if (Array.isArray(voted) && !voted.includes(pollId)) {
            voted.push(pollId);
            localStorage.setItem('votepop_voted_polls', JSON.stringify(voted));
          }
        } catch {
          // ignore
        }
        vibrateSuccess();
        triggerNeoConfetti();
      } else {
        setVoteError(data.error || 'Failed to record vote');
      }
    } catch {
      setVoteError('Network error while voting');
    } finally {
      setVotingOptionId(null);
    }
  };

  const handleAddCustomOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poll || !customOptionText.trim()) return;

    if (!activeVoter) {
      vibrateSelect();
      setVoteError('Please enter your name below or Sign In before adding an option!');
      nameInputRef.current?.focus();
      return;
    }

    setVoteError('');
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
        try {
          const voted = JSON.parse(localStorage.getItem('votepop_voted_polls') || '[]');
          if (Array.isArray(voted) && !voted.includes(pollId)) {
            voted.push(pollId);
            localStorage.setItem('votepop_voted_polls', JSON.stringify(voted));
          }
        } catch {
          // ignore
        }
        vibrateSuccess();
        triggerNeoConfetti();
      } else {
        setVoteError(data.error || 'Failed to add option');
      }
    } catch {
      setVoteError('Network error while adding option');
    } finally {
      setIsAddingCustom(false);
    }
  };

  const handleFinalize = async (decidedOptionId?: string) => {
    if (!poll) return;
    const requesterUser = user?.username || (hasEnteredGuestName ? guestName.trim() : '') || poll.createdBy.username;
    const requesterName = user?.name || (hasEnteredGuestName ? guestName.trim() : '') || poll.createdBy.name;

    vibrateDecide();

    try {
      const res = await fetch(`/api/polls/${pollId}/finalize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decidedOptionId,
          action: poll.isClosed ? 'unlock' : 'lock',
          username: requesterUser,
          name: requesterName,
        }),
      });

      const data = await res.json();
      if (res.ok && data.poll) {
        setPoll(data.poll);
        if (!poll.isClosed) {
          triggerNeoConfetti();
        }
      } else {
        alert(data.error || 'Only the poll creator can finalize or lock this decision.');
      }
    } catch {
      alert('Failed to connect to server');
    }
  };

  const handleDeletePoll = async () => {
    if (!poll) return;
    vibrateTap();
    setDeleting(true);

    const requesterUser = user?.username || (hasEnteredGuestName ? guestName.trim() : '') || poll.createdBy.username;
    const requesterName = user?.name || (hasEnteredGuestName ? guestName.trim() : '') || poll.createdBy.name;

    try {
      const res = await fetch(`/api/polls/${pollId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: requesterUser,
          name: requesterName,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        try {
          const stored = JSON.parse(localStorage.getItem('votepop_created_polls') || '[]');
          const updated = stored.filter((id: string) => id !== pollId);
          localStorage.setItem('votepop_created_polls', JSON.stringify(updated));
        } catch {
          // ignore
        }
        vibrateSuccess();
        router.push('/');
      } else {
        alert(data.error || 'Failed to delete poll');
      }
    } catch {
      alert('Network error while deleting poll');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
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
          This poll may have been deleted or the link is invalid.
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
  const leadingOption = [...poll.options].sort((a, b) => b.voters.length - a.voters.length)[0];
  const isDecided = poll.isClosed;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${currentOrigin}/poll/${poll.id}`;

  // Check creator authorization (authenticated user OR guest matching name/username OR stored in browser)
  const isCreator = Boolean(
    poll.createdBy && (
      (user && (
        user.username.toLowerCase() === poll.createdBy.username.toLowerCase() ||
        user.name.toLowerCase() === poll.createdBy.name.toLowerCase()
      )) ||
      (guestName.trim() && (
        guestName.trim().toLowerCase() === poll.createdBy.name.toLowerCase() ||
        guestName.trim().toLowerCase() === poll.createdBy.username.toLowerCase()
      )) ||
      locallyCreatedPolls.includes(poll.id)
    )
  );

  return (
    <div className="space-y-5 pb-12">
      {/* Back button & Quick Share Header */}
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/"
          onClick={vibrateTap}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-black rounded-xl font-black text-xs uppercase shadow-[2px_2px_0px_#000] hover:bg-gray-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
        >
          <ArrowLeftIcon size={14} />
          <span>All Polls</span>
        </Link>

        <div className="flex items-center gap-2">
          {isCreator && (
            <button
              onClick={() => {
                vibrateTap();
                setShowDeleteModal(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-red-100 hover:bg-[#FF5533] hover:text-white text-black font-black text-xs uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-colors cursor-pointer"
              title="Delete this poll"
            >
              <TrashIcon size={14} />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}

          <button
            onClick={() => {
              vibrateTap();
              setShowShareModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFE600] text-black font-black text-xs uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
          >
            <ShareIcon size={14} />
            <span>Share & QR</span>
          </button>
        </div>
      </div>

      {/* Main Poll Header Banner */}
      <section className="bg-white border-[3px] border-black shadow-[6px_6px_0px_#000] rounded-3xl p-5 sm:p-7 relative overflow-hidden">
        {/* Category & Status Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#CEFF00] border-2 border-black rounded-full font-black text-[11px] uppercase tracking-wider shadow-[1.5px_1.5px_0px_#000]">
              {poll.category}
            </span>
            {isCreator && (
              <span className="px-2.5 py-0.5 bg-black text-white font-black text-[10px] uppercase rounded-full shadow-[1px_1px_0px_#000]">
                You Created This
              </span>
            )}
          </div>

          {isDecided ? (
            <span className="flex items-center gap-1 px-3 py-1 bg-[#FF5533] text-white border-2 border-black rounded-full font-black text-[10px] uppercase shadow-[1.5px_1.5px_0px_#000]">
              <LockIcon size={12} />
              <span>Decided & Locked</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 px-3 py-1 bg-[#00E5FF] text-black border-2 border-black rounded-full font-black text-[10px] uppercase shadow-[1.5px_1.5px_0px_#000]">
              <SparklesIcon size={12} />
              <span>Voting Active</span>
            </span>
          )}
        </div>

        {/* Poll Title */}
        <h1 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-black leading-tight mb-2.5">
          {poll.title}
        </h1>

        {/* Optional Notes Preview */}
        {poll.notes && (
          <div className="p-3 bg-[#FFE600]/20 border-2 border-black rounded-xl mb-4 text-xs font-bold text-gray-800 leading-relaxed">
            <strong className="uppercase text-[10px] text-black block mb-0.5">Details & Notes:</strong>
            {poll.notes}
          </div>
        )}

        {/* Creator Attribution & Stat summary */}
        <div className="pt-3 border-t-2 border-black flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Avatar
              name={poll.createdBy.name}
              avatarType={poll.createdBy.avatarType}
              avatarBgColor={poll.createdBy.avatarBgColor}
              size="xs"
            />
            <span className="font-bold text-gray-700">
              Created by <strong className="text-black font-black">@{poll.createdBy.username}</strong> ({poll.createdBy.name})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-gray-100 border-1.5 border-black rounded-lg font-black text-black">
              {totalVotes} {totalVotes === 1 ? 'total vote' : 'total votes'}
            </span>
            {poll.allowMultipleVotes && (
              <span className="px-2 py-0.5 bg-[#00E5FF]/30 border border-black rounded font-black text-[10px] uppercase">
                Multi-vote
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Decision Banner (If finalized) */}
      {isDecided && (
        <section className="bg-[#FFE600] border-[3px] border-black shadow-[6px_6px_0px_#000] rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-black text-[#FFE600] flex items-center justify-center shrink-0 border-2 border-black shadow-[2px_2px_0px_#000]">
              <TrophyIcon size={26} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-black text-[11px] uppercase tracking-wider text-black">
                Official Winning Decision
              </p>
              <h2 className="font-black text-base sm:text-xl uppercase text-black leading-tight">
                {poll.options.find((o) => o.id === poll.decidedOptionId)?.text || leadingOption?.text || 'Consensus reached'}
              </h2>
            </div>
          </div>

          {isCreator && (
            <button
              onClick={() => handleFinalize()}
              className="px-3 py-1.5 bg-white text-black font-black text-xs uppercase border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer shrink-0 flex items-center gap-1"
            >
              <LockIcon size={12} />
              <span>Reopen</span>
            </button>
          )}
        </section>
      )}

      {/* Voter Identity Bar (If guest not identified) */}
      {!user && (
        <section
          id="voter-identity-card"
          className="bg-white border-[2.5px] border-black rounded-2xl p-3.5 sm:p-4 shadow-[4px_4px_0px_#000] transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#00E5FF] border-1.5 border-black flex items-center justify-center shadow-[1px_1px_0px_#000]">
                <UserIcon size={14} />
              </div>
              <h3 className="font-black text-xs uppercase tracking-wider text-black">
                {hasEnteredGuestName ? `Voting As: ${guestName}` : 'Step 1: Identify Yourself to Vote'}
              </h3>
            </div>

            <button
              onClick={() => openAuthModal()}
              className="text-[11px] font-black uppercase text-blue-700 underline decoration-2 cursor-pointer"
            >
              Sign In Instead
            </button>
          </div>

          {hasEnteredGuestName ? (
            <div className="flex items-center justify-between bg-gray-50 border-1.5 border-black/40 rounded-xl p-2">
              <div className="flex items-center gap-2">
                <Avatar name={guestName} avatarType="initials" avatarBgColor="#CEFF00" size="xs" />
                <span className="font-black text-xs text-black">{guestName}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  vibrateTap();
                  setHasEnteredGuestName(false);
                }}
                className="text-[10px] font-black uppercase underline text-gray-600 cursor-pointer"
              >
                Change Name
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveGuestName} className="flex gap-2">
              <input
                ref={nameInputRef}
                type="text"
                placeholder="Type your name (e.g. Rahil, Sarah, Dev)"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border-2 border-black bg-white font-bold text-xs text-black placeholder:text-gray-400 focus:outline-hidden focus:bg-[#00E5FF]/10 shadow-[1.5px_1.5px_0px_#000]"
                required
              />
              <button
                type="submit"
                className="shrink-0 px-4 py-2 bg-[#00E5FF] text-black font-black text-xs uppercase rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer transition-all"
              >
                Save
              </button>
            </form>
          )}
        </section>
      )}

      {/* Vote Error Feedback Banner */}
      {voteError && (
        <div className="p-3 bg-[#FF5533]/20 border-2 border-[#FF5533] rounded-2xl text-black font-black text-xs flex items-center justify-between animate-shake">
          <span>{voteError}</span>
          <button
            onClick={() => setVoteError('')}
            className="w-6 h-6 rounded-md bg-white border border-black flex items-center justify-center cursor-pointer"
          >
            <CloseIcon size={12} />
          </button>
        </div>
      )}

      {/* OPTIONS VOTING LIST */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm uppercase tracking-wider text-black">
            Cast Your Vote ({poll.options.length} Options)
          </h3>
          <span className="text-[11px] font-bold text-gray-600">
            {poll.allowMultipleVotes ? 'Select any options' : 'Single choice'}
          </span>
        </div>

        {poll.options.map((opt, idx) => {
          const voteCount = opt.voters.length;
          const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
          const isWinner = isDecided && (poll.decidedOptionId === opt.id || (!poll.decidedOptionId && opt.id === leadingOption?.id));
          const hasVotedThisOpt = activeVoter
            ? opt.voters.some(
                (v) => (v.username || v.name).toLowerCase().trim() === (activeVoter.username || activeVoter.name).toLowerCase().trim()
              )
            : false;

          return (
            <div
              key={opt.id}
              className={`relative bg-white border-[2.5px] border-black rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_#000] transition-all ${
                isWinner ? 'ring-3 ring-[#FFE600] bg-[#FFE600]/10' : ''
              }`}
            >
              {/* Progress background bar */}
              <div
                className="absolute inset-y-0 left-0 rounded-2xl opacity-20 pointer-events-none transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: opt.color || '#CEFF00',
                }}
              />

              <div className="relative z-10 space-y-3">
                {/* Top row: Option text + Vote Button */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-7 h-7 rounded-lg border-2 border-black flex items-center justify-center font-black text-xs shrink-0 shadow-[1px_1px_0px_#000]"
                      style={{ backgroundColor: opt.color || '#FFE600' }}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-black text-sm sm:text-base text-black uppercase leading-snug">
                        {opt.text}
                      </h4>
                      {isWinner && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.2 bg-black text-[#FFE600] font-black text-[9px] uppercase rounded mt-0.5">
                          <TrophyIcon size={10} />
                          <span>Winning Choice</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Vote button or voted indicator */}
                  {!isDecided ? (
                    <button
                      type="button"
                      disabled={votingOptionId === opt.id}
                      onClick={() => handleVote(opt.id)}
                      className={`shrink-0 px-3.5 sm:px-4 py-2 font-black text-xs uppercase rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center gap-1.5 ${
                        hasVotedThisOpt
                          ? 'bg-[#CEFF00] text-black ring-2 ring-black'
                          : 'bg-white text-black hover:bg-[#FFE600]'
                      }`}
                    >
                      {hasVotedThisOpt ? (
                        <>
                          <CheckIcon size={14} />
                          <span>Voted</span>
                        </>
                      ) : (
                        <span>Vote</span>
                      )}
                    </button>
                  ) : (
                    hasVotedThisOpt && (
                      <span className="px-3 py-1 bg-[#CEFF00] text-black font-black text-[11px] uppercase rounded-lg border-1.5 border-black shadow-[1px_1px_0px_#000] flex items-center gap-1">
                        <CheckIcon size={12} />
                        <span>Your Vote</span>
                      </span>
                    )
                  )}
                </div>

                {/* Vote stats and voter avatars */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-black">
                      {voteCount} {voteCount === 1 ? 'vote' : 'votes'}
                    </span>
                    <span className="text-[11px] font-bold text-gray-500">
                      ({percentage}%)
                    </span>
                  </div>

                  {isCreator && !isDecided && (
                    <button
                      type="button"
                      onClick={() => handleFinalize(opt.id)}
                      className="text-[10px] font-black uppercase text-black hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <TrophyIcon size={11} />
                      <span>Crown as Winner</span>
                    </button>
                  )}
                </div>

                {/* Voters Pill List */}
                {opt.voters.length > 0 && (
                  <div className="pt-2 border-t border-black/15">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {opt.voters.map((voter, vIdx) => (
                        <div
                          key={vIdx}
                          className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 border border-black/40 rounded-full"
                          title={voter.name}
                        >
                          <Avatar
                            name={voter.name}
                            avatarType={voter.avatarType}
                            avatarBgColor={voter.avatarBgColor}
                            size="xs"
                          />
                          <span className="text-[11px] font-black text-black">
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
        <section className="bg-white border-[2.5px] border-black rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_#000]">
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
              className="w-full px-3.5 py-2 rounded-xl border-2 border-black bg-white font-bold text-xs text-black placeholder:text-gray-400 focus:outline-hidden shadow-[1.5px_1.5px_0px_#000]"
              required
            />
            <button
              type="submit"
              disabled={isAddingCustom}
              className="shrink-0 px-4 py-2 bg-[#00E5FF] text-black font-black text-xs uppercase rounded-xl border-2 border-black shadow-[2.5px_2.5px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer disabled:opacity-50"
            >
              {isAddingCustom ? 'Adding...' : 'Add & Vote'}
            </button>
          </form>
        </section>
      )}

      {/* SQUAD CHAT & DISCUSSION */}
      <PollChat
        pollId={poll.id}
        messages={poll.messages || []}
        activeUser={activeVoter}
        onPollUpdated={(updatedPoll) => setPoll(updatedPoll)}
        onRequestIdentity={() => {
          nameInputRef.current?.focus();
          const el = document.getElementById('voter-identity-card');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }}
      />

      {/* ORGANIZER ACTIONS (Lock, Finalize, or Delete - ONLY FOR CREATOR) */}
      <section className="pt-3 border-t-2 border-black">
        {isCreator ? (
          <div className="bg-[#FFE600]/30 border-2 border-black rounded-2xl p-4 shadow-[3px_3px_0px_#000] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-black text-white font-black text-[9px] uppercase rounded-sm">
                  Creator Controls
                </span>
                <p className="font-black text-xs uppercase text-black">Poll Management</p>
              </div>

              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="px-2.5 py-1 bg-red-100 hover:bg-[#FF5533] hover:text-white text-black font-black text-[11px] uppercase rounded-lg border-1.5 border-black transition-colors flex items-center gap-1 cursor-pointer"
              >
                <TrashIcon size={12} />
                <span>Delete Poll</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-black/20">
              <p className="text-[11px] font-bold text-gray-700">
                {isDecided
                  ? 'This poll is currently locked and finalized.'
                  : 'Ready to declare the official winner for your squad?'}
              </p>

              <button
                onClick={() => handleFinalize()}
                className={`px-4 py-2 rounded-xl border-2 border-black font-black text-xs uppercase shadow-[2.5px_2.5px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  isDecided
                    ? 'bg-white text-black hover:bg-gray-100'
                    : 'bg-[#FF5533] text-white hover:bg-black'
                }`}
              >
                {isDecided ? (
                  <>
                    <LockIcon size={13} />
                    <span>Reopen Poll</span>
                  </>
                ) : (
                  <>
                    <TrophyIcon size={13} />
                    <span>Lock & Finalize Decision</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-gray-50 border border-black/30 rounded-xl text-center">
            <p className="text-xs font-bold text-gray-600">
              {isDecided
                ? 'This poll has been locked by the creator.'
                : `Only creator (@${poll.createdBy.username}) can lock or delete this poll.`}
            </p>
          </div>
        )}
      </section>

      {/* QR Code & Share Modal */}
      <QRCodeModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        url={shareUrl}
        pollTitle={poll.title}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-sm bg-white border-[3px] border-black shadow-[6px_6px_0px_#000] p-5 rounded-3xl">
            <div className="flex items-center justify-between pb-2.5 border-b-2 border-black mb-3">
              <div className="flex items-center gap-2 text-[#FF5533]">
                <TrashIcon size={18} />
                <h3 className="font-black text-base uppercase text-black">Delete Poll?</h3>
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-7 h-7 rounded-lg border-1.5 border-black bg-gray-100 flex items-center justify-center cursor-pointer"
              >
                <CloseIcon size={14} />
              </button>
            </div>

            <p className="text-xs font-bold text-gray-700 mb-4">
              Are you sure you want to delete <strong className="text-black">&ldquo;{poll.title}&rdquo;</strong>? This will permanently erase all votes, options, and group chat messages.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="py-2.5 px-3 bg-gray-100 font-black text-xs uppercase border-2 border-black rounded-xl hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeletePoll}
                disabled={deleting}
                className="py-2.5 px-3 bg-[#FF5533] text-white font-black text-xs uppercase border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] hover:bg-black active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
