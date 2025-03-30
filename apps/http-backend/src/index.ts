import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { Middleware } from "./middleware.js";
import { prisma } from "@repo/db/client";
import {
  createUserSchema,
  signInSchema,
  createRoomSchema,
} from "@repo/common/types";
const app = express();

app.use(express.json());

//Signup endpoint
app.post("/signup", async (req, res) => {
  const parsedData = createUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(401).json({
      message: "Invalid data",
      errors: parsedData.error,
    });
    return;
  }
  const { name, username, password } = parsedData.data;
  //Note: hash the password before storing with bcrypt js
  try {
    const createdUser = await prisma.user.create({
      data: {
        name,
        email: username,
        password,
      },
    });
    if (createdUser) {
      res.json({
        userId: createdUser.id,
        message: "User Created Successfully",
      });
    }
  } catch (error) {
    res.status(411).json({ msg: "Unable to create new User" });
  }
});

//Signin endpoint
app.post("/signin", async (req, res) => {
  const parsedData = signInSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(401).json({
      message: "Invalid data",
      errors: parsedData.error,
    });
    return;
  }
  //Note: Compare hashed password
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: parsedData.data?.username,
        password: parsedData.data?.password,
      },
    });
    if (!user) {
      console.log("User not found.");
      throw new Error("user not found");
    }
    const userId = user.id;
    const token = jwt.sign(
      {
        userId,
      },
      JWT_SECRET
    );
    res.send(token);
  } catch (error) {
    res.status(411).json({ msg: "Unable to signIn" });
  }
});

//Create-room endpoint
app.post("/room", Middleware, async (req, res) => {
  const parsedData = createRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(401).json({
      message: "Invalid data",
      errors: parsedData.error,
    });
    return;
  }
  //@ts-ignore
  const userId = req.userId;
  try {
    const room = await prisma.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      },
    });
    res.send({
      roomId: room.id,
    });
  } catch (error) {
    res.status(411).json({ msg: "Room already exists with this name" });
  }
});

//chat history endpoint
app.get("/chats/:roomId",async (req, res) => {
  //Rate-limiting and fast
  const roomId = Number(req.params.roomId);
  if (!roomId) {
    res.status(401).json({
      message: "Invalid Room",
    });
    return;
  }
  try {
    const Messages = await prisma.chat.findMany({
      where:{
        roomId:roomId
      },
      orderBy:{
        id:"desc"
      },
      take:50
    });
    res.send({
      Messages: Messages,
    });
  } catch (error) {
    res.status(411).json({ msg: "Room not Exists with this Id" });
  }
});

//Server is running on 3001
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
