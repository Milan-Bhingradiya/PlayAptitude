'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Brain } from "lucide-react"

export function Login() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center">
          <Brain className="mx-auto h-12 w-12 text-blue-400" />
          <h2 className="mt-6 text-3xl font-bold text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-400">Sign in to your account</p>
        </div>
        <form className="mt-8 space-y-6 bg-gray-800 p-6 rounded-lg shadow-[0_0_15px_rgba(0,0,255,0.1)] backdrop-blur-sm bg-opacity-80" action="#" method="POST">
          <div className="space-y-4 rounded-md shadow-sm">
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
                autoComplete="current-password"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Remember me
              </Label>
            </div>

            <div className="text-sm">
              <Link href="#" className="font-medium text-blue-400 hover:text-blue-300">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-300 shadow-[0_0_15px_rgba(0,0,255,0.5)]"
            >
              Sign in
            </Button>
          </div>
        </form>
        <div className="text-center">
          <p className="mt-2 text-sm text-gray-400">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-blue-400 hover:text-blue-300">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}