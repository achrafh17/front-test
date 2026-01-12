import { StateCreator } from "zustand";
import { fabric } from "fabric";
import { FrameRatio} from "../types";

export interface IFrameSlice {
  frame: Required<fabric.Frame> | null;
  setFrame: (newFrame: Required<fabric.Frame> | null) => void;
  frameACoords: {
    bl: fabric.Point;
    br: fabric.Point;
    tl: fabric.Point;
    tr: fabric.Point;
  } | null;
  setFrameACoords: (
    newFrameACoords: {
      bl: fabric.Point;
      br: fabric.Point;
      tl: fabric.Point;
      tr: fabric.Point;
    } | null
  ) => void;
  frameDimensions: { width: number; height: number } | null;
  setFrameDimensions: (newFrameDimensions: {
    width: number;
    height: number;
  } | null) => void;
  setFrameWidth : (newWidth: number) => void;
  setFrameHeight : (newHeight: number) => void;
  frameOrientation: "horizontal" | "vertical";
  setFrameOrientation: (newFrameOrientation: "horizontal" | "vertical") => void;
  frameRatio: FrameRatio;
  setFrameRatio: (fn:(oldFrameRatio: FrameRatio)=>FrameRatio) => void;
}

const createFrameSlice: StateCreator<IFrameSlice> = (set) => ({
  frame: null,
  frameDimensions: null,
  frameACoords: null,

  setFrameACoords: (newFrameACoords) =>
    set(() => ({ frameACoords: newFrameACoords })),

  setFrame: (newFrame) =>
    set({
      frame: newFrame,
    }),

  setFrameDimensions: (newFrameDimensions) =>
    set({
      frameDimensions: newFrameDimensions,
    }),
  setFrameWidth: (newWidth) =>
    set((state) => ({
      frameDimensions: {
        width: newWidth,
        height: state.frameDimensions?.height ?? 0,
      },
    })),
  setFrameHeight: (newHeight) =>
    set((state) => ({
      frameDimensions: {
        width: state.frameDimensions?.width ?? 0,
        height: newHeight,
      },
    })),

  frameOrientation: "horizontal",
  setFrameOrientation: (newFrameOrientation) =>
    set({
      frameOrientation: newFrameOrientation,
    }),
  frameRatio: "16x9",

  setFrameRatio: (fn) =>
    set((state) => {
      return {
        frameRatio: fn(state.frameRatio),
      };
    }),
});

export default createFrameSlice;
