import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { handleDownload, handleDelete } from "@/utils";
import { useToast } from "@/hooks/use-toast";

const FileTable = ({
  paginatedFiles,
  setDownloadState,
  downloadState,
  setDelteState,
  setFiles,
  files,
  deleteState,
}) => {
  const toast = useToast();
  const router = useRouter();


  return (
    <div className="overflow-x-auto w-full">
      <Table className="min-w-[600px] w-full">
        <TableCaption>Your uploaded files.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>Last Modified</TableHead>
            <TableHead>Size (KB)</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedFiles.map((file) => (
            <TableRow key={file?.key}>
              <TableCell className="font-medium">
                {file?.key.split("/").pop()}
              </TableCell>
              <TableCell>
                {new Date(file?.lastModified).toLocaleString()}
              </TableCell>
              <TableCell>{(file?.size / 1024).toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <div className="flex flex-wrap justify-end gap-2">
                  <Button
                    className="px-4 md:px-7 rounded-xl hover:border text-sm md:text-base"
                    onClick={() =>
                      router.push(`/dashboard/edit/${file?.key.split("/")[1]}`)
                    }
                    disabled={
                      deleteState.isLoading ||
                      downloadState.isLoading
                    }
                   
                  >
                    Edit
                  </Button>

                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      handleDownload(
                        file.key.split("/").pop(),
                        setDownloadState,
                        toast
                      )
                    }
                    disabled={
                      deleteState.isLoading ||
                      downloadState.isLoading &&
                      downloadState.fileName === file.key.split("/").pop()
                    }
                    className={`px-3 py-2 rounded-xl text-sm md:text-base font-medium ${
                      downloadState.isLoading &&
                      downloadState.fileName === file.key.split("/").pop()
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    {downloadState.isLoading &&
                    downloadState.fileName === file.key.split("/").pop() ? (
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : (
                      "Download"
                    )}
                  </Button>

                  <Button
                    variant={"destructive"}
                    onClick={() =>
                      handleDelete(
                        file.key.split("/").pop(),
                        setDelteState,
                        toast,
                        setFiles,
                        files
                      )
                    }
                    disabled={
                      downloadState.isLoading || 
                      deleteState.isLoading &&
                      deleteState.fileName === file.key.split("/").pop()
                    }
                    className={`px-3 py-2 rounded-xl text-sm md:text-base ${
                      deleteState.isLoading &&
                      deleteState.fileName === file.key.split("/").pop()
                        ? "bg-red-400 text-white cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    {deleteState.isLoading &&
                    deleteState.fileName === file.key.split("/").pop() ? (
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500"></div>
                      </div>
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FileTable;
