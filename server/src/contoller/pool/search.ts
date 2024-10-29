import { PrismaClient } from '@prisma/client';
import express, { Request, RequestHandler, Response } from 'express';
import { ApiResponse, createResponse } from '../../utils/response';

const prisma = new PrismaClient();


interface CustomRequest extends Request {
  user: {
    userId: string;
  };
}

export const findOpponent: RequestHandler<unknown, ApiResponse, any, unknown> = async (req, res) => {
  try {
    const customReq = req as CustomRequest;
    const userId = customReq.user?.userId;

    if (!userId) {
      res.status(401).json(createResponse(false, 'User is not authenticated', null));
      return
    }

    // Fetch a random user from the Pool table
    const randomUser = await prisma.pool.findFirst({
      where: {
        userId: {
          not: userId  // Exclude the current user
        }
      },
      orderBy: {
        id: 'asc'
      },
      take: 1
    });

    if (!randomUser) {
      res.status(404).json(createResponse(false, 'No user found in the pool', null));
      return
    }

    // Add entry to GameMapping table
    const newGameMapping = await prisma.gameMapping.create({
      data: {
        player1Id: randomUser.id,
        player2Id: userId, // The authenticated user becomes player 2
        player1Total: 0,
        player2Total: 0,
        player1Scores: [],
        player2Scores: [],
        currentRound: 1,
        player1WantStop: false,
        player2WantStop: false,
        player1Ready: false,
        player2Ready: false,
        isCompleted: false,
      }
    });

    // Delete both users from the Pool table
    await prisma.pool.deleteMany({
      where: {
        OR: [
          { userId: randomUser.userId },
          { userId }
        ]
      }
    });

    res.status(201).json(createResponse(true, 'Game mapping created successfully', newGameMapping));
  } catch (error) {
    console.error('Error in findOpponent:', error);
    res.status(500).json(createResponse(false, 'Internal server error', (error as Error).message));
  }
};
