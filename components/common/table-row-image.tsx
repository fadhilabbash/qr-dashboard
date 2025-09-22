// components/TableRowImage.tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TableRowImageProps {
  src: string;
  alt?: string;
  fallback?: string;
}

export const TableRowImage = ({
  src,
  alt = "Avatar",
  fallback = "NA",
}: TableRowImageProps) => {
  return (
    <Avatar className="h-16 w-16 rounded-full">
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback className="rounded-full">{fallback}</AvatarFallback>
    </Avatar>
  );
};
