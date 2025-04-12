import { create } from "zustand";
interface CanvasStore {
  currentTool: string;
  setCurrentTool: (tool: string) => void;

  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;

  zoomLevel: number;
  setZoomLevel: (val: number) => void;
}
export const useCanvasStore = create<CanvasStore>((set) => ({
  currentTool: "rect",
  setCurrentTool: (tool) => set({ currentTool: tool }),

  isCollapsed: false,
  setIsCollapsed: (collapsed) => set({ isCollapsed: collapsed }),

  zoomLevel: 100,
  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
}));
