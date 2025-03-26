  import express from "express";
  import jwt from "jsonwebtoken";
  import { JWT_SECRET } from "@repo/backend-common/config";
  import { Middleware } from "./middleware";
  import {
    createUserSchema,
    signInSchema,
    createRoomSchema,
  } from "@repo/common/types";
  const app = express();

  app.post("/signup", (req, res) => {
    const data = createUserSchema.safeParse(req.body)
    if (!data.success) {
      res.status(401).json({
        message: "Invalid data",
        errors: data.error
      });
      return;
    }
    //DB call
    });

  app.post("/signin", (req, res) => {
    const data = signInSchema.safeParse(req.body);
    if (!data.success) {
      res.status(401).json({
        message: "Invalid data",
        errors: data.error,
      });
      return;
    }
    const userId = 1;
    const token = jwt.sign(
      {
        userId,
      },
      JWT_SECRET
    );
    res.send(token);
  });
  app.post("/room", Middleware, (req, res) => {
    const data = createRoomSchema.safeParse(req.body);
    if (!data.success) {
      res.status(401).json({
        message: "Invalid data",
        errors: data.error,
      });
      return;
    }
    //DB call
    res.send({
      roomId: 1212
    });
  });
  app.listen(3001, () => {
    console.log("Server is running on port 3001");
  });