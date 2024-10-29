import { Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { ApiResponse, createResponse } from "../../utils/response";



const prisma = new PrismaClient();
interface CustomRequest extends Request {
  user: {
    userId: string;
  };
}


export const insertIntoPool: RequestHandler<unknown, ApiResponse, unknown, unknown> = async (req, res) => {
  try {

    const customReq = req as CustomRequest;
    const userId = customReq.user?.userId;
    console.log(userId);
    console.log(userId);
    console.log(userId);
    console.log(userId);


    const ispool = await prisma.pool.findUnique({
      where: {
        userId,
      },
    });

    if (ispool) {
      res.status(400).json(createResponse(false, "Already in pool", null));
      return;
    }
    const newPoolEntry = await prisma.pool.create({
      data: {
        userId,
        interestedMode: "ok"
      },
    });

    res.status(201).json(createResponse(true, "success ", newPoolEntry));
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json(createResponse(false, "Internal server error", errorMessage));
  }
};