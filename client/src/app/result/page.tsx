"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Home, Crown } from "lucide-react";
import confetti from "canvas-confetti";

export default function Page() {
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Simulating data fetch
    setResults({
      user: {
        name: "You",
        score: 7,
        correctAnswers: 7,
        avatar: "/placeholder.svg?height=128&width=128",
      },
      opponent: {
        name: "Opponent",
        score: 6,
        correctAnswers: 6,
        avatar: "/placeholder.svg?height=128&width=128",
      },
    });

    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  if (!results) return null;

  const winner =
    results.user.score > results.opponent.score ? "user" : "opponent";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 text-blue-100 p-4 md:p-8 flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
      <div className="absolute inset-0 bg-blue-500 mix-blend-overlay filter blur-[100px] opacity-20"></div>
      <Card className="bg-gray-800/50 shadow-xl w-full max-w-3xl backdrop-blur-md">
        <CardContent className="p-8">
          <h2 className="text-4xl font-bold mb-8 text-center text-blue-200 tracking-tight">
            Game Results
          </h2>
          <div className="grid grid-cols-2 gap-12 mb-12">
            {["user", "opponent"].map((player) => (
              <div key={player} className="text-center relative">
                <div
                  className={`absolute inset-0 bg-blue-500 opacity-10 rounded-full filter blur-2xl ${
                    winner === player ? "animate-pulse" : ""
                  }`}
                ></div>
                <Avatar className="w-32 h-32 mx-auto mb-6 relative ring-4 ring-offset-4 ring-offset-gray-800 ring-blue-500">
                  <AvatarImage
                    src={results[player].avatar}
                    alt={results[player].name}
                  />
                  <AvatarFallback>{results[player].name[0]}</AvatarFallback>
                  {winner === player && (
                    <Crown className="w-10 h-10 absolute -top-2 -right-2 text-yellow-400 drop-shadow-lg" />
                  )}
                </Avatar>
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    winner === player ? "text-yellow-400" : ""
                  }`}
                >
                  {results[player].name}
                </h3>
                <p className="text-3xl font-bold text-blue-300 mb-3">
                  {results[player].score} points
                </p>
                <p className="text-sm mb-2">
                  {results[player].correctAnswers} / 10 correct
                </p>
                <Progress
                  value={(results[player].correctAnswers / 10) * 100}
                  className="w-full h-3"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-6">
            <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105">
              <Brain className="w-6 h-6 mr-2" /> Play Again
            </Button>
            <Button
              variant="outline"
              className="border-blue-400 text-blue-400 hover:bg-blue-900 text-lg px-8 py-6 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <Home className="w-6 h-6 mr-2" /> Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
