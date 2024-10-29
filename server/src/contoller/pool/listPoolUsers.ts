import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import { ApiResponse, createResponse } from "../../utils/response";

const prisma = new PrismaClient();

export const listPoolUsers: RequestHandler<unknown, ApiResponse, unknown, unknown> = async (req, res) => {
  try {
    // Fetch all users in the pool
    const poolUsers = await prisma.pool.findMany({
      select: {
        userId: true,
        interestedMode: true,  // Example, you can adjust this based on fields you want to return
      },
    });

    if (poolUsers.length === 0) {
      res.status(404).json(createResponse(false, "No users found in the pool", null));
      return
    }

    // Return the list of users
    res.status(200).json(createResponse(true, "Users retrieved successfully", poolUsers));
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json(createResponse(false, "Internal server error", errorMessage));
  }
};
