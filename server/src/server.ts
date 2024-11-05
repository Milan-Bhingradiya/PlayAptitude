import express, { urlencoded, json } from "express";
import app from "./app";
import { createServer } from "http"; // For creating an HTTP server
import { Server } from "socket.io";
import cors from "cors";
import { UniqueArray } from "./utils/util";
import { jwt_to_id } from "./utils/jwt";

import prisma from "./utils/prisma_connected";
const port = process.env.PORT || 8000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const userName_to_socketId = new Map();
const socketId_to_userName = new Map();
const pooluserName = new UniqueArray<string>();

const questions = [
  {
    question: "What 1 is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
  {
    question: "What 2 is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
  {
    question: "What 3 is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
  {
    question: "What 4 is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
  {
    question: "What 5 is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
  {
    question: "What 6 is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
  {
    question: "What 7 is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
  {
    question: "What 8 is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
  {
    question: "What 9 is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
  {
    question: "What 10 is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
];

// Handle socket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Example custom event listener
  socket.on("message", (data) => {
    console.log("Message received: ", data);
    // Broadcast to all clients
    io.emit("message", data);
  });

  //------------------------------------------
  //           user_join_pool
  //-------------------------------------------
  socket.on("user_join_pool", async (data) => {
    const username = jwt_to_id(data.jwt);
    console.log(`user_join_pool`, username);
    console.log("user_join_pool", username);

    const data2 = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        username: true,
      },
    });

    const userName = data2?.username;
    userName_to_socketId.set(userName, socket.id);
    socketId_to_userName.set(socket.id, userName);

    pooluserName.add(userName!.toString());
    // get random userId from map
    console.log("nes user joinPool ", userName, " ", pooluserName.size());
    if (pooluserName.size() > 1) {
      const randomIndex = Math.floor(Math.random() * pooluserName.size());

      let randomUserName = pooluserName.get(randomIndex);

      // Ensure randomUserName is not the same as userName
      if (randomUserName === userName!.toString()) {
        // If it is, get the next user in the map
        const userNames = Array.from(userName_to_socketId.keys());
        const nextIndex = (randomIndex + 1) % userNames.length;
        randomUserName = pooluserName.get(nextIndex);
      }

      if (randomUserName) {
        const randomSocketId = userName_to_socketId.get(randomUserName);
        if (randomSocketId) {
          // delete both users from map
          userName_to_socketId.delete(randomUserName);
          userName_to_socketId.delete(userName);
          // create game mapping
          pooluserName.remove(randomUserName);
          pooluserName.remove(userName!.toString());

          // start game
          io.to(randomSocketId).emit("started_game", {
            userName,
            socketId: socket.id,
            // false hatu
            webRtcInitiator: true,
          });

          // bijo join thay e chhe aa,(bijo(opponent) chhe em lagse nay code joy ne but still it is...)
          // but aya na perpective thi aj first player lagse..
          // why this is second  because this join when pool >1
          io.to(socket.id).emit("started_game", {
            userName: randomUserName,
            socketId: randomSocketId,
            webRtcInitiator: true,
          });

          // send 1st que
          // Send questions to both players
          console.log(
            "send questions to both players",
            randomSocketId,
            socket.id
          );
          setTimeout(() => {
            io.to(randomSocketId).emit("questions_received", questions);
            io.to(socket.id).emit("questions_received", questions);
          }, 5000);
        }
      }
    }
  });

  //------------------------------------------
  //           user_leave_pool
  //-------------------------------------------
  socket.on("user_leave_pool", (data) => {
    console.log("remove user from pool", `${data.jwt}`);
    const userName = jwt_to_id(data.jwt);
    console.log("remove user from pool", userName);
    console.log("remove user from pool", userName);
    // userName_to_socketId.delete(userName);
    pooluserName.remove(userName?.toString());
  });

  //------------------------------------------
  //           time_stop
  //-------------------------------------------
  socket.on("time_stop", (data) => {
    console.log("time stop", data);
    io.to(data.to_socketId).emit("time_stop", { message: "time stop" });
  });

  //------------------------------------------
  //           stop_timer
  //-------------------------------------------
  socket.on("stop_timer", (data) => {
    console.log("stop timer", data);

    if (data.opponent_sid) {
      io.to(data.opponent_sid).emit("opponent_stopped_timer");
    }
  });

  //------------------------------------------
  //           both_players_stopped_timer
  //-------------------------------------------
  socket.on("both_players_stopped_timer", (data) => {
    console.log("both_players_stopped_timer", data);

    // data.socketId is opponent Socket id

    if (data.opponent_sid) {
      io.to(socket.id).emit("timer_stopped");
      io.to(data.opponent_sid).emit("timer_stopped");
    }
  });

  //------------------------------------------
  //           resume_timer
  //-------------------------------------------
  socket.on("resume_timer", (data) => {
    console.log("resume_timer");
    if (data.opponent_sid) {
      io.to(socket.id).emit("timer_resumed");
      io.to(data.opponent_sid).emit("timer_resumed");
    }
  });

  //------------------------------------------
  //           answer_submitted
  //-------------------------------------------
  socket.on(
    "answer_submitted",
    (data: { score: number; timeSpent: number; opponent_sid: string }) => {
      console.log("answer_submitted", data);

      if (data.opponent_sid) {
        // console.log("opponent_score_submitted", data);
        io.to(data.opponent_sid).emit("opponent_score_update", data.score);
        io.to(data.opponent_sid).emit("opponent_answered");
      }
    }
  );

  //------------------------------------------
  //           game_over
  //-------------------------------------------
  socket.on("game_over", (finalScore: number) => {
    // console.log("game_over", finalScore);
    // const opponentSocketId = getOpponentSocketId(socket.id);
    // if (opponentSocketId) {
    //   io.to(opponentSocketId).emit("game_over", finalScore);
    //   // Here you could implement logic to determine the winner and update user stats
    // }
  });

  interface ChatMessageData {
    sender_uname: string;
    message: string;
    time: number;
    opponent_sid: string;
  }

  //------------------------------------------
  //           send_message
  //-------------------------------------------
  socket.on("send_message", (data: ChatMessageData) => {
    console.log("send_message", data);
    if (data.opponent_sid) {
      io.to(data.opponent_sid).emit("receive_message", data);
    }
  });

  //------------------------------------------
  //           WEBRTC
  //-------------------------------------------

  socket.on("call:user", (data: { to: string; offer: any }) => {
    const { to, offer } = data;
    console.log("call-user:", data);

    // user 1 pase thi aya-aya thi icomming call to user 2
    setTimeout(() => {
      io.to(to).emit("incomming:call", { from: socket.id, offer });
    }, 1000);
  });

  socket.on(
    "call:accepted",
    (data: { to: string; answer: RTCSessionDescriptionInit }) => {
      const { to, answer } = data;
      console.log("call:accepted:", data);
      if (!answer || !answer.type || !answer.sdp) {
        console.error("Invalid answer received:", answer);
      }
      io.to(to).emit("call:accepted", { from: socket.id, answer });
    }
  );

  socket.on(
    "peer:nego:needed",
    (data: { to: string; offer: RTCIceCandidate }) => {
      const { to, offer } = data;
      console.log("peer:nego:needed:", data);
      io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    }
  );

  socket.on(
    "peer:nego:done",
    (data: { to: string; answer: RTCIceCandidate }) => {
      const { to, answer } = data;
      io.to(to).emit("peer:nego:final", { from: socket.id, answer });
    }
  );

  //------------------------------------------
  //           disconnect
  //-------------------------------------------
  socket.on("disconnect", () => {
    console.log("disconnect");
    const userId = socketId_to_userName.get(socket.id);
    if (userId) {
      userName_to_socketId.delete(userId);
    }
    socketId_to_userName.delete(socket.id);

    console.log("User disconnected");
  });
});

// Start the server
httpServer.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
