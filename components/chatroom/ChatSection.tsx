'use client'
import React from 'react'
import ChatDisplay from './ChatDisplay'
import ChatInput from './ChatInput'

interface ChatSectionProps {
    chatRoomId: string | null;
 }

const ChatSection = ({ chatRoomId }: ChatSectionProps) => {
  return (
    <div className='chat-section'>
        <div className='chat-section-display'>
            <ChatDisplay chatRoomId={chatRoomId} />
        </div>
        <ChatInput chatRoomId={chatRoomId} />
    </div>
  )
}

export default ChatSection