"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function FancyDropzone({ onFileAdded, onUpload }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [abortController, setAbortController] = useState(null);
  const toast = useToast();
  const router = useRouter();

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const newFile = acceptedFiles[0];

        if (newFile.size > MAX_FILE_SIZE) {
          return toast.toast({
            variant: "destructive",
            title: "File should be less than 5 mb",
            color: "red",
          });
        }

        setFile(newFile);
        onFileAdded(newFile);
        setIsUploaded(false);
      }
    },
    [onFileAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
  });

  const removeFile = () => {
    if (isUploading) return; // Prevent file removal during upload
    setFile(null);
    onFileAdded(null);
    setIsUploaded(false);
  };

  const handleUpload = async () => {
    if (file) {
      setIsUploading(true);
      try {
        await onUpload(file, setIsUploading, toast, router);
        setIsUploaded(true);
      } catch (error) {
        setIsUploaded(false);
      } finally {
        setIsUploading(false);
        setAbortController(null);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-gray-300 hover:border-primary"
        } ${
            isUploading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
      >
        <input
          {...getInputProps()}
          accept=".csv"
          disabled={!isUploading}
          className={`${
            isUploading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
        />
        {file ? (
          <div className="flex items-center justify-center">
            <File className="h-8 w-8 text-primary mr-2" />
            <span className="text-sm text-gray-700 truncate">{file.name}</span>
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag 'n' drop a file here, or click to select a file
            </p>
          </>
        )}
      </div>
      {file && (
        <div className="mt-4">
          <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
            <div className="flex items-center">
              <File className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-sm text-gray-700 truncate">
                {file.name}
              </span>
            </div>
            <button
              onClick={removeFile}
              disabled={isUploading}
              className={`text-red-500 hover:text-red-700 ${
                isUploading ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-2 flex gap-4">
            <button
              onClick={handleUpload}
              disabled={isUploading || isUploaded}
              className={`w-full py-2 px-4 rounded-2xl text-white font-medium ${
                isUploaded
                  ? "bg-green-500 cursor-not-allowed"
                  : isUploading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isUploaded ? (
                <span className="flex items-center justify-center">
                  <Check className="h-5 w-5 mr-2" />
                  Uploaded
                </span>
              ) : isUploading ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                "Upload"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
