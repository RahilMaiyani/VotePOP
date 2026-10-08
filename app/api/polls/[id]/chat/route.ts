import { NextResponse } from 'next/server';
import { getPoll, addPollMessage } from '../../../../../lib/db';
import { ChatMessage } from '../../../../../lib/types';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const poll = await getPoll(id);

    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    return NextResponse.json({ messages: poll.messages || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { text, sender } = body;

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    if (!sender || !sender.name) {
      return NextResponse.json({ error: 'Sender information is required' }, { status: 400 });
    }

    const newMessage: ChatMessage = {
      id: 'msg-' + Math.random().toString(36).substring(2, 9),
      text: text.trim(),
      createdAt: Date.now(),
      sender: {
        username: sender.username || 'friend',
        name: sender.name.trim(),
        avatarType: sender.avatarType || 'initials',
        avatarBgColor: sender.avatarBgColor || '#CEFF00',
      },
    };

    const updatedPoll = await addPollMessage(id, newMessage);
    if (!updatedPoll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: newMessage, poll: updatedPoll });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to send message' }, { status: 500 });
  }
}