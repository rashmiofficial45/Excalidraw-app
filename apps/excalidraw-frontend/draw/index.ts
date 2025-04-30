import axios from "axios";
import { BACKEND_URL } from "../lib/config";
import { useCanvasStore } from "../stores/useCanvasStore";

/*
  Define custom types for our drawing application:
  - pencilStyle: possible values for pencil line cap styles.
  - Point: a coordinate in 2D space.
  - Shape: a union type representing the possible shape objects that can be drawn:
      - "rect" for rectangles
      - "circle" for circles
      - "pencil" for freehand pencil strokes (which store an array of points)
      - "text" for displaying text
*/
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

/*
  Global variables for infinite canvas transformations:
  - scale: the current zoom level (1 means 100% zoom)
  - offsetX, offsetY: the panning offsets (in screen pixels)
  - isPanning: boolean flag indicating if panning mode is active
  - spacePressed: flag indicating if the spacebar is held down (to pan with left mouse)
  - lastPanX, lastPanY: store the last known pointer positions (used to calculate movement deltas)
  - lastTouchDistance: used for calculating the change in distance between two fingers (pinch zoom)
*/
let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isPanning = false;
let spacePressed = false;
let lastPanX = 0;
let lastPanY = 0;
let lastTouchDistance = 0;

/*
  DrawInit initializes the drawing logic and sets up event listeners
  for mouse and touch interactions, as well as WebSocket event handling.
  Parameters:
    - canvas: the HTMLCanvasElement to draw on
    - ctx: the 2D rendering context for the canvas
    - roomId: identifier for the drawing session/room
    - socket: WebSocket instance for real-time communication
*/
const DrawInit = async (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  roomId: number,
  socket: WebSocket
) => {
  // Subscribe to a Zustand store to retrieve the current drawing tool.
  let currentTool = useCanvasStore.getState().currentTool;
  useCanvasStore.subscribe((state) => {
    currentTool = state.currentTool;
  });

  // Optionally subscribe to a zoom level from the store, though the local scale is managed independently.
  let zoomLevel = useCanvasStore.getState().zoomLevel;
  useCanvasStore.subscribe((state) => {
    zoomLevel = state.zoomLevel;
  });

  // Fetch any previously saved shapes from the backend using an API call.
  let existingShape: Shape[] = await getExistingShape(roomId);

  // Set up the WebSocket event handler to listen for new shape messages.
  // When a message is received, push it onto the existingShape array and redraw the canvas.
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "chat") {
      existingShape.push(data.message);
      clearCanvas(ctx, existingShape, canvas);
    }
  };

  // Draw existing shapes onto the canvas initially.
  clearCanvas(ctx, existingShape, canvas);

  // Local state variables for handling drawing events:
  // - isDrawing: tracks whether a drawing operation is in progress.
  // - startX, startY: record the starting position (in world coordinates) when drawing begins.
  // - pencilPoints: collects the points for a freehand pencil drawing.
  let isDrawing = false;
  let startX = 0;
  let startY = 0;
  let pencilPoints: Point[] = [];

  /**
   * getMousePos converts a MouseEvent's screen coordinates into "world" coordinates.
   * Steps:
   * 1. Retrieve the canvas's bounding rectangle to determine its position relative to the viewport.
   * 2. Subtract the rectangle's left and top values from the event's clientX and clientY
   *    to obtain the position relative to the canvas element.
   * 3. Adjust for the current pan (offsetX, offsetY) and divide by the zoom scale.
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

  // --- Panning and Drawing Event Handlers ---

  /*
    handleMouseDown:
    - Captures the initial pointer position in world space using getMousePos.
    - If the event should trigger panning (middle mouse or left-click with space), it sets isPanning to true.
    - Otherwise, it initiates a drawing operation, starting a new pencil stroke if the current tool is "pencil."
  */
  const handleMouseDown = (e: MouseEvent) => {
    const pos = getMousePos(canvas, e);
    startX = pos.x;
    startY = pos.y;
    isDrawing = true;
    // If already in panning mode or spacebar is pressed, do not start drawing.
    if (isPanning || spacePressed) return;

    // For pencil tool, initialize pencilPoints and begin a new path.
    if (currentTool === "pencil") {
      pencilPoints = [pos];
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
    // Check for mouse button conditions: if middle button or left-click with space pressed, enter panning mode.
    if (e.button === 1 || (e.button === 0 && spacePressed)) {
      isPanning = true;
      lastPanX = e.clientX;
      lastPanY = e.clientY;
      // Prevent default behavior to stop text selection.
      e.preventDefault();
    }
  };

  /*
    handleMouseMove:
    - If in panning mode, it updates the pan offsets (offsetX, offsetY) based on the mouse movement.
    - Otherwise, if a drawing operation is active, it calculates the new pointer position (in world coordinates),
      clears the canvas, and draws a live preview of the shape being drawn.
    - For the pencil tool, it continuously adds points to the pencilPoints array and redraws the freehand path.
  */
  const handleMouseMove = (e: MouseEvent) => {
    // If panning mode is active, update pan offsets based on movement.
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
    // Clear the canvas and redraw existing shapes plus current preview.
    clearCanvas(ctx, existingShape, canvas);
    ctx.strokeStyle = "rgba(255, 255, 255)";
    // Depending on the selected tool, draw a live preview.
    if (currentTool === "rect") {
      ctx.strokeRect(startX, startY, width, height);
    } else if (currentTool === "circle") {
      const radius = Math.sqrt(width * width + height * height);
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (currentTool === "pencil") {
      // For pencil, push the new point, clear, then redraw the entire pencil path.
      pencilPoints.push(pos);
      clearCanvas(ctx, existingShape, canvas);
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
      // Preview for text tool.
      ctx.font = `20px Arial`;
      ctx.fillStyle = "white";
      ctx.fillText("Hello World", pos.x, pos.y);
    }
  };

  /*
    handleMouseUp:
    - Finalizes the current drawing operation.
    - Retrieves the final pointer position, calculates dimensions, and creates a shape object based on the current tool.
    - The shape is appended to the existingShape collection, the canvas is cleared/re-drawn, and the new shape is sent via WebSocket.
  */
  const handleMouseUp = (e: MouseEvent) => {
    // If panning was active, just disable it.
    if (isPanning) {
      isPanning = false;
      return;
    }
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
        width: 2,
        style: "round",
      };
    } else if (currentTool === "text") {
      shape = {
        type: "text",
        text: "Hello World",
        x: pos.x,
        y: pos.y,
        fontSize: 20,
      };
    }
    if (shape) {
      existingShape.push(shape);
      clearCanvas(ctx, existingShape, canvas);
      // Send shape to backend through WebSocket for real-time synchronization.
      socket.send(
        JSON.stringify({
          type: "chat",
          message: shape,
          roomId: Number(roomId),
        })
      );
    }
  };

  // --- Mouse Wheel Event for Panning ---
  // The wheel event checks for ctrlKey for pinch zoom on Mac; otherwise, it pans.
  canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      if (e.ctrlKey) {
        // Pinch zoom detected on Mac trackpad.
        const zoomAmount = -e.deltaY * 0.005; // Adjust sensitivity as needed.
        const mouse = getMousePos(canvas, e); // Get world coordinates of mouse.
        const prevScale = scale;
        scale *= 1 + zoomAmount;
        scale = Math.max(0.1, Math.min(5, scale)); // Clamp scale.
        // Adjust pan offsets so the zoom centers around the mouse position.
        offsetX -= mouse.x * scale - mouse.x * prevScale;
        offsetY -= mouse.y * scale - mouse.y * prevScale;
        clearCanvas(ctx, existingShape, canvas);
      } else {
        // Regular wheel scroll: update pan offsets.
        offsetX -= e.deltaX;
        offsetY -= e.deltaY;
        clearCanvas(ctx, existingShape, canvas);
      }
    },
    { passive: false }
  );


  // Register mouse event listeners.
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mousemove", handleMouseMove);
};

/*
  clearCanvas resets the canvas transform and clears the canvas.
  It then applies the current pan/zoom transform and redraws the background
  (to simulate an infinite canvas) followed by re-rendering all stored shapes.
*/
function clearCanvas(
  ctx: CanvasRenderingContext2D,
  existingShape: Shape[],
  canvas: HTMLCanvasElement
) {
  // Reset transform to identity and clear the entire canvas.
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Apply pan and zoom transforms.
  ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);

  // Draw background: a black rectangle filling the viewport.
  ctx.fillStyle = "black";
  ctx.fillRect(
    -offsetX / scale,
    -offsetY / scale,
    canvas.width / scale,
    canvas.height / scale
  );

  // Iterate over all stored shapes and draw each one according to its type.
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

/*
  getExistingShape calls the backend API to retrieve previously stored shapes
  for a given room and returns them as an array of Shape objects.
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
