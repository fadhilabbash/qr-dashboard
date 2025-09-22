import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Eye } from "lucide-react";

interface FileInputProps {
  value?: string | File | null;
  onChange?: (value: string | File | null) => void;
}

const FileInput: React.FC<FileInputProps> = ({ value, onChange }) => {
  const [fileUrl, setFileUrl] = useState<string>(
    typeof value === "string" && value ? value : ""
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFileUrl(URL.createObjectURL(file));
      onChange?.(file);
    } else {
      setFileUrl(typeof value === "string" && value ? value : "");
    }
  };

  useEffect(() => {
    if (value instanceof File) {
      setFileUrl(URL.createObjectURL(value));
    } else if (typeof value === "string" && value) {
      setFileUrl(value);
    }
  }, [value]);

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept=".pdf, .doc, .docx"
          onChange={handleFileChange}
        />

        <Link
          href={fileUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={`rounded-md p-2 bg-primary text-primary-foreground transition ${
            !fileUrl ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <Eye className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};
export default FileInput;
