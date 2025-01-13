"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Papa from "papaparse";
import Edit from "../_component/Edit";
import Header from "@/app/_components/Header";
import { useUser } from "@clerk/nextjs";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";

const EditFile = () => {
  const { fileName } = useParams();
  const [fileContent, setFileContent] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { isLoaded } = useUser();
  const toast = useToast();
  const router = useRouter();

  const fetchFileContent = async () => {
    setLoading(true);

    try {
      const decodedFileName = decodeURIComponent(fileName)
      const storedContent = sessionStorage.getItem(`file-content-${decodedFileName}`);
      if (storedContent) {
        setFileContent(JSON.parse(storedContent));
        setLoading(false);
        toast.toast({
          variant: "default",
          title: "File loaded successfully",
        });

        return;
      }

      const response = await axios.get("/api/get-download-url", {
        params: { fileName:decodedFileName },
      });

      const signedUrl = response.data.signedUrl;

      const fileResponse = await fetch(signedUrl);

      const fileText = await fileResponse.text();

      const parsedContent = Papa.parse(fileText, {
        header: true,
        skipEmptyLines: true,
      }).data;

      setFileContent(parsedContent);

      sessionStorage.setItem(
        `file-content-${decodedFileName}`,
        JSON.stringify(parsedContent)
      );

      toast.toast({
        variant: "default",
        title: "File loaded successfully!",
        description: "Start editing your file.",
      });
    } catch (err) {
      console.error("Error fetching file content:", err);

      if (err.response?.status === 401) {
        toast.toast({
          variant: "destructive",
          title: "Unauthorized",
          description: "Please log in to access this file.",
        });

        return setError("Please Log in to Continue");
      } else if (err.response?.status === 404) {
        toast.toast({
          variant: "destructive",
          title: "File Not Found",
          description: "The requested file does not exist.",
        });
        return setError("The requested file does not exist");
      } else {
        toast.toast({
          variant: "destructive",
          title: "Error",
          description: err.message || "Something went wrong. Please try again.",
        });
        return setError("Something went wrong. Please try again.");
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!fileName) {
      toast.toast({
        variant: "destructive",
        title: "No File Selected",
        description: "Please choose a file to edit.",
      });
      return;
    }

    fetchFileContent();
  }, [fileName]);

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <div>
      <div
        className={`p-8 h-[82vh] ${
          loading && "flex justify-center items-center"
        } ${error && "flex justify-center items-center"}`}
      >
        {loading ? (
          <Loading />
        ) : error ? (
          <div className="flex flex-col gap-8 justify-center items-center">
            <p className="text-4xl">{error}</p>

            <Button
              className="w-[20%]"
              onClick={() => {
                router.push("/");
              }}
            >
              Upload One
            </Button>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-4">
              Editing File: {decodeURIComponent(fileName)}
            </h1>

            <Edit fileContent={fileContent} fileName={fileName} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditFile;
