import { NextResponse } from 'next/server';
import { getPoll, savePoll } from '../../../../../lib/db';
import { VoterRecord } from '../../../../../lib/types';

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
      return NextResponse.json({ error: 'This poll has been finalized and closed' }, { status: 400 });
    }

    const body = await req.json();
    const { optionId, voter, note } = body as { optionId: string; voter: VoterRecord; note?: string };

    if (!optionId || !voter || !voter.name) {
      return NextResponse.json({ error: 'Option and voter information required' }, { status: 400 });
    }

    const voterCleanUsername = (voter.username || voter.name).toLowerCase().trim();

    const voterRecord: VoterRecord = {
      username: voterCleanUsername,
      name: voter.name.trim(),
      avatarType: voter.avatarType || 'initials',
      avatarBgColor: voter.avatarBgColor || '#CEFF00',
      votedAt: Date.now(),
      note: note?.trim() || undefined,
    };

    // If single-vote mode (not allowMultipleVotes), remove previous vote by this voter
    if (!poll.allowMultipleVotes) {
      for (const opt of poll.options) {
        opt.voters = opt.voters.filter(
          (v) => (v.username || v.name).toLowerCase().trim() !== voterCleanUsername
        );
      }
    }

    // Add to target option
    const targetOpt = poll.options.find((o) => o.id === optionId);
    if (!targetOpt) {
      return NextResponse.json({ error: 'Option not found' }, { status: 404 });
    }

    // Ensure not duplicate in the same option
    const existingIndex = targetOpt.voters.findIndex(
      (v) => (v.username || v.name).toLowerCase().trim() === voterCleanUsername
    );

    if (existingIndex >= 0) {
      targetOpt.voters[existingIndex] = voterRecord; // update
    } else {
      targetOpt.voters.push(voterRecord);
    }

    await savePoll(poll);

    return NextResponse.json({ poll });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to submit vote' }, { status: 500 });
  }
}
