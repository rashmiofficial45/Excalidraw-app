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

  app.listen(3001, () => {
    console.log("Server is running on port 3001");
  });
  app.post("/signup", (req, res) => {
    //DB call
    res.send("signup");
  });
  app.post("/signin", (req, res) => {
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
    //DB call
    res.send({
      roomId: 1212
    });
  });
