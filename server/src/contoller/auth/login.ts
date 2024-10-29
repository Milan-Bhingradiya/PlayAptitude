import { Request, RequestHandler, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../../utils/prisma_connected";
import { ApiResponse, createResponse } from "../../utils/response";
import { generateToken } from "../../utils/jwt";

interface req {
  username: string;
  password: string;
}

export const login: RequestHandler<unknown, ApiResponse, req, unknown> = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json(createResponse(false, "email and password are both required", null));
      return
    }

    if (password.toString().length < 6) {
      res.status(400).json(createResponse(false, "Password must be atleast 6 characters long", null));
      return
    }


    const user = await prisma.user.findUnique({
      where: { username: username.toString() }
    });

    if (!user) {
      res.status(404).json(createResponse(false, " credentials not found", null));
      return
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json(createResponse(false, "Invalid password", null));
      return
    }

    const token = generateToken(user.username.toString());

    res.status(200).json(createResponse(true, "Login successful", { token }));
    return
  } catch (error) {
    console.error(error);
    res.status(500).json(createResponse(false, (error as Error).message, null));
    return
  }
};
