import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";
import { ApiResponse, createResponse } from "../../utils/response";

const prisma = new PrismaClient();

export const register: RequestHandler<unknown, ApiResponse, any, unknown> = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json(createResponse(false, "email and username and password are required.", null));
    return;
  }

  if (password.toString().length < 6) {
    res.status(400).json(createResponse(false, "Password must be at least 6 characters long", null));
    return;
  }

  try {
    const existingStudent = await prisma.user.findUnique({
      where: { username: username.toString() }
    });

    if (existingStudent) {
      res.status(400).json(createResponse(false, "username already exists.", null));
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = await prisma.user.create({
      data: {
        username: username.toString(),
        password: hashedPassword
      }
    });

    res.status(201).json(createResponse(true, "User registered successfully", newStudent));
  } catch (error) {
    res.status(500).json(createResponse(false, "Internal server error", null));
  }
};