import { toast } from "sonner";

export const SuccessToast = (message?: string) => {
  toast.success("إجراء مكتمل", {
    description: message || "تمت العملية بنجاح.",
  });
};

export const ErrorToast = (message?: string) => {
  toast.error("خطأ", {
    description: message || "حدث خطأ أثناء العملية.",
  });
};
