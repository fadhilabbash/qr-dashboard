import { LoadingSpinner } from "@/components/common/loading-spinner";

const Loading = () => {
  return (
    <LoadingSpinner
      wrapperClass="h-screen w-full flex items-center justify-center"
      spinnerClass="h-8 w-8"
    />
  );
};
export default Loading;
