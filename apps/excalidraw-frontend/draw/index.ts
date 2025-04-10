import axios from "axios";
import { BACKEND_URL } from "../lib/config";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      x: number;
      y: number;
      radius: number;
      startAngle: number;
      endAngle: number;
    };

const DrawInit = async (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  roomId: number,
  socket: WebSocket
) => {
  let existingShape: Shape[] = await getExistingShape(roomId);

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(JSON.stringify(data));
    if (data.type === "chat") {
      existingShape.push(data.message);
      clearCanvas(ctx, existingShape, canvas);
    }
  };

  clearCanvas(ctx, existingShape, canvas);
  let isDrawing = false;
  let startX = 0;
  let startY = 0;

  const getMousePos = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: MouseEvent) => {
    const pos = getMousePos(e);
    startX = pos.x;
    startY = pos.y;
    isDrawing = true;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrawing) return;
    const pos = getMousePos(e);
    const width = pos.x - startX;
    const height = pos.y - startY;
    clearCanvas(ctx, existingShape, canvas);
    ctx.strokeStyle = "rgba(255, 255, 255)";
    ctx.strokeRect(startX, startY, width, height);
  };

  const handleMouseUp = (e: MouseEvent) => {
    isDrawing = false;
    const pos = getMousePos(e);
    const width = pos.x - startX;
    const height = pos.y - startY;
    const shape: Shape = {
      type: "rect",
      x: startX,
      y: startY,
      width,
      height,
    };
    existingShape.push(shape);
    clearCanvas(ctx, existingShape, canvas);
    socket.send(
      JSON.stringify({
        type: "chat",
        message: shape,
        roomId: Number(roomId),
      })
    );
  };

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mousemove", handleMouseMove);
};

function clearCanvas(
  ctx: CanvasRenderingContext2D,
  existingShape: Shape[],
  canvas: HTMLCanvasElement
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  existingShape.map((shape) => {
    if (shape.type === "rect") {
      ctx.strokeStyle = "rgba(255, 255, 255)";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
    // else if (shape.type === "circle") {
    //   ctx.beginPath();
    //   ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
    //   ctx.stroke();
    //   ctx.closePath();
    // }
  });
}

async function getExistingShape(roomId: number) {
  const res = await axios(`${BACKEND_URL}/chats/${roomId}`);
  const messages = res.data.Messages;

  const shapes = messages.map((x: { message: string }) => {
    const messageData = JSON.parse(x.message);
    return messageData;
  });
  return shapes;
}
export default DrawInit;
