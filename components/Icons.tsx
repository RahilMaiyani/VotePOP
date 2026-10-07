import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
}

// ----------------- AVATAR SPECIFIC VECTORS -----------------

export const CricketBatIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Handle */}
    <path d="M4 20L7.5 16.5" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M3.5 20.5L4.5 19.5" stroke="#000" strokeWidth="2" strokeLinecap="round" />
    {/* Blade */}
    <path
      d="M7.5 16.5L18.5 5.5C19.3 4.7 20.5 4.7 21.3 5.5C22.1 6.3 22.1 7.5 21.3 8.3L10.3 19.3C9.7 19.9 8.7 19.9 8.1 19.3L6.7 17.9C6.1 17.3 6.1 16.3 6.7 15.7L7.5 16.5Z"
      fill="#FFE600"
      stroke="#000"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M12 11L14 13" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const CricketBallIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" fill="#FF5533" stroke="#000" strokeWidth="2.5" />
    {/* Cricket Seam */}
    <path d="M12 3C8 7 8 17 12 21" stroke="#FFF" strokeWidth="2" strokeDasharray="2 2" strokeLinecap="round" />
    <path d="M12 3C16 7 16 17 12 21" stroke="#FFF" strokeWidth="2" strokeDasharray="2 2" strokeLinecap="round" />
  </svg>
);

export const FootballIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" fill="#FFFFFF" stroke="#000" strokeWidth="2.5" />
    <polygon points="12,8 15,10 14,14 10,14 9,10" fill="#000000" stroke="#000" strokeWidth="1" />
    <path d="M12 8V3.5" stroke="#000" strokeWidth="2" strokeLinecap="round" />
    <path d="M15 10L19.5 8" stroke="#000" strokeWidth="2" strokeLinecap="round" />
    <path d="M14 14L18 18" stroke="#000" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 14L6 18" stroke="#000" strokeWidth="2" strokeLinecap="round" />
    <path d="M9 10L4.5 8" stroke="#000" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const PickleballIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    {/* Paddle */}
    <rect
      x="5"
      y="3"
      width="11"
      height="12"
      rx="3.5"
      fill="#CEFF00"
      stroke="#000"
      strokeWidth="2.2"
    />
    <path d="M10.5 15V21" stroke="#000" strokeWidth="3.2" strokeLinecap="round" />
    {/* Ball */}
    <circle cx="18" cy="17" r="4" fill="#00E5FF" stroke="#000" strokeWidth="2" />
    <circle cx="16.8" cy="16" r="0.6" fill="#000" />
    <circle cx="19.2" cy="16" r="0.6" fill="#000" />
    <circle cx="18" cy="18" r="0.6" fill="#000" />
  </svg>
);

export const TennisBallIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" fill="#CEFF00" stroke="#000" strokeWidth="2.5" />
    <path d="M5.5 5.5C8.5 8.5 8.5 15.5 5.5 18.5" stroke="#000" strokeWidth="2" strokeLinecap="round" />
    <path d="M18.5 5.5C15.5 8.5 15.5 15.5 18.5 18.5" stroke="#000" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const FireIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 2C12 2 15 6 15 9C15 7.5 16 6.5 17 6C18 9 20 11.5 20 15C20 19.4 16.4 22 12 22C7.6 22 4 19.4 4 15C4 11 7 7 12 2Z"
      fill="#FF5533"
      stroke="#000"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <path
      d="M12 13C12 13 14 15 14 16.5C14 17.9 13.1 19 12 19C10.9 19 10 17.9 10 16.5C10 15 12 13 12 13Z"
      fill="#FFE600"
      stroke="#000"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

export const BoltIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <polygon
      points="13,2 4,14 11,14 10,22 20,9 13,9"
      fill="#FFE600"
      stroke="#000"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
  </svg>
);

export const CrownIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M3 18L5 7L9.5 12L12 5L14.5 12L19 7L21 18H3Z"
      fill="#FFE600"
      stroke="#000"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <line x1="3" y1="20" x2="21" y2="20" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// ----------------- UI / UTILITY ICONS -----------------

export const PlusIcon: React.FC<IconProps> = ({ className = '', size = 20, strokeWidth = 2.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className = '', size = 18, strokeWidth = 2.2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V6M8 6V4C8 2.9 8.9 2 10 2H14C15.1 2 16 2.9 16 4V6" />
  </svg>
);

export const ShareIcon: React.FC<IconProps> = ({ className = '', size = 20, strokeWidth = 2.2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

export const CopyIcon: React.FC<IconProps> = ({ className = '', size = 18, strokeWidth = 2.2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4C2.9 15 2 14.1 2 13V4C2 2.9 2.9 2 4 2H13C14.1 2 15 2.9 15 4V5" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ className = '', size = 20, strokeWidth = 3 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const LockIcon: React.FC<IconProps> = ({ className = '', size = 18, strokeWidth = 2.2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7C7 4.24 9.24 2 12 2C14.76 2 17 4.24 17 7V11" />
  </svg>
);

export const TrophyIcon: React.FC<IconProps> = ({ className = '', size = 22, strokeWidth = 2.2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 9H4.5C3.12 9 2 7.88 2 6.5C2 5.12 3.12 4 4.5 4H6" />
    <path d="M18 9H19.5C20.88 9 22 7.88 22 6.5C22 5.12 20.88 4 19.5 4H18" />
    <path d="M6 4H18V10C18 13.31 15.31 16 12 16C8.69 16 6 13.31 6 10V4Z" />
    <line x1="12" y1="16" x2="12" y2="20" />
    <line x1="8" y1="20" x2="16" y2="20" />
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className = '', size = 20, strokeWidth = 2.2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 21V19C20 16.79 18.21 15 16 15H8C5.79 15 4 16.79 4 19V21" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const ArrowLeftIcon: React.FC<IconProps> = ({ className = '', size = 20, strokeWidth = 2.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({ className = '', size = 20, strokeWidth = 2.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export const QrCodeIcon: React.FC<IconProps> = ({ className = '', size = 20, strokeWidth = 2.2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="3" height="3" />
    <rect x="18" y="18" width="3" height="3" />
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className = '', size = 20, strokeWidth = 2.2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3L14.5 8.5L20 11L14.5 13.5L12 19L9.5 13.5L4 11L9.5 8.5L12 3Z" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ className = '', size = 20, strokeWidth = 2.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const VoteIcon: React.FC<IconProps> = ({ className = '', size = 20, strokeWidth = 2.2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 20V10" />
    <path d="M12 20V4" />
    <path d="M6 20V14" />
  </svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({ className = '', size = 20, strokeWidth = 2.2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22S20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);
