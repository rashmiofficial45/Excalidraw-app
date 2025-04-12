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

/**
 * Initializes drawing logic and WebSocket behavior on the canvas.
 */
const DrawInit = async (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  roomId: number,
  socket: WebSocket
) => {
  // Fetch past shapes from server (persisted state)
  let existingShape: Shape[] = await getExistingShape(roomId);

  // Handle incoming WebSocket messages
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "chat") {
      existingShape.push(data.message);
      clearCanvas(ctx, existingShape, canvas);
    }
  };

  // Draw all shapes (existing + incoming) initially
  clearCanvas(ctx, existingShape, canvas);

  // Local drawing state
  let isDrawing = false;
  let startX = 0;
  let startY = 0;

  // Helper: Get mouse position relative to canvas
  function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
    };
  }

  // Mouse down starts drawing a shape
  const handleMouseDown = (e: MouseEvent) => {
    const pos = getMousePos(canvas, e);
    startX = pos.x;
    startY = pos.y;
    isDrawing = true;
  };

  // Mouse move dynamically renders current rectangle
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrawing) return;
    const pos = getMousePos(canvas, e);
    const width = pos.x - startX;
    const height = pos.y - startY;
    clearCanvas(ctx, existingShape, canvas);
    ctx.strokeStyle = "rgba(255, 255, 255)";
    ctx.strokeRect(startX, startY, width, height);
  };

  // Mouse up finalizes shape and sends it to backend
  const handleMouseUp = (e: MouseEvent) => {
    isDrawing = false;
    const pos = getMousePos(canvas, e);
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

  // Register event listeners
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mousemove", handleMouseMove);
};

/**
 * Clears the canvas and redraws all shapes
 */
function clearCanvas(
  ctx: CanvasRenderingContext2D,
  existingShape: Shape[],
  canvas: HTMLCanvasElement
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  existingShape.forEach((shape) => {
    if (shape.type === "rect") {
      ctx.strokeStyle = "rgba(255, 255, 255)";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
  });
}

/**
 * API call to get previously saved shapes from the database
 */
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
