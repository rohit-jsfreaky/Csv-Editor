"use client"
import React, { useState } from 'react'
import { FancyDropzone } from '../_components/FancyDropzone'
import { useUser } from '@clerk/nextjs'
import Loading from '../loading'
import { handleUpload } from '@/utils';

const page = () => {

  const [uploadedFile, setUploadedFile] = useState(null);
  const {isLoaded} = useUser();

  const handleFileAdded = (file) => setUploadedFile(file);

  if(!isLoaded){
    return <Loading/>
  }

  return (
    <div className="flex justify-center items-center w-full" style={{ height: `calc(100vh - 64px)` }}>
      
     <FancyDropzone onFileAdded={handleFileAdded} onUpload={handleUpload} />
    </div>
  )
}

export default page
