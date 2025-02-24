'use client'
import React from 'react'
import { SWRConfig } from 'swr'
import toast, { Toaster } from 'react-hot-toast'
import ThemeProvider from './ThemeProvider'

const ClientProviders = ({
    children,
}: {
    children: React.ReactNode;
}) => {
  return (
    <SWRConfig 
        value={{
            onError: (error) => {
            toast.error(error.message)
        },
        fetcher: async (resource, init) => {
          const res = await fetch(resource, init)
          if (!res.ok) {
            throw new Error('An error occurred while fetching the data.')
          }
          return res.json()
        },
      }}
    >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <Toaster toastOptions={{ className: 'toaster-container'}} />
            {children}
        </ThemeProvider>
    </SWRConfig>
  )
}

export default ClientProviders