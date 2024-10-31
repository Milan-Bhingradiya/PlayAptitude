"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden"></div>
  );
}

export default Page;
