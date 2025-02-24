'use client'
import React from 'react'
import useRoomMessages from '@/hooks/useRoomMessages';
import { LuLoader } from 'react-icons/lu';
import useChatRoom from '@/hooks/useChatRoom';
import { GrChatOption } from "react-icons/gr";
import { FaUsersViewfinder } from "react-icons/fa6";
import { TiMessages } from "react-icons/ti";
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import ProfImg from '@/public/images/beatz.png';

interface ChatDisplayProps {
    chatRoomId: string | null;
}

const ChatDisplay = ({ chatRoomId }: ChatDisplayProps) => {
    const { messages, isLoading, error } = useRoomMessages(chatRoomId!);
    const { chatRoom, isLoading: chatRoomLoading, error: chatRoomError } = useChatRoom(chatRoomId!);
    const { data: session } = useSession();
    const user = session?.user;

    const formattedName = chatRoom?.name 
        ? (chatRoom.name.length > 40 ? chatRoom.name.slice(0, 40) + "..." : chatRoom.name)
        : "";
    const users = chatRoom?.userIDs?.length || 0;
    const messageCount = messages?.length || 0;

    //console.log(messages);

    if (isLoading || chatRoomLoading) {
        return (
            <div className='loader-error-container'>
                <LuLoader className='animate-spin' size={50} />
            </div>
        );
    }

    if (error || chatRoomError) {
        return (
            <div className='loader-error-container'>
                <h1 className='text-red-700'>Error: {error || chatRoomError}</h1>
            </div>
        );
    }
    if (!chatRoomId) {
        return (
            <div className='loader-error-container'>
                <span className='text-gradient'>No chat room selected</span>
            </div>
        );
    }

  return (
    <div className='chat-display'>
        <div className='chat-display-header'>
            <div className='header-left'>
                <GrChatOption size={30} />  
                <span className='text-title font-semibold'>{formattedName}</span>
            </div>
            <div className='header-right'>
                <div className='header-right-item'>
                    <FaUsersViewfinder size={20} />
                    <span className='text-sm'>{users}</span>
                </div>
                <div className='header-right-item'>
                    <TiMessages size={20} />
                    <span className='text-sm'>{messageCount}</span>
                </div>
            </div>
        </div>
        <div className='display-messages'>
            {messages.length > 0 ? messages.map((message) => (
                <div 
                    key={message.id}
                    className={`message-container 
                        ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                    <div className='message-content'>
                        <div className='message-sender'>
                            <div className='message-sender-image'>
                                <Image 
                                    src={message.sender?.image || ProfImg} 
                                    alt='user'
                                    className='rounded-full object-cover'
                                    fill 
                                    sizes='100'
                                />
                            </div>
                            <span className='text-sm font-bold'>{message.sender?.name}</span>
                        </div>
                        <span className='text-sm'>{message.content}</span>
                    </div>
                </div>
            )) : (
                <div className='loader-error-container'>
                    <span className='text-gradient'>No messages yet</span>
                </div>
            )}
        </div>
    </div>
  )
}

export default ChatDisplay