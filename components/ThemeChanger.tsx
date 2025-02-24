'use client'
import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { LuSun, LuMoon } from 'react-icons/lu'

const ThemeChanger = () => {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const toggleTheme = () => { 
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    //console.log(mounted)

  return (
    <div className='flex' onClick={toggleTheme}>
        <button className='bg-transparent hover:bg-transparent'>
            {mounted && (
                <div className='flex items-center justify-center text-foreground'>
                    {theme === 'dark' ? <LuSun className='cursor-pointer' size={20} /> : <LuMoon className='cursor-pointer' size={20} />}
                </div>
            )}
        </button>
    </div>
  )
}

export default ThemeChanger