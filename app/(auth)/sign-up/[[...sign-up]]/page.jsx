import { SignUp } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div className="flex justify-center items-center w-full" style={{ height: `calc(100vh - 64px)` }}>
    <SignUp/>
    </div>
  )
}

export default page
