import React from 'react';
import { AvatarType } from '../lib/types';
import {
  CricketBatIcon,
  CricketBallIcon,
  FootballIcon,
  PickleballIcon,
  TennisBallIcon,
  FireIcon,
  BoltIcon,
  CrownIcon,
} from './Icons';

interface AvatarProps {
  name: string;
  avatarType?: AvatarType;
  avatarBgColor?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AVATAR_OPTIONS: Array<{ type: AvatarType; label: string }> = [
  { type: 'initials', label: 'My Initials' },
  { type: 'pickleball', label: 'Pickleball' },
  { type: 'cricket-bat', label: 'Cricket Bat' },
  { type: 'cricket-ball', label: 'Cricket Ball' },
  { type: 'football', label: 'Football' },
  { type: 'tennis', label: 'Tennis' },
  { type: 'fire', label: 'Fire' },
  { type: 'bolt', label: 'Lightning' },
  { type: 'crown', label: 'Crown' },
];

export const POP_COLORS = [
  '#CEFF00', // Electric Lime
  '#FFE600', // Canary Yellow
  '#FF5533', // Hot Coral
  '#00E5FF', // Cyber Cyan
  '#FF6EA7', // Bubblegum Pink
  '#A78BFA', // Vivid Lavender
];

export const Avatar: React.FC<AvatarProps> = ({
  name,
  avatarType = 'initials',
  avatarBgColor = '#CEFF00',
  size = 'md',
  className = '',
}) => {
  const getInitials = (str: string) => {
    if (!str) return '??';
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px] border-[1.5px]',
    sm: 'w-8 h-8 text-xs border-2',
    md: 'w-10 h-10 text-sm border-2',
    lg: 'w-14 h-14 text-lg border-[2.5px]',
    xl: 'w-18 h-18 text-2xl border-[3px]',
  };

  const iconSizes = {
    xs: 14,
    sm: 18,
    md: 22,
    lg: 30,
    xl: 38,
  };

  const iconSize = iconSizes[size];

  const renderContent = () => {
    switch (avatarType) {
      case 'cricket-bat':
        return <CricketBatIcon size={iconSize} />;
      case 'cricket-ball':
        return <CricketBallIcon size={iconSize} />;
      case 'football':
        return <FootballIcon size={iconSize} />;
      case 'pickleball':
        return <PickleballIcon size={iconSize} />;
      case 'tennis':
        return <TennisBallIcon size={iconSize} />;
      case 'fire':
        return <FireIcon size={iconSize} />;
      case 'bolt':
        return <BoltIcon size={iconSize} />;
      case 'crown':
        return <CrownIcon size={iconSize} />;
      case 'initials':
      default:
        return (
          <span className="font-black tracking-tight text-black select-none">
            {getInitials(name)}
          </span>
        );
    }
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center border-black shadow-[1.5px_1.5px_0px_#000] shrink-0 font-bold ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: avatarBgColor }}
      title={name}
    >
      {renderContent()}
    </div>
  );
};
