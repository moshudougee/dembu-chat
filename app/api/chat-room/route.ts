/* eslint-disable @typescript-eslint/no-explicit-any */
import  pusherServer  from "@/utils/pusher-server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const GET = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const chatRooms = await prisma.chatRoom.findMany({
      include: {
        users: true,
      },
    })

    return Response.json(chatRooms);
  } catch (error: any) {
    console.log(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}) as any;

export const POST = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, description } = await req.json();
    const { user } = req.auth;

    const chatRoom = await prisma.chatRoom.create({
        data: {
          name,
          description,
          createdBy: {
              connect: {id: user.id}
          },
          users: {
              connect: {id: user.id},
          },
        },
    });

    await pusherServer.trigger('chat-rooms', "room-created", chatRoom);

    return Response.json(chatRoom);
  } catch (error: any) {
    console.log(error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}) as any;
