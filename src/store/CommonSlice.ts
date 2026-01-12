import { StateCreator } from "zustand";
import { fabric } from "fabric";
import { ICanvasObject } from "../types";

export interface ICanvasSlice {
  layoutName: string;
  setLayoutName: (newName: string) => void;
  activeObject: ICanvasObject | null;
  setActiveObject: (newObject: ICanvasObject | null) => void;
  canvas: fabric.Canvas | null;
  setCanvas: (newCanvas: fabric.Canvas | null) => void;
  initialState: {
    frameWidth: number;
    frameHeight: number;
    layers: Omit<ICanvasObject, "object">[];
  } | null;
  setInitialState: (
    newInitialState: {
      frameWidth: number;
      frameHeight: number;
      layers: Omit<ICanvasObject, "object">[];
    } | null
  ) => void;
}

const createCanvasSlice: StateCreator<ICanvasSlice> = (set) => ({
  layoutName: "Calque 1",

  setLayoutName: (newName: string) => set(() => ({ layoutName: newName })),

  activeObject: null,

  canvas: null,

  setActiveObject: (newObject) => set(() => ({ activeObject: newObject })),

  setCanvas: (newCanvas) =>
    set({
      canvas: newCanvas,
    }),

  initialState: null,
  setInitialState: (newInitialState) =>
    set({
      initialState: newInitialState,
    }),
});

export default createCanvasSlice;
