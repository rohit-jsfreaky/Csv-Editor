"use client"

import React from 'react'
import { useUser } from '@clerk/nextjs'

import Loading from './loading'

import { useRouter } from "next/navigation";
import Hero from './_components/Hero'

const page = () => {

  const { isSignedIn, isLoaded } = useUser()

  const router = useRouter();
  const handleStarted = () => {
    if (isSignedIn) {
      router.push("/dashboard");
    } else {
      router.push("/sign-in");
    }
  };

  const handleSign = () => {
    console.log(isSignedIn);
    if (!isSignedIn) {
      router.push("/sign-in");
    }
  };

  if (!isLoaded) {

    return (
      <Loading />

    );
  }
  return (
    <div>
      <Hero handleSign={handleSign} handleStarted={handleStarted} isSignedIn={isSignedIn} />
    </div>
  )
}

export default page
