"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UpdateProfile() {
  const [profile, setProfile] = useState({
    id: "123e4567-e89b-12d3-a456-426614174000",
    img: "/placeholder.svg?height=100&width=100",
    bio: "Passionate gamer always ready for a challenge!",
    score: 1500,
    num_of_games_won: 75,
    num_of_games_lost: 25,
    rank: 42,
    streak: 5,
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfile((prev) => ({ ...prev, img: e.target?.result as string }))
        }
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProfile((prev) => ({ ...prev, bio: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated profile to your backend
    console.log("Updated profile:", profile)
    // Show a success message or redirect
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center mb-8">Update Your Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-gray-800 border-blue-500">
            <CardHeader>
              <CardTitle className="text-blue-400">Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={profile.img} alt="Profile" />
                    <AvatarFallback>UN</AvatarFallback>
                  </Avatar>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Change Profile Picture
                  </label>
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-400">
                    Bio
                  </label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={handleBioChange}
                    className="mt-1 bg-gray-700 text-white"
                    rows={4}
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Update Profile
                </Button>
              </form>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-blue-500">
            <CardHeader>
              <CardTitle className="text-blue-400">Game Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Score:</span>
                <span className="text-2xl font-bold text-blue-300">{profile.score}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Games Won:</span>
                <span className="text-xl font-semibold text-green-400">{profile.num_of_games_won}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Games Lost:</span>
                <span className="text-xl font-semibold text-red-400">{profile.num_of_games_lost}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Rank:</span>
                <span className="text-xl font-semibold text-yellow-400">#{profile.rank}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current Streak:</span>
                <span className="text-xl font-semibold text-purple-400">{profile.streak}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}