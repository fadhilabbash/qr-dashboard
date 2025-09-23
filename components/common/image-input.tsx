"use client";

import { FolderOpen, Trash2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";

interface ImageInputProps {
  value?: string | File | null;
  onChange?: (value: string | File | null) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({ value, onChange }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const baseFileUrl = process.env.NEXT_PUBLIC_FILE_URL;

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof value === "string") {
      setPreview(baseFileUrl + value);
    } else {
      setPreview(null);
    }
  }, [value, baseFileUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onChange?.(file);
  };

  const handleClear = () => {
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

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
            onClick={handleClear}
            variant="secondary"
            size="icon"
            className="size-8 cursor-pointer"
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageInput;
