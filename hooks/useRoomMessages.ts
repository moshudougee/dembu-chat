import pusherClient from "@/utils/pusher-client";
import { useEffect, useState } from "react";

const useRoomMessages = (chatRoomId: string) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/chat-room/messages?chatRoomId=${chatRoomId}`);
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                setError(error as string);
            } finally {
                setIsLoading(false);
            }
        }
        fetchMessages();
        // Subscribe to Pusher events
        const channel = pusherClient.subscribe(`chat-room-${chatRoomId}`);
        // Handle new messages
        channel.bind("message-sent", (data: Message) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });
        // Clean up subscription on unmount
        return () => {
            pusherClient.unsubscribe(`chat-room-${chatRoomId}`);
        }
    }, [chatRoomId]);

    return { messages, isLoading, error };

}

export default useRoomMessages;
