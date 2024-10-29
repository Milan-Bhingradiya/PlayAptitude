"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import cookie from "js-cookie";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Trophy,
  Brain,
  Settings,
  User,
  Users,
  PersonStanding,
  Loader2,
} from "lucide-react";
import { listTopPlayersReponse, recentGame, topPlayer } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { socketContext, useSocket } from "@/providers/SocketContext";
import { listNGameHistory, listTopPlayers } from "@/lib/interactions/dataGeter";
import Link from "next/link";
import { todo } from "node:test";
export default function Page() {
  const router = useRouter();
  const socket = useSocket();

  const [userStats, setUserStats] = useState({
    username: "AptitudeAce",
    level: 15,
    totalGames: 150,
    winRate: 68,
  });

  // const leaderboard = [
  //   { rank: 1, username: "MindMaster", score: 2500 },
  //   { rank: 2, username: "QuizChamp", score: 2450 },
  //   { rank: 3, username: "BrainiacSupreme", score: 2400 },
  // ];

  const [isSearching, setIsSearching] = useState(false);
  const [recentGames, setrecentGames] = useState<recentGame[]>([]);

  const [leaderboard, setleaderboard] = useState<topPlayer[]>([]);

  const [opponentAvatar, setOpponentAvatar] = useState(
    "/placeholder.svg?height=80&width=80"
  );

  // const {
  //   // isPending: isPending_insertUserInPool,
  //   mutate: mutate_insertUserInPool,
  // } = useMutation({
  //   mutationFn: insertUserInPool,
  //   onSuccess: (data: insertIntoPoolResponse) => {
  //     if (data.success) {
  //       alert("User inserted into pool");
  //     } else {
  //       alert("Error: " + data.message);
  //     }
  //   },
  //   onError: (error) => {
  //     isSearching(false);
  //     alert("Error: " + error.message);
  //   },
  // });

  // const {
  //   // isPending: isPending_deleteUserFromPool,
  //   mutate: mutate_deleteUserFromPool,
  // } = useMutation({
  //   mutationFn: deleteUserFromPool,
  //   onSuccess: (data: null) => {
  //     if (data.success) {
  //       alert("User deleted from pool");
  //     } else {
  //       alert("Error: " + data.message);
  //     }
  //   },
  //   onError: (error) => {
  //     alert("Error: " + error.message);
  //   },
  // });

  // const { mutate: mutate_findOpponent } = useMutation({
  //   mutationFn: findOpponent,
  //   onSuccess: (data: GameMappingResponse) => {
  //     if (data.success) {
  //       clearInterval(pollingInterval!); // Stop polling
  //       alert("Opponent found");
  //     } else {
  //       // alert("Error: " + data.message);
  //       console.log("Error: " + data.message);
  //     }
  //   },
  //   onError: (error) => {
  //     alert("Error: " + error.message);
  //   },
  // });

  //---------------------------------------------------TITLE:title-----------------------------------------------------------------------//

  const webSocket_dataprovider = useContext(socketContext);
  const [is_opponent_found, setis_opponent_found] = useState(false);
  // useEffect(() => {
  //   if (isSearching) {
  //     const interval = setInterval(() => {
  //       setOpponentAvatar(
  //         `/placeholder.svg?height=80&width=80&text=${Math.random()
  //           .toString(36)
  //           .substr(2, 5)}`
  //       );
  //     }, 200);
  //     return () => clearInterval(interval);
  //   }
  // }, [isSearching]);
  // const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(
  //   null
  // );

  // useEffect(() => {
  //   if (isSearching) {
  //     const interval = setInterval(() => {
  //       // Update opponent avatar placeholder animation
  //       setOpponentAvatar(
  //         `/placeholder.svg?height=80&width=80&text=${Math.random()
  //           .toString(36)
  //           .substr(2, 5)}`
  //       );
  //       // Poll for opponent every 2 seconds
  //       mutate_findOpponent();
  //     }, 2000); // Poll every 2 seconds
  //     setPollingInterval(interval);

  //     return () => clearInterval(interval);
  //   }
  // }, [isSearching]);

  useEffect(() => {
    const handleGameStart = (data: { userName: string; socketId: string }) => {
      webSocket_dataprovider?.set_opponent_socketId(data.socketId);
      webSocket_dataprovider?.setopponent_userName(data.userName);
      setis_opponent_found(true);
      setTimeout(() => {
        router.push("/game");
      }, 3000);
    };

    socket.on("started_game", handleGameStart);

    // Cleanup on unmount
    return () => {
      socket.off("started_game", handleGameStart);
    };
  }, [router, socket, webSocket_dataprovider]);

  const handleClick = () => {
    setIsSearching(true);
    const token = cookie.get("userToken");
    if (token) {
      socket.emit("user_join_pool", { jwt: token });
    } else {
      alert("User token is not available.");
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["listNGameHistory"],
    queryFn: () => listNGameHistory(5),
  });

  // Fetch top players
  const { data: dataOfTopPlayers, isLoading: isLoading2 } = useQuery<
    listTopPlayersReponse,
    Error
  >({
    queryKey: ["listTopPlayers"],
    queryFn: () => listTopPlayers(), // Ensure this returns ListTopPlayersResponse
  });

  useEffect(() => {
    if (data) {
      setrecentGames(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (dataOfTopPlayers) {
      setleaderboard(
        dataOfTopPlayers.data.map((player, index) => ({
          rank: index + 1,
          ...player,
        }))
      );
    }
  }, [dataOfTopPlayers]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Avatar className="w-20 h-20 ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-900">
              <AvatarImage
                src="/placeholder.svg?height=80&width=80"
                alt={userStats.username}
              />
              <AvatarFallback className="bg-gray-700">
                {userStats.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-3xl font-bold text-white">
                {userStats.username}
              </h2>
              <p className="text-lg text-blue-300">Level {userStats.level}</p>
            </div>
          </div>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white border-gray-700 px-4 py-2 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(0,0,255,0.5)]"
              onClick={() => {
                router.push("/profile");
              }}
            >
              <User className="w-5 h-5" />
              <span className="text-sm md:text-base">Profile</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white border-gray-700 px-4 py-2 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(0,0,255,0.5)]"
              onClick={() => {
                setIsSidebarOpen(true);
              }}
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm md:text-base">Settings</span>
            </Button>
          </div>
        </header>

        <div className="bg-gray-800 rounded-lg p-4 shadow-lg mb-8 backdrop-blur-sm bg-opacity-80">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-lg text-blue-300">Total Games</p>
              <p className="text-2xl font-bold text-white">
                {userStats.totalGames}
              </p>
            </div>
            <div>
              <p className="text-lg text-blue-300">Win Rate</p>
              <p className="text-2xl font-bold text-white">
                {userStats.winRate}%
              </p>
            </div>
          </div>
        </div>

        <main className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              className="py-8 text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg rounded-lg relative overflow-hidden group"
              // onClick={() => {

              //   setIsSearching(true);
              //   // mutate_insertUserInPool();
              //   socket.emit("user_join_pool", {
              //     jwt: cookie.get("userToken"),
              //   });
              //   socket.on("started_game", (data) => {
              //     webSocket_dataprovider?.set_opponent_socketId(data.socket);
              //     webSocket_dataprovider?.setopponent_userId(data.userName);
              //     setis_opponent_found(true);
              //     setTimeout(() => {
              //       router.push("/game");
              //     }, 3000);
              //     // alert(` oppponent matched ${data.userId}`);
              //   });
              // }}
              onClick={handleClick}
            >
              <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <Users className="w-8 h-8 mr-2" />
              Play 1-on-1 Game
            </Button>
            {/* <Button className="py-8 text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg rounded-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <PersonStanding className="w-8 h-8 mr-2" />
              Play Single Game
            </Button> */}
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
                  {(recentGames.length == 0 || !recentGames) && (
                    <li className="flex justify-between items-center bg-grey-700 text-white p-3 rounded-lg">
                      No data available
                    </li>
                  )}
                  {recentGames.map((game, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center bg-gray-700 p-3 rounded-lg"
                    >
                      <div>
                        <span className="text-lg">{game.opponent}</span>
                        <span className="text-sm text-blue-300 ml-2">
                          ({game.mode})
                        </span>
                      </div>
                      <span
                        className={`text-lg font-bold ${
                          game.result === "Won"
                            ? "text-green-400"
                            : game.result === "Lost"
                            ? "text-red-400"
                            : "text-yellow-400"
                        }`}
                      >
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
                  {leaderboard.length == 0 && (
                    <li className="flex justify-between items-center bg-grey-700 text-white p-3 rounded-lg">
                      No data available
                    </li>
                  )}
                  {leaderboard.map((player) => (
                    <li
                      key={player.rank}
                      className="flex justify-between items-center bg-gray-700 p-3 rounded-lg"
                    >
                      <span className="text-lg">
                        {player.rank}. {player.username}
                      </span>
                      <span className="text-lg font-bold text-yellow-400">
                        {player.num_of_games_won}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 z-40 bg-gray-800 p-4 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Settings</h3>
          <Button variant="ghost" onClick={() => setIsSidebarOpen(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Button>
        </div>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                href="/account-settings"
                className="block py-2 px-4 text-gray-300 hover:bg-gray-700 rounded"
              >
                Account Settings
              </Link>
            </li>
            <li>
              <Link
                href="/privacy-settings"
                className="block py-2 px-4 text-gray-300 hover:bg-gray-700 rounded"
              >
                Privacy Settings
              </Link>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-gray-700"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </li>
          </ul>
        </nav>
      </div>
      {/*  */}

      <Dialog open={isSearching}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 shadow-[0_0_50px_rgba(0,0,255,0.3)]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-4">
              Searching for Opponent
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center justify-center space-x-8">
              <Avatar className="w-24 h-24 ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-800">
                <AvatarImage
                  src="/placeholder.svg?height=96&width=96"
                  alt={userStats.username}
                />
                <AvatarFallback className="bg-gray-700 text-2xl">
                  {userStats.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-4xl font-bold text-blue-400">VS</div>
              <Avatar className="w-24 h-24 ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-800 animate-pulse">
                <AvatarImage src={opponentAvatar} alt="Searching" />
                <AvatarFallback className="bg-gray-700 text-2xl">
                  ??
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-center space-x-2">
              {!is_opponent_found && (
                <div className="flex flex-row gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                  <span className="text-lg">Finding a worthy opponent...</span>
                </div>
              )}
              {is_opponent_found && (
                <span className="text-lg">
                  Match start with{" "}
                  {webSocket_dataprovider?.opponent_userName + " "}
                  in 3 second
                </span>
              )}
            </div>
            <Button
              onClick={() => {
                setIsSearching(false);
                // mutate_deleteUserFromPool();
                socket.emit("user_leave_pool", {
                  jwt: cookie.get("userToken"),
                });
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-all duration-300"
            >
              Cancel Search
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
