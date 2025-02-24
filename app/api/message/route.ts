/* eslint-disable @typescript-eslint/no-explicit-any */
import  pusherServer  from "@/utils/pusher-server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const POST = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { user } = req.auth;
    const { content, chatRoomId } = await req.json();

    const message = await prisma.message.create({
        data: {
        content,
        sender: { connect: { id: user.id } },
        chatRoom: { connect: { id: chatRoomId } },
        },
    });

    const fullMessage = await prisma.message.findUnique({
        where: { id: message.id },
        include: {
            sender: true,
        },
    });

    await pusherServer.trigger(`chat-room-${chatRoomId}`, "message-sent", fullMessage);

    return Response.json(message);
  } catch (error: any) {
    console.log(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}) as any;
