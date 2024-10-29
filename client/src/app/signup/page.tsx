"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain } from "lucide-react";

import { useMutation } from "@tanstack/react-query";

import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/interactions/dataPoster";

type FormSchema = {
  email: string;
  username: string;
  password: string;
};
export default function Page() {
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: registerUser,
  });

  function onSubmit(data: FormSchema) {
    mutate(data, {
      onSuccess: (data) => {
        if (data.success) {
          // toast({
          //   title: "Success",
          //   description: "Logged in successfully",
          //   variant: "success",
          // });
          alert("added successfully");

          router.push("/login");
        } else {
          // toast({
          //   title: "Error",
          //   description: data.message,
          //   variant: "destructive",
          // });
          alert("Error: " + data.message);
        }
      },
      onError(error) {
        // toast({
        //   title: "Error",
        //   description: error.message,
        //   variant: "destructive",
        // });
        alert("Error: " + error.message);
      },
    });
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <Brain className="mx-auto h-12 w-12 text-blue-400" />
          <h2 className="mt-6 text-3xl font-bold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Join the Aptitude Game community
          </p>
        </div>
        <form
          className="mt-8 space-y-6 bg-gray-800 p-6 rounded-lg shadow-[0_0_15px_rgba(0,0,255,0.1)] backdrop-blur-sm bg-opacity-80"
          action="#"
          method="POST"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = {
              email: formData.get("email") as string,
              username: formData.get("username") as string,
              password: formData.get("password") as string,
            };
            onSubmit(data);
          }}
        >
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Label htmlFor="username" className="sr-only">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                placeholder="Username"
              />
            </div>
            <div>
              <Label htmlFor="email-address" className="sr-only">
                Email address
              </Label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                placeholder="Email address"
              />
            </div>
            <div>
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                placeholder="Password"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-300 shadow-[0_0_15px_rgba(0,0,255,0.5)]"
            >
              Sign up
            </Button>
          </div>
        </form>
        <div className="text-center">
          <p className="mt-2 text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
