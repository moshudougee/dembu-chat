import React from 'react'
import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
interface GoogleButtonProps {
    currentPage: string
}   

const GoogleButton = ({ currentPage }: GoogleButtonProps) => {
  return (
    <button onClick={() => signIn('google')} className='bg-red-900 text-slate-400 p-2 rounded-md cursor-pointer flex items-center gap-2'>
        <FcGoogle />
        <span>{`${currentPage === 'login' ? 'Login' : 'Sign up'} with Google`}</span>
    </button>
  )
}

export default GoogleButton