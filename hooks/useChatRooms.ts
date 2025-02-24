import pusherClient from "@/utils/pusher-client";
import { ChatRoom } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
const useChatRooms = () => {
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchChatRooms = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/chat-room');
            const data = await response.json();
            setChatRooms(data);
        } catch (error) {
            setError(error as string);
        } finally {
            setIsLoading(false);
        }
    }

    const mutate = useCallback( async () => {
        await fetchChatRooms();
    }, []);
    
    useEffect(() => {
        
        fetchChatRooms();

        // Subscribe to Pusher events
        const channel = pusherClient.subscribe("chat-rooms");
        channel.bind("room-created", (newRoom: ChatRoom) => {
        setChatRooms((prev) => [...prev, newRoom]);
        });

        // Handle user joined event
        channel.bind("user-joined", (data: { userId: string; chatRoomId: string }) => {
            setChatRooms((prev) => prev.map((room) => 
                room.id === data.chatRoomId ? { ...room, userIDs: [...room.userIDs, data.userId] } : room
            ));
        });

        // Handle user left event
        channel.bind("user-left", (data: { userId: string; chatRoomId: string }) => {
            setChatRooms((prev) => prev.map((room) => 
                room.id === data.chatRoomId ? { ...room, userIDs: room.userIDs.filter((id) => id !== data.userId) } : room
            ));
        });

        return () => {
            pusherClient.unsubscribe("chat-rooms");
        }
    },[])

    return { chatRooms, isLoading, error, mutate };
}

export default useChatRooms;
