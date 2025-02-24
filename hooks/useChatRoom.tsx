import { useEffect, useState } from "react";

const useChatRoom = (chatRoomId: string) => {
    const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChatRoom = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/chat-room/get?chatRoomId=${chatRoomId}`);
                const data = await response.json();
                setChatRoom(data);
            } catch (error) {
                setError(error as string);
            } finally {
                setIsLoading(false);
            }
        };
        fetchChatRoom();
    }, [chatRoomId]);

    return { chatRoom, isLoading, error };
};

export default useChatRoom;
