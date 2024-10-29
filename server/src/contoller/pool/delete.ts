import { Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { ApiResponse, createResponse } from "../../utils/response";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

const prisma = new PrismaClient();

interface CustomRequest extends Request {
  user: {
    userId: string;
  };
}

export const deleteFromPool: RequestHandler<unknown, ApiResponse, any, unknown> = async (req, res) => {
  try {

    const customReq = req as CustomRequest;
    const userId = customReq.user?.userId;

    const ispool = await prisma.pool.findUnique({
      where: {
        userId,
      },
    });

    if (!ispool) {
      res.status(404).json(createResponse(false, "Not in pool", null));
      return;
    }

    await prisma.pool.delete({
      where: {
        userId,
      },
    });

    res.status(200).json(createResponse(true, "Successfully removed from pool", null));
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json(createResponse(false, "Internal server error", errorMessage));
  }
};