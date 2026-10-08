import { NextResponse } from 'next/server';
import { getPoll, deletePoll } from '../../../../lib/db';

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

    return NextResponse.json({ poll });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch poll' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const poll = await getPoll(id);

    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    // Parse body or query params for authorization
    let username = '';
    let name = '';
    try {
      const body = await req.json();
      username = body.username || '';
      name = body.name || '';
    } catch {
      const url = new URL(req.url);
      username = url.searchParams.get('username') || '';
      name = url.searchParams.get('name') || '';
    }

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
        { error: `Only the creator (@${poll.createdBy.username || poll.createdBy.name}) can delete this poll.` },
        { status: 403 }
      );
    }

    await deletePoll(id);
    return NextResponse.json({ success: true, message: 'Poll removed successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete poll' }, { status: 500 });
  }
}
