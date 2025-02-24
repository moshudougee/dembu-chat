// app/components/ChatInput.tsx
import { useState } from "react";

interface ChatInputProps {
  roomId: string;
}

const ChatInput = ({ roomId }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    await fetch("/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message, chatRoomId: roomId }),
    });
    setMessage("");
  };

  return (
    <div className="flex space-x-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 p-2 border rounded"
      />
      <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded">
        Send
      </button>
    </div>
  );
}

export default ChatInput;