'use client'
import React, { createContext, useState } from 'react'

interface MobileMenuContextType {
    showMobileMenu: boolean
    handleMobileMenu: () => void
}

export const MobileMenuContext = createContext<MobileMenuContextType>({
    showMobileMenu: false,
    handleMobileMenu: () => {}
})

const ContextProvider = ({children}: {children: React.ReactNode}) => { 
    const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false)

    const handleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu)
    }

  return (
    <MobileMenuContext.Provider value={{showMobileMenu, handleMobileMenu}}>
        {children}
    </MobileMenuContext.Provider>
  )
}

export default ContextProvider