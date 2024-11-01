import { PrismaClient } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";
import { ApiResponse, createResponse } from "../../utils/response";

const prisma = new PrismaClient();

export const getUserProfile: RequestHandler<unknown, ApiResponse, any, unknown> = async (req, res) => {
  const username = (req as any).user?.userName; // Assuming the username is passed as a URL parameter


  // Validate required fields
  if (!username) {
    res.status(400).json(createResponse(false, "Username is required.", null));
    return
  }

  try {
    // Find the user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    // Check if the user exists
    if (!user) {
      res.status(404).json(createResponse(false, "User not found.", null));
      return
    }

    // Send the user profile data as the response
    res.status(200).json(createResponse(true, "User profile retrieved successfully", user));
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json(createResponse(false, "Internal server error", null));
  }
};
