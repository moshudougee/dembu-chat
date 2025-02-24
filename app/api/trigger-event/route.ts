/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/trigger-event/route.ts
import pusherServer from '@/utils/pusher-server';

export async function POST(request: Request) {
  const { message, channel, event, sender } = await request.json();

  try {
    await pusherServer.trigger(channel, event, { message, sender });
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message });
  }
}