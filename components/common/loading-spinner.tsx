interface LoadingSpinnerProps {
  text?: string;
  wrapperClass?: string;
  spinnerClass?: string;
}

export function LoadingSpinner({
  text = "",
  wrapperClass,
  spinnerClass="h-4 w-4",
}: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center ${wrapperClass || ""}`}>
      <div
        className={`animate-spin rounded-full border-2 border-gray-500 border-t-transparent ${spinnerClass}`}
      ></div>
      <span>{text}</span>
    </div>
  );
}
