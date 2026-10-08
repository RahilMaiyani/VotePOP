export type AvatarType =
  | 'initials'
  | 'cricket-bat'
  | 'cricket-ball'
  | 'football'
  | 'pickleball'
  | 'tennis'
  | 'fire'
  | 'bolt'
  | 'crown';

export interface UserProfile {
  username: string; // unique handle e.g. "rahil"
  name: string; // display name e.g. "Rahil Maiyani"
  avatarType: AvatarType;
  avatarBgColor: string; // hex pop color e.g. "#CEFF00"
  createdAt: number;
}

export interface VoterRecord {
  username: string;
  name: string;
  avatarType: AvatarType;
  avatarBgColor: string;
  votedAt: number;
  note?: string;
}

export interface PollOption {
  id: string;
  text: string;
  color: string; // Pop color hex code
  voters: VoterRecord[]; // List of friend records who voted for this
}

export interface ChatMessage {
  id: string;
  text: string;
  createdAt: number;
  sender: {
    username: string;
    name: string;
    avatarType: AvatarType;
    avatarBgColor: string;
  };
}

export interface Poll {
  id: string; // e.g. "poll-7x9q2"
  title: string; // Statement / question
  notes?: string; // Optional organizer description/rules
  category: string; // Custom freeform category e.g. "Cricket", "Pickleball", "Food"
  createdAt: number;
  createdBy: {
    username: string;
    name: string;
    avatarType: AvatarType;
    avatarBgColor: string;
  };
  allowCustomOptions: boolean;
  allowMultipleVotes: boolean;
  isClosed: boolean;
  decidedOptionId?: string; // If locked/finalized
  options: PollOption[];
  messages?: ChatMessage[]; // Squad discussion chat thread
}