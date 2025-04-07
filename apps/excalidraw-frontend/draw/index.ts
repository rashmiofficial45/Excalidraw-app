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

const DrawInit = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  let existingShape: Shape[] = [];
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "white";
    ctx.fillStyle = "black";
    ctx.strokeRect(startX, startY, width, height);
  };

  const handleMouseUp = (e: MouseEvent) => {
    isDrawing = false;

  };

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseup", handleMouseUp);
};

export default DrawInit;
