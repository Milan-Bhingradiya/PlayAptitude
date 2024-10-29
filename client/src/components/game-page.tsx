'use client'

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mic, MicOff, MessageCircle, Clock, ThumbsUp, ThumbsDown, Smile, Frown, Party, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function GamePageComponent() {
  const [timeLeft, setTimeLeft] = useState(30)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isTimeStopped, setIsTimeStopped] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2
  })
  const [chatMessages, setChatMessages] = useState([
    { sender: "opponent", message: "Good luck!" },
    { sender: "user", message: "Thanks, you too!" }
  ])
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    if (!isTimeStopped) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isTimeStopped])

  const reactions = [
    { icon: <ThumbsUp className="w-6 h-6" />, label: "Good job!" },
    { icon: <ThumbsDown className="w-6 h-6" />, label: "Too bad" },
    { icon: <Smile className="w-6 h-6" />, label: "Happy" },
    { icon: <Frown className="w-6 h-6" />, label: "Sad" },
    { icon: <Party className="w-6 h-6" />, label: "Celebrate" },
  ]

  const sendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, { sender: "user", message: newMessage.trim() }])
      setNewMessage("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          {/* Player's avatar */}
          <div className="flex items-center space-x-2">
            <Avatar className="w-16 h-16 ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-900">
              <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Player" />
              <AvatarFallback>PL</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold">You</p>
              <MicOff className="w-5 h-5 inline-block text-red-400" />
            </div>
          </div>

          {/* Opponent's avatar */}
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="font-bold">Opponent</p>
              <Mic className="w-5 h-5 inline-block text-green-400" />
            </div>
            <Avatar className="w-16 h-16 ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-900">
              <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Opponent" />
              <AvatarFallback>OP</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Main game area */}
        <Card className="bg-gray-800 border-gray-700 shadow-xl backdrop-blur-sm bg-opacity-80">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-4 text-white">{currentQuestion.question}</h2>
              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="py-8 text-lg font-semibold bg-gray-700 hover:bg-blue-600 transition-colors duration-300"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex justify-center items-center space-x-4">
              <div className="text-3xl font-bold text-blue-400">{timeLeft}s</div>
              <Button
                onClick={() => setIsTimeStopped(!isTimeStopped)}
                className={`${
                  isTimeStopped ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                } transition-colors duration-300`}
              >
                {isTimeStopped ? "Resume Time" : "Stop Time"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="mt-6 flex justify-end space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="bg-gray-700 hover:bg-gray-600">
                <Smile className="w-6 h-6" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-gray-800 border-gray-700">
              <div className="flex space-x-2">
                {reactions.map((reaction, index) => (
                  <Button key={index} variant="ghost" className="p-2" title={reaction.label}>
                    {reaction.icon}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            className="bg-gray-700 hover:bg-gray-600"
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </div>

        {/* Chat modal */}
        <AnimatePresence>
          {isChatOpen && (
            <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
              <DialogContent className="bg-gray-800 border-gray-700 shadow-xl backdrop-blur-sm bg-opacity-80">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-white">Chat</DialogTitle>
                </DialogHeader>
                <div className="h-64 overflow-y-auto mb-4 bg-gray-700 p-4 rounded">
                  {chatMessages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`mb-2 ${
                        msg.sender === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      <span
                        className={`inline-block p-2 rounded-lg ${
                          msg.sender === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-600 text-gray-100"
                        }`}
                      >
                        {msg.message}
                      </span>
                    </motion.div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="bg-gray-700 border-gray-600"
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <Button onClick={sendMessage}>Send</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}