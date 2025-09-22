import { Pencil, Trash2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface ImageInputProps {
  value?: string | File | null;
  onChange?: (value: string | File | null) => void;
  placeholder?: string;
  size?: string;
}

const ImageInput: React.FC<ImageInputProps> = ({
  value,
  onChange,
  placeholder = "/imgs/imageInputPlaceholder.png",
  size = "6",
}) => {
  const [preview, setPreview] = useState<string>(placeholder);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const baseFileUrl = process.env.NEXT_PUBLIC_FILE_URL;
  useEffect(() => {
    if (value instanceof File) {
      setPreview(URL.createObjectURL(value));
    } else if (typeof value === "string" && value) {
      // If backend sends an existing image URL
      setPreview(baseFileUrl + value);
    } else {
      setPreview(placeholder);
    }
  }, [value, placeholder, baseFileUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onChange?.(file);
  };

  const handleClear = () => {
    onChange?.(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleEdit = () => {
    imageInputRef.current?.click();
  };

  return (
    <div className="mb-2 flex flex-col items-start">
      <div
        className="group relative flex  mb-2"
        style={{ width: `${size}rem`, height: `${size}rem` }}
      >
        <div
          className="group relative flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-cover bg-center border  border-gray-300 shadow-sm"
          style={{ backgroundImage: `url('${preview}')` }}
        >
          <div className="absolute bottom-0 left-0 right-0 flex w-full items-center justify-between p-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              className="h-8 w-8 rounded-md bg-gray-200 hover:bg-gray-300"
            >
              <Pencil size={16} />
            </Button>

            {preview !== placeholder && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="h-8 w-8 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
      <Input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg, image/jpg, image/png"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageInput;
