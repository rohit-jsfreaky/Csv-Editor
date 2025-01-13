'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import BlurText from './BlurText';
import { FancyDropzone } from './FancyDropzone';
import { handleUpload } from '@/utils';

const Hero = ({ isSignedIn, handleSign }) => {
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileAdded = (file) => setUploadedFile(file);
  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5 pt-16 md:pt-20 lg:pt-32 px-4 lg:px-8 xl:px-16">
      {/* Title Section */}
      <div className="text-center">
        <BlurText
          text="Edit CSV With Ease!"
          delay={150}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl text-sky-950 mb-6 md:mb-8"
        
        />
      </div>

      {/* Upload Section */}
      {isSignedIn && (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 text-center">
            Upload Your CSV
          </h1>
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
            <FancyDropzone onFileAdded={handleFileAdded} onUpload={handleUpload} />
          </div>
        </div>
      )}

      {/* Button Section */}
      <div className="flex flex-col md:flex-row gap-4 mt-4 sm:mt-6">
        {!isSignedIn && (
          <Button
            onClick={handleSign}
            variant="outline"
            className="text-sky-500 rounded-2xl px-6 py-3 text-base sm:text-lg lg:text-xl"
          >
            Login/Register <LogIn className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Hero;
