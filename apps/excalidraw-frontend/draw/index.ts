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
 * Global variables for infinite canvas transformations:
 * - scale: zoom level (1 is 100%, >1 zooms in, <1 zooms out)
 * - offsetX, offsetY: pan offsets (in screen pixels)
 * - isPanning: flag for panning mode
 * - spacePressed: indicates if the spacebar is held (to pan with left mouse)
 * - lastPanX, lastPanY: store last pointer positions for panning calculations
 * - lastTouchDistance: used for calculating pinch zoom
 */
let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isPanning = false;
let spacePressed = false;
let lastPanX = 0;
let lastPanY = 0;
let lastTouchDistance = 0;
/**
 * Initializes drawing logic and WebSocket behavior on the canvas.
 */
const DrawInit = async (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  roomId: number,
  socket: WebSocket
) => {
  // Subscribe to global state for tool and zoom (dynamic updates).
  let currentTool = useCanvasStore.getState().currentTool;
  useCanvasStore.subscribe((state) => {
    currentTool = state.currentTool;
  });
  // (Note: here zoomLevelStore is separate from our local variable "scale".)
  // For the infinite canvas, we manage pan/zoom independently.
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
  let pencilPoints: Point[] = [];

  /**
   * getMousePos converts a MouseEvent's screen coordinates to "world" coordinates.
   * It does so by:
   * 1. Getting the canvas bounding rectangle (the canvas' offset in the page).
   * 2. Converting to canvas coordinates.
   * 3. Adjusting by the current pan offsets and zoom scale.
   */
  function getMousePos(canvas: HTMLCanvasElement, e: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    return {
      x: (canvasX - offsetX) / scale,
      y: (canvasY - offsetY) / scale,
    };
  }

  // --- Panning Event Handlers ---
  // Listen for panning gestures using middle mouse or left mouse with space held.
  const handleMouseDown = (e: MouseEvent) => {
    const pos = getMousePos(canvas, e);
    startX = pos.x;
    startY = pos.y;
    isDrawing = true;
    // If we're in panning mode, do not start a drawing stroke.
    if (isPanning || spacePressed) return;

    if (currentTool === "pencil") {
      pencilPoints = [pos];
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
    if (e.button === 1 || (e.button === 0 && spacePressed)) {
      isPanning = true;
      lastPanX = e.clientX;
      lastPanY = e.clientY;
      // Prevent default to avoid text selection
      e.preventDefault();
    }
  };

  // Mouse move dynamically renders current rectangle
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrawing) return;
    // If panning, drawing is skipped.
    // Handle panning with mouse movement.
    if (isPanning) {
      const deltaX = e.clientX - lastPanX;
      const deltaY = e.clientY - lastPanY;
      offsetX += deltaX;
      offsetY += deltaY;
      lastPanX = e.clientX;
      lastPanY = e.clientY;
      clearCanvas(ctx, existingShape, canvas);
      return;
    }

    if (!isDrawing) return;
    const pos = getMousePos(canvas, e);
    const width = pos.x - startX;
    const height = pos.y - startY;
    clearCanvas(ctx, existingShape, canvas);
    ctx.strokeStyle = "rgba(255, 255, 255)";

    if (currentTool === "rect") {
      ctx.strokeRect(startX, startY, width, height);
    } else if (currentTool === "circle") {
      const radius = Math.sqrt(width * width + height * height);
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (currentTool === "pencil") {
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
    } else if (currentTool === "text") {
      ctx.font = `20px Arial`;
      ctx.fillStyle = "white";
      ctx.fillText("Hello World", pos.x, pos.y);
    }
  };

  // Listen for spacebar events to enable panning with left-click.
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") spacePressed = true;
  });
  window.addEventListener("keyup", (e) => {
    if (e.code === "Space") spacePressed = false;
  });

  // --- Wheel Event for Mouse: Pan only (do not zoom via wheel) ---
  // Instead of zooming, the wheel event now simply adjusts the pan offsets.
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    // Update pan offsets based on wheel delta.
    // Note: e.deltaX and e.deltaY already provide the scroll deltas.
    offsetX -= e.deltaX;
    offsetY -= e.deltaY;
    clearCanvas(ctx, existingShape, canvas);
  });

  // Helper: Compute distance between two touch points.
  function getDistance(touches: TouchList) {
    const [touch1, touch2] = [touches[0], touches[1]];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  }

  // On touch start: if two fingers, record initial distance; if one finger, record pan start.
  function handleTouchStart(e: TouchEvent) {
    if (e.touches.length === 2) {
      lastTouchDistance = getDistance(e.touches);
    } else if (e.touches.length === 1) {
      lastPanX = e.touches[0].clientX;
      lastPanY = e.touches[0].clientY;
    }
    e.preventDefault();
  }

  // On touch move:
  // - One-finger moves update pan offsets.
  // - Two-finger pinch updates the zoom (scale) and offsets so that the pinch midpoint remains fixed.
  function handleTouchMove(e: TouchEvent) {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - lastPanX;
      const deltaY = touch.clientY - lastPanY;
      offsetX += deltaX;
      offsetY += deltaY;
      lastPanX = touch.clientX;
      lastPanY = touch.clientY;
      clearCanvas(ctx, existingShape, canvas);
    } else if (e.touches.length === 2) {
      const newDistance = getDistance(e.touches);
      const zoomFactor = newDistance / lastTouchDistance;
      const prevScale = scale;
      // Update scale based on pinch gesture.
      scale *= zoomFactor;
      scale = Math.max(0.2, Math.min(scale, 5)); // Clamp scale.
      // Calculate the midpoint of the two touch points.
      const midpointX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midpointY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      const rect = canvas.getBoundingClientRect();
      const canvasMidX = midpointX - rect.left;
      const canvasMidY = midpointY - rect.top;
      // Convert the midpoint to world coordinates using previous scale.
      const worldX = (canvasMidX - offsetX) / prevScale;
      const worldY = (canvasMidY - offsetY) / prevScale;
      // Update pan offsets so that the world coordinate of the midpoint remains fixed.
      offsetX = canvasMidX - worldX * scale;
      offsetY = canvasMidY - worldY * scale;
      lastTouchDistance = newDistance;
      clearCanvas(ctx, existingShape, canvas);
    }
    e.preventDefault();
  }

  // Mouse up finalizes shape and sends it to backend
  const handleMouseUp = (e: MouseEvent) => {
    if (isPanning) return; // Do not process drawing if panning.

    isDrawing = false;
    isPanning = false;

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
    } else if (currentTool === "circle") {
      const radius = Math.sqrt(width * width + height * height);
      shape = {
        type: "circle",
        x: startX,
        y: startY,
        radius,
        startAngle: 0,
        endAngle: 2 * Math.PI,
      };
    } else if (currentTool === "pencil") {
      shape = {
        type: "pencil",
        points: pencilPoints,
        width: 2, // default line width — update if dynamic later
        style: "round", // you can make this dynamic too
      };
    } else if (currentTool === "text") {
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

      // Send the shape data via WebSocket for real-time synchronization.
      socket.send(
        JSON.stringify({
          type: "chat",
          message: shape,
          roomId: Number(roomId),
        })
      );
    }
  };
  // Register event listeners for touch events.
  canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
  canvas.addEventListener("touchmove", handleTouchMove, { passive: false });

  // Register event listeners
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mousemove", handleMouseMove);
};





/**
 * clearCanvas resets the canvas and redraws all shapes while applying
 * the pan and zoom transforms. It resets the transform, clears the canvas,
 * reapplies the transformation and then draws the background and all shapes.
 */
function clearCanvas(
  ctx: CanvasRenderingContext2D,
  existingShape: Shape[],
  canvas: HTMLCanvasElement
) {
  // Reset transform and clear the entire canvas.
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // Clear background
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Apply pan and zoom transforms.
  ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);

  // Draw the background (simulate infinite canvas by filling more area).
  ctx.fillStyle = "black";
  ctx.fillRect(
    -offsetX / scale,
    -offsetY / scale,
    canvas.width / scale,
    canvas.height / scale
  );

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
