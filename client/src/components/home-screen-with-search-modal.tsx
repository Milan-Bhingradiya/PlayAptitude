'use client'

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trophy, Brain, Settings, User, Users, PersonStanding, Loader2 } from "lucide-react"

export function HomeScreenWithSearchModal() {
  const [userStats, setUserStats] = useState({
    username: "AptitudeAce",
    level: 15,
    totalGames: 150,
    winRate: 68,
  })

  const recentGames = [
    { opponent: "BrainWizard", result: "Won", score: "7-5", mode: "1v1" },
    { opponent: "QuizMaster", result: "Lost", score: "4-6", mode: "1v1" },
    { opponent: "Solo Challenge", result: "Completed", score: "85%", mode: "Single" },
  ]

  const leaderboard = [
    { rank: 1, username: "MindMaster", score: 2500 },
    { rank: 2, username: "QuizChamp", score: 2450 },
    { rank: 3, username: "BrainiacSupreme", score: 2400 },
  ]

  const [isSearching, setIsSearching] = useState(false)
  const [opponentAvatar, setOpponentAvatar] = useState("/placeholder.svg?height=80&width=80")

  useEffect(() => {
    if (isSearching) {
      const interval = setInterval(() => {
        setOpponentAvatar(`/placeholder.svg?height=80&width=80&text=${Math.random().toString(36).substr(2, 5)}`)
      }, 200)
      return () => clearInterval(interval)
    }
  }, [isSearching])

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Avatar className="w-20 h-20 ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-900">
              <AvatarImage src="/placeholder.svg?height=80&width=80" alt={userStats.username} />
              <AvatarFallback className="bg-gray-700">{userStats.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-3xl font-bold text-white">{userStats.username}</h2>
              <p className="text-lg text-blue-300">Level {userStats.level}</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white border-gray-700 px-4 py-2 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(0,0,255,0.5)]">
              <User className="w-5 h-5" />
              <span className="text-sm md:text-base">Profile</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white border-gray-700 px-4 py-2 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(0,0,255,0.5)]">
              <Settings className="w-5 h-5" />
              <span className="text-sm md:text-base">Settings</span>
            </Button>
          </div>
        </header>

        <div className="bg-gray-800 rounded-lg p-4 shadow-lg mb-8 backdrop-blur-sm bg-opacity-80">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-lg text-blue-300">Total Games</p>
              <p className="text-2xl font-bold text-white">{userStats.totalGames}</p>
            </div>
            <div>
              <p className="text-lg text-blue-300">Win Rate</p>
              <p className="text-2xl font-bold text-white">{userStats.winRate}%</p>
            </div>
          </div>
        </div>

        <main className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              className="py-8 text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg rounded-lg relative overflow-hidden group"
              onClick={() => setIsSearching(true)}
            >
              <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <Users className="w-8 h-8 mr-2" />
              Play 1-on-1 Game
            </Button>
            <Button 
              className="py-8 text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg rounded-lg relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <PersonStanding className="w-8 h-8 mr-2" />
              Play Single Game
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gray-800 border-gray-700 shadow-xl backdrop-blur-sm bg-opacity-80">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-2xl text-white">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                  <span>Recent Games</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {recentGames.map((game, index) => (
                    <li key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
                      <div>
                        <span className="text-lg">{game.opponent}</span>
                        <span className="text-sm text-blue-300 ml-2">({game.mode})</span>
                      </div>
                      <span className={`text-lg font-bold ${
                        game.result === "Won" ? "text-green-400" : 
                        game.result === "Lost" ? "text-red-400" : "text-yellow-400"
                      }`}>
                        {game.result} ({game.score})
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 shadow-xl backdrop-blur-sm bg-opacity-80">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-2xl text-white">
                  <Brain className="w-8 h-8 text-blue-400" />
                  <span>Leaderboard</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {leaderboard.map((player) => (
                    <li key={player.rank} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
                      <span className="text-lg">
                        {player.rank}. {player.username}
                      </span>
                      <span className="text-lg font-bold text-yellow-400">{player.score}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <Dialog open={isSearching} onOpenChange={setIsSearching}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 shadow-[0_0_50px_rgba(0,0,255,0.3)]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-4">Searching for Opponent</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center justify-center space-x-8">
              <Avatar className="w-24 h-24 ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-800">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt={userStats.username} />
                <AvatarFallback className="bg-gray-700 text-2xl">{userStats.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-4xl font-bold text-blue-400">VS</div>
              <Avatar className="w-24 h-24 ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-800 animate-pulse">
                <AvatarImage src={opponentAvatar} alt="Searching" />
                <AvatarFallback className="bg-gray-700 text-2xl">??</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              <span className="text-lg">Finding a worthy opponent...</span>
            </div>
            <Button 
              onClick={() => setIsSearching(false)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-all duration-300"
            >
              Cancel Search
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}