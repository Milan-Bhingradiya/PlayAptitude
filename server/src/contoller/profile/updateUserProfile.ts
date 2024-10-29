import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";
import { ApiResponse, createResponse } from "../../utils/response";

const prisma = new PrismaClient();

export const updateUserProfile: RequestHandler<unknown, ApiResponse, any, unknown> = async (req, res) => {

  const username = (req as any).user?.userName;
  const { img, bio, total_score, num_of_games_won, num_of_games_lost, password } = req.body;

  // Validate required fields
  if (!username) {
    res.status(400).json(createResponse(false, "Username is required.", null));
    return
  }

  // Optional: Validate password if provided (for security reasons)
  if (password && password.toString().length < 6) {
    res.status(400).json(createResponse(false, "Password must be at least 6 characters long", null));
    return
  }

  try {
    // Find existing user
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!existingUser) {
      res.status(404).json(createResponse(false, "User not found.", null));
      return
    }

    // Hash new password if provided
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { username },
      data: {
        img: img || existingUser.img, // Only update if a new value is provided
        bio: bio || existingUser.bio,
        total_score: total_score !== undefined ? total_score : existingUser.total_score,
        num_of_games_won: num_of_games_won !== undefined ? num_of_games_won : existingUser.num_of_games_won,
        num_of_games_lost: num_of_games_lost !== undefined ? num_of_games_lost : existingUser.num_of_games_lost,
        password: hashedPassword || existingUser.password, // Only update if a new password is provided
      },
    });

    res.status(200).json(createResponse(true, "User profile updated successfully", updatedUser));
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json(createResponse(false, "Internal server error", null));
  }
};
