'use client';

import Papa from 'papaparse';
import axios from 'axios';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const handleUpload = async (file, setIsUploading, toast, router) => {


  if (!file) {
    return toast.toast({
      variant: 'destructive',
      title: 'Please select a file.',
    });
  }

  if(file.size > MAX_FILE_SIZE){
    return toast.toast({
      variant: 'destructive',
      title: 'File size should be less than 5 mb',
    })
  }

  setIsUploading(true);

  try {
    const fileContent = await new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
        error: (err) => reject(err),
      });
    });

    const { data } = await axios.post('/api/upload', {
      fileName: file.name,
      fileType: file.type,
      fileSize:file.size
    });

    await axios.put(data.signedUrl, file, {
      headers: { 'Content-Type': file.type },
    });

    sessionStorage.setItem(`file-content-${file.name}`, JSON.stringify(fileContent));
    router.push(`/dashboard/edit/${encodeURIComponent(file.name)}`);

    toast.toast({ variant: 'default', title: 'File successfully uploaded.' });
  } catch (error) {
    toast.toast({ variant: "destructive", title: error?.response?.data?.error })
    throw new Error("not allowed")
  } finally {
    setIsUploading(false);
  }
};


export const handleDownload = async (fileName, setDownloadState, toast) => {
  setDownloadState({ isLoading: true, fileName, message: "" });
  try {
    const { data } = await axios.get("/api/get-download-url", {
      params: { fileName },
    });

    window.location.href = data.signedUrl;
    setDownloadState({
      isLoading: false,
      fileName: "",
    });

    toast.toast({
      variant: "destructive",
      title: "Download Started Succesfullly"
    })
  } catch (err) {

    setDownloadState({
      isLoading: false,
      fileName: "",
    });

    toast.toast({
      variant: "destructive",
      title: err.response.data.message
    })
  }
};


export const handleDelete = async (fileName, setDelteState, toast, setFiles, files) => {
  setDelteState({ isLoading: true, fileName, message: "Deleting file" });

  try {

    await axios.delete(`/api/delete-file`, {
      params: { fileName },
    });

    sessionStorage.removeItem(`file-content-${fileName}`);

    setFiles(files.filter((file) => file.key.split("/")[1] !== fileName));

    setDelteState({
      isLoading: false,
      fileName: "",
      message: "File Deleted",
    });

    return toast.toast({
      variant: "default",
      title: "File Deleted Succesfully"
    })
  } catch (err) {


    console.log("error is",err)
    setDelteState({
      isLoading: false,
      fileName: "",

    });
    return toast.toast({
      variant: "destructive",
      title: err.response.data.error
    });
  }
};



export const handleSave = async (setIsSaving, originalData, fileName, setEdit, toast) => {
  setIsSaving(true);

  try {
    
    const decodedFileName = decodeURIComponent(fileName)

    const csvData = Papa.unparse(originalData);

    // Request a signed URL for the upload (You already have this from earlier)
    const { data } = await axios.post('/api/upload', {
      fileName: decodedFileName,
      fileType: "text/csv",
    });

    // Upload the CSV to S3 using the signed URL
    await axios.put(data.signedUrl, csvData, {
      headers: {
        'Content-Type': 'text/csv',
      },
    });

    sessionStorage.setItem(`file-content-${decodedFileName}`, JSON.stringify(originalData));

    setEdit(false);
    toast.toast({
      variant: "default",
      title: "File successfully uploaded",
    });
  } catch (error) {
    toast.toast({
      variant: "destructive",
      title: error.response.data.error
    })
  } finally {
    setIsSaving(false);
  }
};