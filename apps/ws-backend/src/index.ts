import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
const wss = new WebSocketServer({ port: 8080 });

interface usersType {
  ws: WebSocket;
  userId: string;
  rooms: string[];
}
const users: usersType[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch (e) {
    return null;
  }
}

wss.on("connection", function connection(ws, req) {
  // Create a URL object with a base URL (required if req.url is relative)
  const url = req.url;
  if (!url) {
    console.log("url not provided");
    return;
  }
  const searchParams = new URLSearchParams(url?.split("?")[1]);
  // Get query parameters using searchParams
  const token = searchParams.get("token") || "";
  const userId = checkUser(token);
  if (!userId || userId === null) {
    ws.close();
    return null;
  }
  //we have userId
  users.push({
    ws,
    userId,
    rooms: [],
  });
  ws.on("message", function message(data) {
    const parsedData = JSON.parse(data as unknown as string)
    if (parsedData.type === "join_room") {
      const user = users.find(x => x.ws === ws)
        user?.rooms.push(parsedData.roomId)
    }
    if (parsedData.type === "leave_room"){
      const user = users.find(x => x.ws === ws)
      if(!user ){
        return
      }
      user.rooms = user?.rooms.filter(x => x === parsedData.roomId)
    }
  });
});
