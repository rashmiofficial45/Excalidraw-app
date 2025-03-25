import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./config";
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws, req) {
  // // Create a URL object with a base URL (required if req.url is relative)
  // const url = req.url;
  // if (!url) {
  //   console.log("url not provided");
  //   return;
  // }
  // const searchParams = new URLSearchParams(url?.split("?")[1]);
  // // Get query parameters using searchParams
  // const token = searchParams.get("token") || "";
  // const validUser = jwt.verify(token, JWT_SECRET);
  // if (!validUser || !(validUser as JwtPayload).userId)
  // {
  //   console.log("Invalid user")
  //   ws.close()
  //   return
  // }
  ws.on("message", function message(data) {
    ws.send("pong");
  });
});
