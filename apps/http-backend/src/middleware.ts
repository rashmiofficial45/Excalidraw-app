import { NextFunction, Response, Request, Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
export function Middleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"] ?? "";
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    //@ts-ignore Note: We need to fix the below error By adding the types of the req object
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).send({ message: "Unauthorized" });
  }
}