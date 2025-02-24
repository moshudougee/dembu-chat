import React from 'react'
import Home from '@/components/Home'
import { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
//import { Session } from 'next-auth'

export const metadata: Metadata = {
    title: "My Chat App",
    description: "Chat with your friends",
}

const HomePage = async () => {
  const session = await auth()
  if (!session) {
    redirect('/login')
  }
  //console.log('session', session)
  return (
    <Home />
  )
}

export default HomePage