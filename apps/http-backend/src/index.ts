import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import { Middleware } from "./middleware";
const app = express();

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
app.post("/signup", (req, res) => {
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
  res.send("signin");
});
app.post("/room", Middleware, (req, res) => {
  res.send("create-room");
});
