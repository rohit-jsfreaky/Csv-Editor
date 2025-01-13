"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Commet } from "react-loading-indicators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import SearchBar from "./SearchBar";
import EmptyState from "./EmptyState";
import FileTable from "./FileTable";

function UserFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const toast = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadState, setDownloadState] = useState({
    isLoading: false,
    fileName: "",
  });
  const [deleteState, setDelteState] = useState({
    isLoading: false,
    fileName: "",
  });

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const { data } = await axios.get("/api/list-files");
        setFiles(data.files);
      } catch (err) {
        toast.toast({
          variant: "destructive",
          title: err.response.data.error,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const filteredFiles = files.filter((file) =>
    file.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedFiles = filteredFiles.slice(
    page * pageSize,
    (page + 1) * pageSize
  );

  return (
    <div
      className="w-full h-[91.8vh] p-20"
      style={{ height: `calc(100vh - 64px)` }}
    >
      <h1 className="text-4xl font-bold mb-8">Uploaded Files</h1>

      {loading ? (
        <div className="flex items-center h-full w-full justify-center">
          <Commet color="#2c2f95" size="medium" text="" textColor="" />
        </div>
      ) : files.length === 0 ? (
        <>
          <div className="flex flex-col gap-10 items-center h-full w-full justify-center">
            <h3 className="text-2xl font-semibold">No Files Uploaded Yet</h3>

            <Link href={"/"}>
              <Button variant={"outline"} className="rounded-xl">
                Upload One
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {paginatedFiles.length === 0 ? (
            <EmptyState />
          ) : (
            <FileTable
              paginatedFiles={paginatedFiles}
              setDownloadState={setDownloadState}
              downloadState={downloadState}
              setDelteState={setDelteState}
              setFiles={setFiles}
              files={files}
              deleteState={deleteState}
            />
          )}
        </>
      )}

      {!loading && filteredFiles.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <Button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
            className="px-4 py-2"
          >
            Previous
          </Button>
          <span className="text-xs md:text-sm">
            Page{" "}
            <strong>
              {page + 1} of {Math.ceil(filteredFiles.length / pageSize)}
            </strong>
          </span>
          <Button
            onClick={() =>
              setPage((prev) =>
                Math.min(
                  prev + 1,
                  Math.ceil(filteredFiles.length / pageSize) - 1
                )
              )
            }
            disabled={page === Math.ceil(filteredFiles.length / pageSize) - 1}
            className="px-4 py-2"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default UserFiles;
