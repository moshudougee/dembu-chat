'use client'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { LuLoader } from 'react-icons/lu';

interface LeaveRoomProps {
    chatRoomId: string;
    mutate: () => Promise<void>;
}

const LeaveRoom = ({ chatRoomId, mutate }: LeaveRoomProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const handleLeaveRoom = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/chat-room/leave`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chatRoomId }),
            });

            if (!response.ok) {
                throw new Error('Failed to leave room');
            }

            toast.success('Left room successfully');
            mutate();
        } catch (error) {
            console.error('Error leaving room:', error);
            toast.error('Failed to leave room');
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <button 
        onClick={handleLeaveRoom}
        className={`chat-room-button bg-yellow-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer '}`}
        disabled={isLoading}
    >
        {isLoading ? <LuLoader className='animate-spin' size={20} /> : <HiOutlineChatAlt2 size={20} />}
        <span>Leave</span>
    </button>
  )
}

export default LeaveRoom