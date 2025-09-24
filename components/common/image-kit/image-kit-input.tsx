"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useEffect, useRef, useState } from "react";
import { authenticator } from "./authenticator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, FolderOpen, Trash2, UploadCloud } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { ErrorToast } from "../notification";

// UploadExample component demonstrates file uploading using ImageKit's Next.js SDK.
interface ImageKitProps {
  value?: string | null;
  onChange?: (value: string | null) => void;
  folder?: string;
}

const ImageKit: React.FC<ImageKitProps> = ({ value, onChange, folder }) => {
  // State to keep track of the current upload progress (percentage)
  const [progress, setProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(value ?? null);
  const [fileId, setFileId] = useState<string | null>(null);
  //const [name, setName] = useState<string | null>(value ?? null);
  const [preview, setPreview] = useState<string>(value ?? "");
  // Create a ref for the file input element to access its files easily
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create an AbortController instance to provide an option to cancel the upload if needed.
  const abortController = new AbortController();

  /**
   * Authenticates and retrieves the necessary upload credentials from the server.
   *
   * This function calls the authentication API endpoint to receive upload parameters like signature,
   * expire time, token, and publicKey.
   *
   * @returns {Promise<{signature: string, expire: string, token: string, publicKey: string}>} The authentication parameters.
   * @throws {Error} Throws an error if the authentication request fails.
   */

  /**
   * Handles the file upload process.
   *
   * This function:
   * - Validates file selection.
   * - Retrieves upload authentication credentials.
   * - Initiates the file upload via the ImageKit SDK.
   * - Updates the upload progress.
   * - Catches and processes errors accordingly.
   */
  const handleUpload = async () => {
    // Access the file input element using the ref
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      // alert("Please select a file to upload");
      ErrorToast("يرجى اختيار ملف للرفع.");
      return;
    }

    // Extract the first file from the file input
    const file = fileInput.files[0];

    // Retrieve authentication parameters for the upload.
    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      return;
    }
    const { signature, expire, token, publicKey } = authParams;

    // Call the ImageKit SDK upload function with the required parameters and callbacks.
    try {
      const uploadResponse = await upload({
        // Authentication parameters
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name, // Optionally set a custom file name
        folder: folder ?? "/",
        // Progress callback to update upload progress state
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        // Abort signal to allow cancellation of the upload if needed.
        abortSignal: abortController.signal,
      });
      setUploadedUrl(uploadResponse.url ?? null);
      setFileId(uploadResponse.fileId ?? null);
      //setName(uploadResponse.name ?? null);
    } catch (error) {
      // Handle specific error types provided by the ImageKit SDK.
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        // Handle any other errors that may occur.
        console.error("Upload error:", error);
      }
    }
  };
  const handleBrowse = () => {
    fileInputRef.current?.click();
  };
  const handleClear = async () => {
    onChange?.(null);
    setUploadedUrl(null);
    setPreview("");
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (fileId) {
      await fetch("/api/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      });
    }
    setFileId(null);
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const fileName = event.target.files?.[0].name;
    if (file) {
      setPreview(URL.createObjectURL(file));
      if (fileName) {
        //setName(fileName);
      }
    }
  };
  useEffect(() => {
    onChange?.(uploadedUrl);
  }, [uploadedUrl, onChange]);
  return (
    <div className="flex flex-col gap-2 w-1/2 border p-1 rounded-lg">
      <div className="w-full h-[8rem] rounded-t-lg border border-dashed flex flex-col justify-center items-center">
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            className="w-full h-[8rem] object-cover rounded-lg"
            width={120}
            height={120}
            unoptimized
          />
        ) : (
          <>
            <FolderOpen className="text-muted-foreground mb-2 h-8 w-8" />
            <p className="text-muted-foreground text-sm">حمل ملف الصورة</p>
            <Button
              type="button"
              onClick={handleBrowse}
              variant="link"
              className="cursor-pointer "
            >
              تصفح
            </Button>
          </>
        )}
      </div>
      {/* File input element using React ref */}
      <Input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      {/* Button to trigger the upload process */}
      <div className="border rounded-t-lg p-1 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Button
            type="button"
            onClick={handleUpload}
            variant="secondary"
            size="icon"
            className="size-8 cursor-pointer"
            disabled={!preview}
          >
            <UploadCloud size={24} color="blue" />
          </Button>
          {uploadedUrl ? (
            <>
              <CheckCircle size={18} color="green" />
            </>
          ) : null}

          <Button
            type="button"
            onClick={handleClear}
            variant="secondary"
            size="icon"
            className="size-8 cursor-pointer"
            disabled={!preview}
          >
            <Trash2 size={24} color="red" />
          </Button>
        </div>
        <Progress value={progress} className="w-full h-[2px]" />
      </div>
    </div>
  );
};

export default ImageKit;
