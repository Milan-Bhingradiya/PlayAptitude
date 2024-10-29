import { Request, RequestHandler, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ApiResponse, createResponse } from "../../utils/response";

const prisma = new PrismaClient();
// Controller to list top 5 users with the most game wins
// export const listTopPlayers: RequestHandler<{}, ApiResponse> = async (req, res) => {
//   try {
//     // Get top 5 users with the most game wins
//     const topUsers = await prisma.$queryRaw`
//       SELECT username, COUNT(*) as num_of_games_won 
//       FROM (
//         SELECT player1Username AS username 
//         FROM "GameHistory" 
//         WHERE player1Total > player2Total
//         UNION ALL
//         SELECT player2Username AS username 
//         FROM "GameHistory" 
//         WHERE player2Total > player1Total
//       ) AS wins
//       GROUP BY username 
//       ORDER BY num_of_games_won DESC 
//       LIMIT 5;
//     `;

//     const formattedResponse = (topUsers as { username: string; num_of_games_won: number }[]).map((user) => ({
//       username: user.username,
//       num_of_games_won: user.num_of_games_won,
//     }));

//     res.status(200).json(createResponse(true, "Top 5 users with the most game wins fetched successfully", formattedResponse));
//   } catch (error) {
//     res.status(500).json(createResponse(false, "Internal server error", (error as Error).message));
//   }
// };


export const listTopPlayers: RequestHandler<{}, ApiResponse> = async (req, res) => {
  try {
    // Count wins for players based on the winner field
    const winners = await prisma.gameHistory.groupBy({
      by: ['winner'],
      _count: {
        winner: true, // Count how many times each user has won
      },
      where: {
        winner: {
          not: null, // Ensure we only count games where there is a winner
        },
      },
    });

    // Map to store the results
    const winCounts = winners.map(({ winner, _count }) => ({
      username: winner,
      num_of_games_won: _count.winner,
    }));

    // Sort the users by number of games won in descending order
    const sortedWinCounts = winCounts.sort((a, b) => b.num_of_games_won - a.num_of_games_won);

    // Add rank to each user
    const top5UsersWithRank = sortedWinCounts.slice(0, 5).map((user, index) => ({
      rank: index + 1, // Assign rank based on index
      username: user.username,
      num_of_games_won: user.num_of_games_won,
    }));

    res.status(200).json(createResponse(true, "Top 5 users with the most game wins fetched successfully", top5UsersWithRank));
  } catch (error) {
    res.status(500).json(createResponse(false, "Internal server error", (error as Error).message));
  }
};
