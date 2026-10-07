import { NextResponse } from 'next/server';
import { savePoll, getRecentPolls } from '../../../lib/db';
import { Poll, PollOption } from '../../../lib/types';

const POP_PALETTE = ['#CEFF00', '#FFE600', '#00E5FF', '#FF6EA7', '#FF5533', '#A78BFA'];

export async function GET() {
  try {
    const polls = await getRecentPolls();
    return NextResponse.json({ polls });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch polls' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      notes,
      category,
      options,
      allowCustomOptions = true,
      allowMultipleVotes = false,
      createdBy,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Poll statement/question is required' }, { status: 400 });
    }

    if (!options || !Array.isArray(options) || options.filter((o: string) => o.trim()).length < 2) {
      return NextResponse.json({ error: 'At least 2 options are required' }, { status: 400 });
    }

    const cleanOptions = options
      .map((opt: string) => opt.trim())
      .filter((opt: string) => opt.length > 0);

    const pollId = 'p-' + Math.random().toString(36).substring(2, 8);

    const pollOptions: PollOption[] = cleanOptions.map((text: string, idx: number) => ({
      id: `opt-${idx + 1}-${Math.random().toString(36).substring(2, 6)}`,
      text,
      color: POP_PALETTE[idx % POP_PALETTE.length],
      voters: [],
    }));

    const newPoll: Poll = {
      id: pollId,
      title: title.trim(),
      notes: notes?.trim() || undefined,
      category: category?.trim() || 'General',
      createdAt: Date.now(),
      createdBy: createdBy || {
        username: 'anonymous',
        name: 'Friend',
        avatarType: 'initials',
        avatarBgColor: '#CEFF00',
      },
      allowCustomOptions: !!allowCustomOptions,
      allowMultipleVotes: !!allowMultipleVotes,
      isClosed: false,
      options: pollOptions,
    };

    await savePoll(newPoll);

    return NextResponse.json({ poll: newPoll });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create poll' }, { status: 500 });
  }
}
