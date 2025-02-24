'use client'
import React, { useContext } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { LuLogOut } from 'react-icons/lu'
import ProfImg from '@/public/images/beatz.png'
import Image from 'next/image'
import ThemeChanger from './ThemeChanger'
import { RxDropdownMenu } from 'react-icons/rx'
import { MobileMenuContext } from '@/context/ContextProvider'

const Header = () => {
    const { data: session } = useSession()
    const { handleMobileMenu } = useContext(MobileMenuContext)


    const handleSignOut = () => {
        signOut()
    }  

  return (
    <div className='header'>
        <div className='header-left'>
            {session?.user &&
                <div 
                    className='header-left-mobile'
                    onClick={handleMobileMenu}
            >
                    <RxDropdownMenu size={30} />
                </div>
            }
            <div className='header-left-item'>
                <span className='text-logo'>Dembu Chat</span>
            </div>
            {session?.user && 
                <div className='header-left-profile'>
                    <Image 
                        src={session.user.image || ProfImg} 
                        alt='profile' 
                        className='rounded-full object-cover'
                        fill
                        sizes='100' 
                    />
                </div>
            }
        </div>
        <div className='header-right'>
            <div className='flex cursor-pointer'>
                <ThemeChanger />
            </div>
            {session?.user && 
                <div className='flex cursor-pointer'>
                    <LuLogOut onClick={handleSignOut} />
                </div>
            }
        </div>
        
    </div>
  )
}

export default Header