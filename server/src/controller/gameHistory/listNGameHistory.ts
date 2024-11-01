import { Request, RequestHandler, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ApiResponse, createResponse } from "../../utils/response";

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user: {
    userName: string; // assuming `id` is in the JWT payload
    // Add other fields as needed
  };
}

// Controller to list game history by username and limit `n`
export const listNGameHistory: RequestHandler<{ n: string }, ApiResponse, ApiResponse, AuthenticatedRequest, any> = async (req, res) => {
  try {
    const { n } = req.params;
    const username = (req as any).user?.userName;
    const limit = parseInt(n, 10);

    if (isNaN(limit) || limit <= 0) {
      res.status(400).json(createResponse(false, "Invalid limit parameter", null));
      return;
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { username },
    });

    if (!userExists) {
      res.status(404).json(createResponse(false, "User not found", null));
      return;
    }

    // Fetch game history for the user
    const gameHistory = await prisma.gameHistory.findMany({
      where: {
        OR: [
          { player1Username: username },
          { player2Username: username },
        ],
      },
      take: limit,
      orderBy: { playedAt: "desc" },
    });


    // { opponent: "BrainWizard", result: "Won", score: "7-5", mode: "1v1" },
    // { opponent: "QuizMaster", result: "Lost", score: "4-6", mode: "1v1" },

    const gameHistoryResponse = gameHistory.map((game) => {
      const i_am_player1_or_player2 = game.player1Username === username ? "player1" : "player2";
      const opponent = game.player1Username === username ? game.player2Username : game.player1Username;
      const result = (i_am_player1_or_player2 == "player1") ? game.player1Total > game.player2Total ? "Won" : "Lost" : game.player2Total > game.player1Total ? "Won" : "Lost";
      const score = `${game.player1Total}-${game.player2Total}`;
      const mode = "1v1";

      return { opponent, result, score, mode };

    })
    console.log(gameHistoryResponse);

    res.status(200).json(createResponse(true, "Game history fetched successfully", gameHistoryResponse));
  } catch (error) {
    res.status(500).json(createResponse(false, "Internal server error", (error as Error).message));
  }
};
