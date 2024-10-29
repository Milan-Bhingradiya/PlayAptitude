import { Request, RequestHandler, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ApiResponse, createResponse } from "../../utils/response";

const prisma = new PrismaClient();

interface CustomRequest extends Request {
  user: {
    userName: string; // Assuming the user's username is available in the request
  };
}

export const addGameHistory: RequestHandler<unknown, ApiResponse, {
  player2Username: string;
  player1Total: number;
  player2Total: number;
  player1Scores: number[];
  player2Scores: number[];
}, unknown> = async (req, res) => {
  try {
    const customReq = req as CustomRequest;
    const player1Username = customReq.user.userName; // Extract the username from the request
    const { player2Username, player1Total, player2Total, player1Scores, player2Scores } = req.body;

    // Validate required fields
    if (!player1Username) {
      res.status(400).json(createResponse(false, "Missing player 1 username", null));
      return
    }

    if (!player2Username) {
      res.status(400).json(createResponse(false, "Missing player 2 username", null));
      return
    }

    if (player1Total === undefined) {
      res.status(400).json(createResponse(false, "Missing player 1 total score", null));
      return
    }

    if (player2Total === undefined) {
      res.status(400).json(createResponse(false, "Missing player 2 total score", null));
      return
    }

    if (!Array.isArray(player1Scores)) {
      res.status(400).json(createResponse(false, "Player 1 scores must be an array", null));
      return
    }

    if (!Array.isArray(player2Scores)) {
      res.status(400).json(createResponse(false, "Player 2 scores must be an array", null));
      return
    }

    // Check if both players exist
    const player1Exists = await prisma.user.findUnique({
      where: { username: player1Username },
    });
    const player2Exists = await prisma.user.findUnique({
      where: { username: player2Username },
    });

    if (!player1Exists || !player2Exists) {
      res.status(404).json(createResponse(false, "One or both players not found", null));
      return
    }

    // Determine the winner based on scores
    let winner: string | null = null;
    if (player1Total > player2Total) {
      winner = player1Username;
    } else if (player2Total > player1Total) {
      winner = player2Username;
    }

    // Create a new GameHistory record
    const newGameHistory = await prisma.gameHistory.create({
      data: {
        player1Username,
        player2Username,
        player1Total,
        player2Total,
        player1Scores,
        player2Scores,
        winner, // Assign the winner determined by the logic
      },
    });


    res.status(201).json(createResponse(true, "Game history added successfully", newGameHistory));
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json(createResponse(false, "Internal server error", errorMessage));
  }
};


