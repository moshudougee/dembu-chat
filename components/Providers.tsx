import React from 'react'
import ClientProviders from './ClientProviders'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/lib/auth';
import ContextProvider from '@/context/ContextProvider';
const Providers = async ({
    children,
}: {
    children: React.ReactNode;
}) => {
  const session = await auth()
  
  return (
    <SessionProvider session={session}>
        <ClientProviders>
          <ContextProvider>
            {children}
          </ContextProvider>
        </ClientProviders>
    </SessionProvider>
  )
}

export default Providers