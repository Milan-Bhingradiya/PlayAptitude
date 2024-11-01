"use client";

import { useState, useEffect, useContext, useCallback, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import "react-toastify/dist/ReactToastify.css";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Mic,
  MicOff,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { socketContext, useSocket } from "@/providers/SocketContext";

import { toast } from "react-toastify";

// import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useRouter } from "next/navigation";
// import { addGameHistory } from "@/lib/interactions/dataPoster";
import {
  addGameHistoryInput,
  addGameHistoryResponse,
  // addGameHistoryResponse,
  ChatMessage,
  Question,
} from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { addGameHistory } from "@/lib/interactions/dataPoster";
import peerServiceInstance from "@/service/peer";
// import { useMutation } from "@tanstack/react-query";

export default function Page() {
  const { mutate: mutate_addGameHistory } = useMutation<
    addGameHistoryResponse,
    Error,
    addGameHistoryInput
  >({
    mutationFn: addGameHistory,
  });

  const router = useRouter();
  const socket = useSocket();
  const socketProvider = useContext(socketContext);

  socket.on("time_stop", (data) => {
    alert("Time stopped: " + data);
  });

  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimeStopped, setIsTimeStopped] = useState(false);
  // --------------
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userScore, setUserScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const [userScoreArr, setUserScoreArr] = useState<number[]>([]);
  const [opponentScoreArr, setOpponentScoreArr] = useState<number[]>([]);
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [userStoppedTimer, setUserStoppedTimer] = useState<boolean>(false);
  const [opponentStoppedTimer, setOpponentStoppedTimer] =
    useState<boolean>(false);
  const [userAnswered, setUserAnswered] = useState<boolean>(false);
  const [opponentAnswered, setOpponentAnswered] = useState<boolean>(false);
  const [answerTime, setAnswerTime] = useState<number | null>(null);
  // --------

  // for chat
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // for avtar mic
  const [isOurMicOn, setIsOurMicOn] = useState(false);
  const [isOpponentMicOn, setIsOpponentMicOn] = useState(false);

  useEffect(() => {
    // The peer will auto-initialize on the client side

    return () => {
      // Clean up when component unmounts
      peerServiceInstance.destroy();
    };
  }, []);

  useEffect(() => {
    if (!isTimeStopped) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isTimeStopped]);

  const reactions = [
    { icon: <ThumbsUp className="w-6 h-6" />, label: "Good job!" },
    { icon: <ThumbsDown className="w-6 h-6" />, label: "Too bad" },
    { icon: <Smile className="w-6 h-6" />, label: "Happy" },
    { icon: <Frown className="w-6 h-6" />, label: "Sad" },
    // { icon: <Party className="w-6 h-6" />, label: "Celebrate" },
  ];

  const handleNextQuestion = useCallback(() => {
    // console.log("handleNextQuestion");
    if (currentQuestionIndex < 9) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(30);
      setUserAnswered(false);
      setOpponentAnswered(false);
      setAnswerTime(null);
    } else {
      if (userScore > opponentScore) {
        toast("You win!");
      } else {
        toast("You lose!");
      }

      // const gameData: addGameHistoryInput = {
      //   player1Total: userScore,
      //   player2Username: socketProvider?.opponent_userName || "",
      //   player2Total: opponentScore,
      //   player1Scores: [userScore],
      //   player2Scores: [opponentScore],
      // };

      // console.log("gamedata ");
      // console.log(gameData);

      if (userScore > opponentScore) {
        mutate_addGameHistory(
          {
            player1Total: userScore,
            player2Username: socketProvider?.opponent_userName || "",
            player2Total: opponentScore,
            player1Scores: userScoreArr,
            player2Scores: opponentScoreArr,
          },
          {
            onSuccess: (data: addGameHistoryResponse) => {
              if (data.success) {
                alert("Game history added");
              } else {
                alert("Error: " + data.message);
              }
            },
            onError: (error) => {
              alert("Error: " + error.message);
            },
          }
        );

        alert("You win!");
      } else {
        alert("You lose!");
      }

      socket.emit("game_over", userScore);
      router.push("/home");
    }
  }, [
    currentQuestionIndex,
    mutate_addGameHistory,
    opponentScore,
    opponentScoreArr,
    router,
    socket,
    socketProvider?.opponent_userName,
    userScore,
    userScoreArr,
  ]);

  useEffect(() => {
    // console.log("use effect callllllllllllllllllllllllll");
    socket.emit("fetch_questions");

    socket.on("questions_received", (questions: Question[]) => {
      // console.log("Questions received", questions);
      setGameQuestions(questions);
    });

    socket.on("opponent_score_update", (score: number) => {
      // console.log("Score updated", score);
      setOpponentScore(score);
      setOpponentScoreArr([...opponentScoreArr, score]);
    });

    socket.on("opponent_stopped_timer", () => {
      // console.log("opponent stopped timer");
      toast("oponent stopped timer");
      setOpponentStoppedTimer(true);
    });

    socket.on("timer_resumed", () => {
      // console.log("timer resumed");
      setIsTimeStopped(false);
      setUserStoppedTimer(false);
      setOpponentStoppedTimer(false);
    });

    socket.on("opponent_answered", () => {
      // console.log("opponent answered");
      setOpponentAnswered(true);
    });

    socket.on("next_question", () => {
      // console.log("next question");
      handleNextQuestion();
    });

    socket.on(
      "receive_message",
      (data: {
        message: string;
        opponent_sid: string;
        sender_username: string;
        time: number;
      }) => {
        setChatMessages([
          ...chatMessages,
          {
            sender_uname: data.sender_username,
            message: data.message,
            time: data.time,
          },
        ]);

        // chatMessages.sort((a, b) => a.time - b.time);
      }
    );

    return () => {
      socket.off("questions_received");
      socket.off("opponent_score_update");
      socket.off("opponent_stopped_timer");
      socket.off("timer_resumed");
      socket.off("opponent_answered");
      socket.off("next_question");
      socket.off("receive_message");
    };
  }, [chatMessages, handleNextQuestion, opponentScoreArr, socket]);

  useEffect(() => {
    if (userStoppedTimer && opponentStoppedTimer) {
      setIsTimeStopped(true);
      // alert("Both players stopped timer");
      socket.emit("both_players_stopped_timer", {
        opponent_sid: socketProvider?.opponent_socketId || "",
      });
    }
  }, [
    userStoppedTimer,
    opponentStoppedTimer,
    socket,
    socketProvider?.opponent_socketId,
  ]);

  useEffect(() => {
    if (userAnswered && opponentAnswered) {
      handleNextQuestion();
    }
  }, [userAnswered, opponentAnswered, handleNextQuestion]);

  const handleAnswerSubmit = (selectedAnswerIndex: number) => {
    if (!userAnswered) {
      const currentQuestion = gameQuestions[currentQuestionIndex];
      const timeSpent = 30 - timeLeft;
      const scoreIncrease =
        selectedAnswerIndex === currentQuestion.correctAnswer
          ? 30 - timeSpent
          : 0;

      if (scoreIncrease > 0) {
        toast(`Right! +${scoreIncrease}`);
      } else {
        toast(`Wrong! +${scoreIncrease}`);
      }

      setUserScore(userScore + scoreIncrease);
      setUserScoreArr([...userScoreArr, scoreIncrease]);

      setUserAnswered(true);
      setAnswerTime(timeSpent);

      console.log(socketProvider);

      socket.emit("answer_submitted", {
        score: userScore + scoreIncrease,
        timeSpent,
        opponent_sid: socketProvider?.opponent_socketId || "",
      });
    }
  };

  const handleStopTimer = () => {
    setUserStoppedTimer(true);
    socket.emit("stop_timer", {
      opponent_sid: socketProvider?.opponent_socketId || "",
    });
  };

  const handleResumeTimer = () => {
    socket.emit("resume_timer", {
      opponent_sid: socketProvider?.opponent_socketId || "",
    });
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const msg = {
        sender_uname: socketProvider?.myUserName || "",
        message: newMessage.trim(),
        time: new Date().getTime(),
        opponent_sid: socketProvider?.opponent_socketId || "",
      };
      setChatMessages([...chatMessages, msg]);
      setNewMessage("");

      // send message to opponent via socket
      socket.emit("send_message", msg);
    }
  };

  // when new msg come scroll below logic
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]); // Trigger scroll on new messages

  // make webrtc connection

  const callUser = useCallback(async () => {
    if (socketProvider?.is_iam_webRtcInitiator) {
      console.log("calll user");
      const offer = await peerServiceInstance.getOffer();
      socket.emit("call:user", {
        to: socketProvider?.opponent_socketId,
        from: socketProvider?.socket.id,
        offer: offer,
      });
    }
    console.log("calll user end");
  }, [socket, socketProvider]);
  useEffect(() => {
    // call user if i am intiotiar

    callUser();
  }, [callUser]);

  const handleIncomingCall = useCallback(
    async (data: { from: string; offer: RTCSessionDescriptionInit }) => {
      console.log("incoming call from ", data.from, "offer : ", data);

      const answer = await peerServiceInstance.getAnswer(data.offer);
      setTimeout(() => {
        socket.emit("call:accepted", { to: data.from, answer: answer });
      }, 1000);
    },
    [socket]
  );

  const handleCallAccepted = useCallback(
    async (data: { from: string; answer: RTCSessionDescriptionInit }) => {
      peerServiceInstance.setLocalDescription(data.answer);
      console.log("call accepted from ", data.from);
    },
    []
  );

  const handleNegotiationIncoming = useCallback(
    async (data: { from: string; offer: RTCSessionDescriptionInit }) => {
      console.log("Negotiation needed from ", data.from);

      const answer = await peerServiceInstance.getAnswer(data.offer);
      socket.emit("peer:nego:done", { to: data.from, answer: answer });
    },
    [socket]
  );

  const handleNegotiationFinal = useCallback(
    async (data: { from: string; answer: RTCSessionDescriptionInit }) => {
      console.log("Negotiation final from ", data.from);
      peerServiceInstance.setLocalDescription(data.answer);
    },
    []
  );

  useEffect(() => {
    socket.on("incomming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegotiationIncoming);
    socket.on("peer:nego:final", handleNegotiationFinal);
    return () => {
      socket.off("incomming:call", handleIncomingCall);
      socket?.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegotiationIncoming);
      socket.off("peer:nego:final", handleNegotiationFinal);
    };
  }, [
    handleCallAccepted,
    handleIncomingCall,
    handleNegotiationFinal,
    handleNegotiationIncoming,
    socket,
  ]);

  const [status, setStatus] = useState("Not Connected");

  useEffect(() => {
    // Update status based on the connection state
    const updateStatus = () => {
      if (!peerServiceInstance.peer) {
        setStatus("Peer connection not initialized");
        return;
      }
      switch (peerServiceInstance.peer.connectionState) {
        case "new":
          setStatus("Starting connection...");
          break;
        case "connecting":
          setStatus("Connecting...");
          break;
        case "connected":
          setStatus("Connected");
          break;
        case "disconnected":
          setStatus("Disconnected");
          break;
        case "failed":
          setStatus("Connection failed");
          break;
        case "closed":
          setStatus("Connection closed");
          break;
        default:
          setStatus("Unknown status");
      }
    };

    // Attach event listener for connection state change
    if (peerServiceInstance.peer) {
      peerServiceInstance.peer.addEventListener(
        "connectionstatechange",
        updateStatus
      );
    }

    // Cleanup on component unmount
    return () => {
      if (peerServiceInstance.peer) {
        peerServiceInstance.peer.removeEventListener(
          "connectionstatechange",
          updateStatus
        );
      }
    };
  }, []);

  //------------------------------------------
  //           my audio
  //-------------------------------------------
  // const [myMediaStream, setmyMediaStream] = useState<MediaStream | null>(null);
  const [remoteMediaStream, setremoteMediaStream] =
    useState<MediaStream | null>(null);

  const addMediaStream = useCallback(async () => {
    // Start capturing the media stream
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    // setmyMediaStream(stream);
    // console.log("Added");

    // Add the tracks from the stream to the existing peer connection
    for (const track of stream.getTracks()) {
      if (peerServiceInstance.peer) {
        peerServiceInstance.peer.addTrack(track, stream);
      }
    }
  }, []);

  //------------------------------------------
  //           remote audio handle
  //-------------------------------------------
  const handleGetRemoteDataStream = useCallback((event: RTCTrackEvent) => {
    const remotestream = event.streams[0];
    console.log("remote audio ", remotestream);
    setremoteMediaStream(remotestream);
  }, []);

  useEffect(() => {
    // Add the track event listener to get the remote stream
    if (peerServiceInstance.peer) {
      peerServiceInstance.peer.addEventListener(
        "track",
        handleGetRemoteDataStream
      );
    }

    return () => {
      if (peerServiceInstance.peer) {
        peerServiceInstance.peer.removeEventListener(
          "track",
          handleGetRemoteDataStream
        );
      }
    };
  }, [handleGetRemoteDataStream]);

  useEffect(() => {
    // Connect the remote stream to the audio element whenever it changes
    const audioElement = document.getElementById(
      "remoteAudio"
    ) as HTMLAudioElement;
    if (audioElement && remoteMediaStream) {
      audioElement.srcObject = remoteMediaStream;
      audioElement.play();
    }
  }, [remoteMediaStream]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          {/* Remote audio playback */}
          <audio id="remoteAudio" autoPlay playsInline controls />
          {/* Player's avatar */}
          <div className="flex items-center space-x-2">
            <Avatar className="w-16 h-16 ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-900">
              <AvatarImage
                src="/placeholder.svg?height=64&width=64"
                alt="Player"
              />
              <AvatarFallback>PL</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold">You</p>
              <p className="font-bold">{userScore}</p>

              {isOurMicOn ? (
                <div
                  onClick={() => {
                    setIsOurMicOn(false);
                  }}
                >
                  <Mic className="w-5 h-5 inline-block text-green-400" />
                </div>
              ) : (
                <div
                  onClick={() => {
                    setIsOurMicOn(true);
                  }}
                >
                  <MicOff className="w-5 h-5 inline-block text-red-400" />7
                </div>
              )}
            </div>
          </div>

          <p>Status: {status}</p>
          <button onClick={() => callUser()}> call</button>
          <button
            className="btn bg-blue-300"
            onClick={() => {
              addMediaStream();
            }}
          >
            {" "}
            on mic{" "}
          </button>

          {/* Opponent's avatar */}
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="font-bold">Opponent</p>
              <p className="font-bold">{opponentScore}</p>
              {isOpponentMicOn ? (
                <div
                  onClick={() => {
                    setIsOpponentMicOn(false);
                  }}
                >
                  <Mic className="w-5 h-5 inline-block text-green-400" />
                </div>
              ) : (
                <div
                  onClick={() => {
                    setIsOpponentMicOn(true);
                  }}
                >
                  <MicOff className="w-5 h-5 inline-block text-red-400" />
                </div>
              )}
            </div>
            <Avatar className="w-16 h-16 ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-900">
              <AvatarImage
                src="/placeholder.svg?height=64&width=64"
                alt="Opponent"
              />
              <AvatarFallback>OP</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* --------------- */}
        {/* Main game area */}
        <Card className="bg-gray-800 border-gray-700 shadow-xl backdrop-blur-sm bg-opacity-80">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-4 text-white">
                {gameQuestions[currentQuestionIndex]?.question}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {gameQuestions[currentQuestionIndex]?.options.map(
                  (option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="py-8 text-lg font-semibold bg-gray-700 hover:bg-blue-600 transition-colors duration-300"
                      onClick={() => handleAnswerSubmit(index)}
                      disabled={userAnswered}
                    >
                      {option}
                    </Button>
                  )
                )}
              </div>
            </div>
            <div className="flex justify-center items-center space-x-4">
              <div className="text-3xl font-bold text-blue-400">
                {timeLeft}s
              </div>
              {isTimeStopped ? (
                <Button
                  onClick={handleResumeTimer}
                  className="bg-green-600 hover:bg-green-700 transition-colors duration-300"
                >
                  Resume Timer
                </Button>
              ) : (
                <Button
                  onClick={handleStopTimer}
                  disabled={userStoppedTimer}
                  className={`${
                    userStoppedTimer
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  } transition-colors duration-300`}
                >
                  {userStoppedTimer ? "Waiting for opponent" : "Stop Timer"}
                </Button>
              )}
            </div>
            {userAnswered && !opponentAnswered && (
              <div className="mt-4 text-center text-yellow-400">
                Waiting for opponent to answer...
              </div>
            )}
            {answerTime !== null && (
              <div className="mt-4 text-center text-green-400">
                You answered in {answerTime} seconds!
              </div>
            )}
          </CardContent>
        </Card>

        {/* --------------- */}

        {/* Controls */}
        <div className="mt-6 flex justify-end space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="bg-gray-700 hover:bg-gray-600"
              >
                <Smile className="w-6 h-6" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-gray-800 border-gray-700">
              <div className="flex space-x-2">
                {reactions.map((reaction, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="p-2"
                    title={reaction.label}
                  >
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
                  <DialogTitle className="text-2xl font-bold text-white">
                    Chat
                  </DialogTitle>
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
                        msg.sender_uname === socketProvider?.myUserName
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      <span
                        className={`inline-block p-2 rounded-lg ${
                          msg.sender_uname === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-600 text-gray-100"
                        }`}
                      >
                        {msg.message}
                      </span>
                    </motion.div>
                  ))}
                  {/* Scroll anchor */}
                  <div ref={chatEndRef} />
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
  );
}
