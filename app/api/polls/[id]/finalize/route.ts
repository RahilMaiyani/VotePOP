import { NextResponse } from 'next/server';
import { getPoll, savePoll } from '@/lib/db';

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

    const body = await req.json();
    const { decidedOptionId, action = 'lock', username, name } = body;

    // Verify creator authorization
    const cleanRequesterUser = (username || '').toLowerCase().trim();
    const cleanRequesterName = (name || '').toLowerCase().trim();
    const cleanCreatorUser = (poll.createdBy.username || '').toLowerCase().trim();
    const cleanCreatorName = (poll.createdBy.name || '').toLowerCase().trim();

    const isAuthorized =
      Boolean(cleanRequesterUser && cleanRequesterUser === cleanCreatorUser) ||
      Boolean(cleanRequesterName && cleanRequesterName === cleanCreatorName) ||
      Boolean(cleanRequesterUser && cleanRequesterUser === cleanCreatorName) ||
      Boolean(cleanRequesterName && cleanRequesterName === cleanCreatorUser);

    if (!isAuthorized) {
      return NextResponse.json(
        { error: `Only the poll creator (@${poll.createdBy.username || poll.createdBy.name}) can lock or finalize this decision.` },
        { status: 403 }
      );
    }

    if (action === 'unlock') {
      poll.isClosed = false;
      poll.decidedOptionId = undefined;
    } else {
      poll.isClosed = true;
      if (decidedOptionId) {
        poll.decidedOptionId = decidedOptionId;
      } else {
        // Find option with most votes as winner
        const sorted = [...poll.options].sort((a, b) => b.voters.length - a.voters.length);
        if (sorted.length > 0 && sorted[0].voters.length > 0) {
          poll.decidedOptionId = sorted[0].id;
        }
      }
    }

    await savePoll(poll);

    return NextResponse.json({ poll });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to finalize poll' }, { status: 500 });
  }
}
