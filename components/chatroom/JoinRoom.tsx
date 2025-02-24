'use client'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { LuLoader } from 'react-icons/lu';

interface JoinRoomProps {
    chatRoomId: string;
    mutate: () => Promise<void>;
}

const JoinRoom = ({ chatRoomId, mutate }: JoinRoomProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const handleJoinRoom = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/chat-room/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chatRoomId }),
            });

            if (!response.ok) {
                throw new Error('Failed to join room');
            }

            toast.success('Joined room successfully');
            mutate();
        } catch (error) {
            console.error('Error joining room:', error);
            toast.error('Failed to join room');
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <button 
        onClick={handleJoinRoom}
        className={`chat-room-button bg-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer '}`}
        disabled={isLoading}
    >
        {isLoading ? <LuLoader className='animate-spin' size={20} /> : <HiOutlineChatAlt2 size={20} />}
        <span>Join</span>
    </button>
  )
}

export default JoinRoom