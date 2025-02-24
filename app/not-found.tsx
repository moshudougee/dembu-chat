import Link from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
    <div className='flex flex-col gap-3 justify-center items-center w-screen h-screen'>
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link href="/">
            Go to Homepage
        </Link>
  
    </div>
  )
}

export default NotFound