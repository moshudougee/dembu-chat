/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export const GET = auth(async (req: any) => {
    if (!req.auth) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const searchParams = req.nextUrl.searchParams;
        const chatRoomId = searchParams.get("chatRoomId");

        if (!chatRoomId) {
            return Response.json({ error: "Chat room ID is required" }, { status: 400 });
        }

        const chatRoom = await prisma.chatRoom.findUnique({
            where: {
                id: chatRoomId,
            },
            include: {
                users: true,
                messages: true,
            },
        });
        
        return Response.json(chatRoom);
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
    
}) as any;

