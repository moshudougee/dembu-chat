// app/components/ChatRoom.tsx
import { useEffect, useState } from "react";
import pusherClient from "@/utils/pusher-client";
import { Message } from "@prisma/client";

interface ChatRoomProps {
  roomId: string;
}

const ChatRoom = ({ roomId }: ChatRoomProps) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const channel = pusherClient.subscribe(`chat-room-${roomId}`);
    channel.bind("message-sent", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      pusherClient.unsubscribe(`chat-room-${roomId}`);
    };
  }, [roomId]);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <div className="space-y-2">
        {messages.map((message) => (
          <div key={message.id} className="p-2 bg-white rounded shadow">
            <p>{message.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatRoom;