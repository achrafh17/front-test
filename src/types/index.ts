type canvasObjectType = "layer" | "weather" | "clock" | "playlist";    
type FrameRatio = "16x9"| "4x3"|"9x16"| "3x4"| "autre"
import {fabric} from "fabric"

interface ICanvasObject {
  id: canvasObjectType;
  label: string;
  object: fabric.Object;
  x: number;
  y: number;
  width: number;
  height: number;
  bgColor?: string;
  opacity?: number;
  imageURL?: string;
}


type ArrowPlacement = "SIDES" | "BOTTOM"

type CounterType =
  "DIGITS" | "DOTS"

type DisplayMode = "ORIGINAL" | "CROP" | "STRETCH"

interface ISliderArrows {
  exists: boolean;
  placement: ArrowPlacement;
}
interface ISliderCounter {
  exists: boolean;
  type: CounterType;
}
interface ISliderAutoloop {
  exists: boolean;
  interval: string;
}

interface IColorAlpha {
  color: string;
  opacity: number;
}

export {
  canvasObjectType,
  ICanvasObject,
  FrameRatio,
  ArrowPlacement,
  CounterType,
  DisplayMode,
  ISliderArrows,
  ISliderCounter,
  ISliderAutoloop,IColorAlpha
};