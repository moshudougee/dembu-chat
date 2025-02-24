/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import pusherServer from "@/utils/pusher-server";


export const POST = auth(async (req: any) => {
    if (!req.auth) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }   

    try {
        const { user } = req.auth;
        const { chatRoomId } = await req.json();

        const chatRoom = await prisma.chatRoom.findUnique({
            where: { id: chatRoomId },
        });

        if (!chatRoom) {
            return Response.json({ error: "Chat room not found" }, { status: 404 });
        }
        
        const updatedChatRoom = await prisma.chatRoom.update({
            where: { id: chatRoomId },
            data: {
                users: {
                    disconnect: { id: user.id }
                }
            }
        });

        await pusherServer.trigger(`chat-room-${chatRoomId}`, "user-left", {
            userId: user.id,
            chatRoomId,
        });

        return Response.json(updatedChatRoom);
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}) as any;
