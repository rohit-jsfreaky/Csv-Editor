"use client"

import { getAuth } from '@clerk/nextjs/server';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const uploadFile = async () => {
        if (!file) return setMessage('Please select a file');

        setIsUploading(true);
        setMessage('');

        try {
            // Request a signed URL

            const { data } = await axios.post('/api/upload', {
                fileName: file.name,
                fileType: file.type,
            });




            await axios.put(data.signedUrl, file, {
                headers: {
                    'Content-Type': file.type,
                },
            });

            setMessage('File uploaded successfully!');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error uploading file');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div>
            <input type="file" name='file' onChange={handleFileChange} />
            <button onClick={uploadFile} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload'}
            </button>
            {message && <p>{message}</p>}
        </div>
    )
}

export default FileUpload
