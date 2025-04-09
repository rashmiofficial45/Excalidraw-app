import axios from "axios";
import { BACKEND_URL } from "../components/auth/Auth";

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
      redius: number;
      startAngle: number;
      endAngle: number;
    };

const DrawInit = async (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  roomId: number
) => {
  let existingShape: Shape[] = await getExistingShape(roomId);
  let isDrawing = false;
  let startX = 0;
  let startY = 0;
  clearCanvas(ctx, existingShape, canvas);

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
    ctx.strokeStyle = "white";
    ctx.strokeRect(startX, startY, width, height);
  };

  const handleMouseUp = (e: MouseEvent) => {
    isDrawing = false;
    const pos = getMousePos(e);
    const width = pos.x - startX;
    const height = pos.y - startY;
    existingShape.push({
      type: "rect",
      x: startX,
      y: startY,
      width,
      height,
    });
  };

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseup", handleMouseUp);
};

function clearCanvas(
  ctx: CanvasRenderingContext2D,
  existingShape: Shape[],
  canvas: HTMLCanvasElement
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  existingShape.map((shape) => {
    if (shape.type === "rect") {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
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
