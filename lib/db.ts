import { Redis } from '@upstash/redis';
import { Poll, UserProfile, ChatMessage } from './types';

// In-memory fallback cache
const memoryStore = {
  users: new Map<string, { user: UserProfile; passwordHash: string }>(),
  polls: new Map<string, Poll>(),
  pollList: [] as string[],
};

let redisClient: Redis | null = null;

function getRedis(): Redis | null {
  if (redisClient) return redisClient;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    try {
      redisClient = new Redis({ url, token });
      return redisClient;
    } catch (e) {
      console.warn('Failed to initialize Redis client, using in-memory store:', e);
    }
  }
  return null;
}

// ----------------- USER AUTH & PROFILE -----------------

export async function saveUser(user: UserProfile, passwordHash: string): Promise<void> {
  const redis = getRedis();
  const cleanUsername = user.username.toLowerCase().trim();
  const payload = { user: { ...user, username: cleanUsername }, passwordHash };

  memoryStore.users.set(cleanUsername, payload);

  if (redis) {
    try {
      await redis.set(`votepop:user:${cleanUsername}`, JSON.stringify(payload));
    } catch (e) {
      console.warn('Redis error in saveUser, cached in memory:', e);
    }
  }
}

export async function getUser(username: string): Promise<{ user: UserProfile; passwordHash: string } | null> {
  const cleanUsername = username.toLowerCase().trim();
  const redis = getRedis();

  if (redis) {
    try {
      const data = await redis.get<string | { user: UserProfile; passwordHash: string }>(`votepop:user:${cleanUsername}`);
      if (data) {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        memoryStore.users.set(cleanUsername, parsed);
        return parsed;
      }
    } catch (e) {
      console.warn('Redis error in getUser, reading memory:', e);
    }
  }

  return memoryStore.users.get(cleanUsername) || null;
}

// ----------------- POLLS -----------------

export async function savePoll(poll: Poll): Promise<void> {
  const redis = getRedis();
  memoryStore.polls.set(poll.id, poll);
  if (!memoryStore.pollList.includes(poll.id)) {
    memoryStore.pollList.unshift(poll.id);
  }

  if (redis) {
    try {
      await redis.set(`votepop:poll:${poll.id}`, JSON.stringify(poll));
      await redis.lpush('votepop:recent_polls', poll.id);
      await redis.ltrim('votepop:recent_polls', 0, 49);
    } catch (e) {
      console.warn('Redis error in savePoll, cached in memory:', e);
    }
  }
}

export async function getPoll(id: string): Promise<Poll | null> {
  const redis = getRedis();

  if (redis) {
    try {
      const data = await redis.get<string | Poll>(`votepop:poll:${id}`);
      if (data) {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        memoryStore.polls.set(id, parsed);
        return parsed;
      }
    } catch (e) {
      console.warn('Redis error in getPoll, checking memory:', e);
    }
  }

  return memoryStore.polls.get(id) || null;
}

export async function deletePoll(id: string): Promise<boolean> {
  const redis = getRedis();
  memoryStore.polls.delete(id);
  memoryStore.pollList = memoryStore.pollList.filter((pId) => pId !== id);

  if (redis) {
    try {
      await redis.del(`votepop:poll:${id}`);
      await redis.lrem('votepop:recent_polls', 0, id);
    } catch (e) {
      console.warn('Redis error in deletePoll:', e);
    }
  }

  return true;
}

export async function addPollMessage(pollId: string, message: ChatMessage): Promise<Poll | null> {
  const poll = await getPoll(pollId);
  if (!poll) return null;

  if (!poll.messages) {
    poll.messages = [];
  }

  poll.messages.push(message);
  // Keep last 60 messages for speed & cleanliness
  if (poll.messages.length > 60) {
    poll.messages = poll.messages.slice(-60);
  }

  await savePoll(poll);
  return poll;
}

export async function getRecentPolls(): Promise<Poll[]> {
  const redis = getRedis();

  if (redis) {
    try {
      const ids = await redis.lrange('votepop:recent_polls', 0, 29);
      if (ids && ids.length > 0) {
        const uniqueIds = Array.from(new Set(ids));
        const polls: Poll[] = [];
        for (const id of uniqueIds) {
          const poll = await getPoll(id);
          if (poll) polls.push(poll);
        }
        return polls;
      }
    } catch (e) {
      console.warn('Redis error in getRecentPolls, reading memory:', e);
    }
  }

  return Array.from(memoryStore.polls.values()).sort((a, b) => b.createdAt - a.createdAt);
}