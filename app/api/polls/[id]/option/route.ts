import { NextResponse } from 'next/server';
import { getPoll, savePoll } from '@/lib/db';
import { PollOption, VoterRecord } from '@/lib/types';

const POP_PALETTE = ['#00E5FF', '#FF6EA7', '#FFE600', '#CEFF00', '#FF5533', '#A78BFA'];

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const poll = await getPoll(id);

    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    if (poll.isClosed) {
      return NextResponse.json({ error: 'Poll is closed' }, { status: 400 });
    }

    if (!poll.allowCustomOptions) {
      return NextResponse.json({ error: 'Adding custom options is disabled for this poll' }, { status: 403 });
    }

    const body = await req.json();
    const { text, voter } = body;

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Option text cannot be empty' }, { status: 400 });
    }

    const cleanText = text.trim();
    // Check if option text already exists
    const exists = poll.options.some((o) => o.text.toLowerCase() === cleanText.toLowerCase());
    if (exists) {
      return NextResponse.json({ error: 'An option with this name already exists' }, { status: 400 });
    }

    const newOptionId = `opt-custom-${Math.random().toString(36).substring(2, 8)}`;
    const newColor = POP_PALETTE[poll.options.length % POP_PALETTE.length];

    const votersList: VoterRecord[] = [];

    // If voter is provided, auto-vote for this new option
    if (voter && voter.name) {
      const cleanUsername = (voter.username || voter.name).toLowerCase().trim();
      const voterRecord: VoterRecord = {
        username: cleanUsername,
        name: voter.name.trim(),
        avatarType: voter.avatarType || 'initials',
        avatarBgColor: voter.avatarBgColor || '#CEFF00',
        votedAt: Date.now(),
      };

      // Remove previous vote if single vote
      if (!poll.allowMultipleVotes) {
        for (const opt of poll.options) {
          opt.voters = opt.voters.filter(
            (v) => (v.username || v.name).toLowerCase().trim() !== cleanUsername
          );
        }
      }

      votersList.push(voterRecord);
    }

    const newOption: PollOption = {
      id: newOptionId,
      text: cleanText,
      color: newColor,
      voters: votersList,
    };

    poll.options.push(newOption);
    await savePoll(poll);

    return NextResponse.json({ poll });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to add option' }, { status: 500 });
  }
}
