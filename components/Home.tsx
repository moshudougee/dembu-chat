'use client'
import React, { useContext, useState } from 'react'
import { TbCopyPlusFilled } from "react-icons/tb"
import CreateRoom from './chatroom/CreateRoom';
import { useRouter } from 'next/navigation';
import ChatRoomList from './chatroom/ChatRoomList';
import ChatSection from './chatroom/ChatSection';
import { MobileMenuContext } from '@/context/ContextProvider';



const Home = () => {
    const { showMobileMenu, handleMobileMenu } = useContext(MobileMenuContext)
    const [createChatRoom, setCreateChatRoom] = useState<boolean>(false);
    const [chatRoomId, setChatRoomId] = useState<string | null>(null);
    const router = useRouter();
    const year = new Date().getFullYear();

    const handleRefresh = () => {
        router.refresh();
    }


  return (
    <div className='home-container'>
      <div className='home-main'>
        <div className='home-chat-rooms'>
          <div className='home-create-room'>
            <span className='text-title'>Chat Rooms</span>
            <button 
              onClick={() => setCreateChatRoom(true)}
              className='home-create-button'
            >
              <TbCopyPlusFilled />
              <span className='text-button'>Create Room</span>
            </button>
          </div>
          <div className='home-chat-list'>
            <ChatRoomList setChatRoomId={setChatRoomId} />
          </div>
        </div>
        <div className='home-chat-section'>
          <ChatSection chatRoomId={chatRoomId} />
        </div>
      </div>
      <div className='home-chat-footer'>
        <span className='text-sm text-gray-500'>&copy; Copyright {year} </span>
        <span className='text-footer'>Dembu Chat</span>
      </div>
      {createChatRoom && 
        <div 
          className="details-card" 
          onClick={() => setCreateChatRoom(false)}
        >
          <div
            className="main" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="button" 
              onClick={() => setCreateChatRoom(false)}
            >
              ✕
            </button>
            <CreateRoom handleRefresh={handleRefresh} />
          </div>
        </div>
      }

      {showMobileMenu && (
          <div className='home-mobile-menu'>
            <div className='mobile-chat-rooms'>
              <div className='home-create-room'>
                <span className='text-title'>Chat Rooms</span>
                <button 
                  onClick={() => setCreateChatRoom(true)}
                  className='home-create-button'
                >
                <TbCopyPlusFilled />
                  <span className='text-button'>Create Room</span>
                </button>
              </div>
              <div className='home-chat-list'>
                <ChatRoomList setChatRoomId={setChatRoomId} handleMobileMenu={handleMobileMenu} />
              </div>
            </div>
          </div>
      )}
      
    </div>
  )
}

export default Home