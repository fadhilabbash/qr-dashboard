import LoginForm from "@/components/auth/login-form";


interface SearchParamsProps {
  searchParams:  Promise<{
    error?: string;
  }>;
}

export default async function LogInPage({ searchParams }: SearchParamsProps) {
  const search = await searchParams;
  return (
    // <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    //   <LoginForm error={search.error} />
    // </div>
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
    <div className="w-full max-w-sm">
      <LoginForm error={search.error}/>
    </div>
  </div>
  );
}
