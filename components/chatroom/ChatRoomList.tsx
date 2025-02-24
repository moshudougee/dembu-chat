'use client'
import React, { useState } from 'react'
import useChatRooms from '@/hooks/useChatRooms'
import { LuLoader } from 'react-icons/lu';
import { useSession } from 'next-auth/react';
import { HiOutlineChatAlt2 } from "react-icons/hi";
import JoinRoom from './JoinRoom';
import LeaveRoom from './LeaveRoom';

interface ChatRoomListProps {
  setChatRoomId: (id: string) => void;
  handleMobileMenu?: () => void;
}

type Action = 'Join' | 'Leave' | 'Delete';

const ChatRoomList = ({ setChatRoomId, handleMobileMenu }: ChatRoomListProps) => {
  const { chatRooms, isLoading, error, mutate } = useChatRooms();
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const { data: session } = useSession();

  const userId = session?.user?.id || null;

  const handleActiveRoom = (roomId: string) => {
    setChatRoomId(roomId);
    setActiveRoom(roomId);
    handleMobileMenu?.();
  }

  //console.log(activeRoom);

  if (isLoading) {
    return (
        <div className='loader-error-container'>
            <LuLoader className='animate-spin' size={80} />
        </div>
    )
  }
  if (error) {
    return (
        <div className='loader-error-container'>
            <h1 className='text-red-700'>Error: {error}</h1>
        </div>
    )
  }
  return (
    <div className='chat-room-list'>
        {chatRooms && chatRooms.length > 0 ? (
            chatRooms.map((chatRoom) => {
                const isUserInRoom = chatRoom.userIDs.includes(userId!);
                const action: Action = chatRoom.createdById === userId ? 'Delete' : isUserInRoom ? 'Leave' : 'Join';
                const formattedName = chatRoom.name.length > 15 ? chatRoom.name.slice(0, 15) + '...' : chatRoom.name;
                return (
                    <div key={chatRoom.id}
                        className={`chat-room ${activeRoom === chatRoom.id ? 'active-room' : 'inactive-room'}`}
                    >
                        <div 
                            onClick={() => handleActiveRoom(chatRoom.id)}
                            className='flex items-center justify-center cursor-pointer'
                        >
                            <span className='chat-room-name'>{formattedName}</span>
                        </div>
                        <div className='flex gap-2'>
                            {action === 'Join' ? (
                                <JoinRoom chatRoomId={chatRoom.id} mutate={mutate} />
                            ) : action === 'Leave' ? (
                                <LeaveRoom chatRoomId={chatRoom.id} mutate={mutate} />
                            ) : (
                                <button
                                    className='chat-room-button bg-red-500'
                                    disabled={action === 'Delete'}
                                >
                                    <HiOutlineChatAlt2 size={20} />
                                    <span>Delete</span>
                                </button>
                            )}
                            
                        </div>
                    </div>
                )
            })
        ) : (
            <div className='loader-error-container'>
                <span className='text-gray-500'>No chat rooms found</span>
            </div>
        )}
    </div>
  )
}

export default ChatRoomList