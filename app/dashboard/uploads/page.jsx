"use client"

import React from 'react'
import UserFiles from '../_component/UserFiles'
import Header from '@/app/_components/Header'
import { useUser } from '@clerk/nextjs'
import Loading from './loading'

const page = () => {

  const {isLoaded} = useUser()
 if (!isLoaded) {
    // Show spinner while user data is loading
    return (
      <Loading />

    );
  }
  
  return (
    <div >
      <UserFiles/>
    </div>
  )
}

export default page
