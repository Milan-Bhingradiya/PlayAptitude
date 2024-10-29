import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export const generateToken = (userName: any): string => {
  return jwt.sign({ userName }, JWT_SECRET, {
    expiresIn: "24h",
  });
};

// Middleware to verify a JWT
export const verifyToken = (req: any, res: any, next: any) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};


export const jwt_to_id = (token: string) => {
  if (!token) {
    console.log("token not provided");
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("decoded", decoded);
    return (decoded as jwt.JwtPayload).userName;
  } catch (error) {
    console.log("Invalid token.");
  }
};
