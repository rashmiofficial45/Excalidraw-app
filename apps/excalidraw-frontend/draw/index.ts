import axios from "axios";
import { BACKEND_URL } from "../lib/config";
import { useCanvasStore } from "../stores/useCanvasStore";
type pencilStyle = "butt" | "round" | "square";
type Point = { x: number; y: number };
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
    }
  | {
      type: "pencil";
      points: Point[];
      width: number;
      style: pencilStyle;
    }
  | {
      type: "text";
      text: string;
      x: number;
      y: number;
      fontSize: number;
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


  let currentTool = useCanvasStore.getState().currentTool;
  useCanvasStore.subscribe((state) => {
    currentTool = state.currentTool;
  });


  let zoomLevel = useCanvasStore.getState().zoomLevel;
  useCanvasStore.subscribe((state) => {
    zoomLevel = state.zoomLevel;
  });


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
  function getMousePos(canvas: HTMLCanvasElement, e: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }


  // Mouse down starts drawing a shape
  let pencilPoints: Point[] = [];

  const handleMouseDown = (e: MouseEvent) => {
    const pos = getMousePos(canvas, e);
    startX = pos.x;
    startY = pos.y;
    isDrawing = true;
    if (currentTool === "pencil") {
      pencilPoints = [pos];
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  // Mouse move dynamically renders current rectangle
  const handleMouseMove = (e: MouseEvent) => {

    if (!isDrawing) return;
    const pos = getMousePos(canvas, e);
    const width = pos.x - startX;
    const height = pos.y - startY;
    clearCanvas(ctx, existingShape, canvas);
    ctx.strokeStyle = "rgba(255, 255, 255)";

    if (currentTool === "rect") {
      ctx.strokeRect(startX, startY, width, height);
    }

    else if (currentTool === "circle") {
      const radius = Math.sqrt(width * width + height * height);
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }

    else if (currentTool === "pencil") {
      pencilPoints.push(pos);
      // Clear canvas and redraw existing shapes
      clearCanvas(ctx, existingShape, canvas);
      // Begin drawing current pencil path
      ctx.beginPath();
      for (let i = 0; i < pencilPoints.length; i++) {
        const pt = pencilPoints[i];
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();
      return;
    }

    else if (currentTool === "text") {
      ctx.font = `20px Arial`;
      ctx.fillText("Hello World", 10, 80);
    }
  };

  // Mouse up finalizes shape and sends it to backend
  const handleMouseUp = (e: MouseEvent) => {
    isDrawing = false;
    const pos = getMousePos(canvas, e);
    const width = pos.x - startX;
    const height = pos.y - startY;

    let shape: Shape | null = null;

    if (currentTool === "rect") {
      shape = {
        type: "rect",
        x: startX,
        y: startY,
        width,
        height,
      };
    }

    else if (currentTool === "circle") {
      const radius = Math.sqrt(width * width + height * height);
      shape = {
        type: "circle",
        x: startX,
        y: startY,
        radius,
        startAngle: 0,
        endAngle: 2 * Math.PI,
      };
    }

    else if (currentTool === "pencil") {
      shape = {
        type: "pencil",
        points: pencilPoints,
        width: 2, // default line width — update if dynamic later
        style: "round", // you can make this dynamic too
      };
    }

    else if (currentTool === "text") {
      shape = {
        type: "text",
        text: "Hello World", // Can make this user-input later
        x: pos.x,
        y: pos.y,
        fontSize: 20,
      };
    }

    if (shape) {
      existingShape.push(shape);
      clearCanvas(ctx, existingShape, canvas);

      socket.send(
        JSON.stringify({
          type: "chat",
          message: shape,
          roomId: Number(roomId),
        })
      );
    }
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
  // Clear background
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShape.forEach((shape) => {
    switch (shape.type) {
      case "rect":
        ctx.strokeStyle = "rgba(255, 255, 255)";
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        break;


      case "circle":
        ctx.strokeStyle = "rgba(255, 255, 255)";
        ctx.beginPath();
        ctx.arc(
          shape.x,
          shape.y,
          shape.radius,
          shape.startAngle,
          shape.endAngle
        );
        ctx.stroke();
        break;


      case "pencil":
        if (Array.isArray(shape.points)) {
          ctx.beginPath();
          shape.points.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          ctx.stroke();
        }
        break;

        
      case "text":
        ctx.fillStyle = "white";
        ctx.font = `${shape.fontSize}px Arial`;
        ctx.fillText(shape.text, shape.x, shape.y);
        break;

      default:
        console.warn("Unknown shape type:", shape);
        break;
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
