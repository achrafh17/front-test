import { ICanvasObject, canvasObjectType } from "../types/index";
import { fabric } from "fabric";
import dayjs from "dayjs";
import { roundToTwo } from "./utils";

export const checkIfCanvasHasPlaylist = (canvas: fabric.Canvas) => {
  return canvas.getObjects().some((object: fabric.Object) => {
    return object.id === "playlist";
  });
};

export const handleObjectMoving = (
  e: fabric.IEvent<Event>,
  frame: Required<fabric.Frame>
) => {
  let movingObject = e.target;
  if (movingObject) {
    let L = movingObject.get("left");
    let T = movingObject.get("top");
    let W = movingObject.get("width");
    let H = movingObject.get("height");
    let scaleX = movingObject.get("scaleX") || 1;
    let scaleY = movingObject.get("scaleY") || 1;
    if (
      L === undefined ||
      T === undefined ||
      W === undefined ||
      H === undefined
    )
      return;

    let R = L + W * scaleX;
    let B = T + H * scaleY;
    if (L < frame.aCoords.tl.x) {
      movingObject.set("left", frame.aCoords.tl.x);
    }
    if (T < frame.aCoords.tl.y) {
      movingObject.set("top", frame.aCoords.tl.y);
    }
    if (R > frame.aCoords.br.x) {
      movingObject.set("left", frame.aCoords.br.x - W * scaleX);
    }
    if (B > frame.aCoords.br.y) {
      movingObject.set("top", frame.aCoords.br.y - H * scaleY);
    }
    movingObject.setCoords();
  }
};

export const handleObjectScaling = (
  e: fabric.IEvent<Event>,
  frame: Required<fabric.Frame>
) => {
  const object = e.target as fabric.Object | fabric.Group;

  // prevent objects from being bigger than frame on scale
  if (object === undefined) return;
  let W = object.width;
  let H = object.height;
  let scaleX = object.scaleX || 1;
  let scaleY = object.scaleY || 1;

  if (H === undefined || W === undefined) return;
  if (W * scaleX > frame.width) {
    object.set({
      scaleX: frame.width / W,
      left: frame.aCoords.tl.x,
    });
  }
  if (H * scaleY > frame.height) {
    object.set({
      scaleY: frame.height / H,
      top: frame.aCoords.tl.y,
    });
  }

  if (
    (object.id === "weatherGroup" || object.id === "playlist") &&
    object._objects !== undefined
  ) {
    let text = object._objects[1] as fabric.Text;
    let newHeight = object.getScaledHeight();
    let newWidth = object.getScaledWidth();
    let scaleY = H / newHeight;
    let scaleX = W / newWidth;
    let font = Math.max(
      Math.min(18 * newHeight * 0.01 - 20, 18 * newWidth * 0.01 - 20),
      36
    );

    text.set({
      fontSize: font,
      scaleX: scaleX,
      scaleY: scaleY,
    });
    text.setCoords();
  } else if (object.id === "clockGroup" && object._objects !== undefined) {
    let textTop = object._objects[1] as fabric.Text;
    let textBottom = object._objects[2] as fabric.Text;
    let newHeight = object.getScaledHeight();
    let newWidth = object.getScaledWidth();
    let scaleY = H / newHeight;
    let scaleX = W / newWidth;
    let font = Math.max(
      Math.min(18 * newHeight * 0.01 - 20, 18 * newWidth * 0.01 - 20),
      36
    );

    textTop.set({
      fontSize: font,
      scaleX: scaleX,
      scaleY: scaleY,
    });
    textTop.setCoords();
    textBottom.set({
      fontSize: font,
      scaleX: scaleX,
      scaleY: scaleY,
    });
    textBottom.setCoords();
  }
  object.setCoords();
};

export const createCanvasObject = (
  id: canvasObjectType,
  left: number,
  top: number,
  frameWidth: number,
  frameHeight: number
): ICanvasObject => {
  if (id === "layer") {
    var sideLength = Math.min(0.37 * frameWidth, 0.37 * frameHeight);
    var rectHeight = roundToTwo((sideLength / frameHeight) * 100);
    var rectWidth = roundToTwo((sideLength / frameWidth) * 100);

    const rect = new fabric.Rect({
      width: sideLength,
      height: sideLength,
      left: 0,
      top: 0,
      originX: "center",
      originY: "center",
      fill: "#e9eef5",
      lockScalingFlip: true,
      lockSkewingX: true,
      lockSkewingY: true,
      cornerStyle: "rect",
      lockRotation: true,
    });

    const group = new fabric.Group([rect], {
      width: sideLength,
      height: sideLength,
      left: left,
      top: top,
      originX: "left",
      originY: "top",
      lockScalingFlip: true,
      lockSkewingX: true,
      lockSkewingY: true,
      cornerStyle: "rect",
      lockRotation: true,
    });

    // remove rotation controller on rect
    group.setControlsVisibility({
      mtr: false,
    });

    group.id = "layer";

    return {
      id: "layer",
      label: "Couche",
      object: group,
      height: rectHeight,
      width: rectWidth,
      x: 0,
      y: 0,
      bgColor: "#e9eef5",
      opacity: 100,
    };
  } else if (id === "weather") {
    let weatherGrpWidth = 0.16 * frameWidth;
    let weatherGrpHeight = 0.18 * frameHeight;
    let fontSize = Math.max(
      Math.min(
        18 * weatherGrpHeight * 0.01 - 20,
        18 * weatherGrpWidth * 0.01 - 20
      ),
      36
    );

    let bgRect = new fabric.Rect({
      width: weatherGrpWidth,
      height: weatherGrpHeight,
      left: 0,
      top: 0,
      originX: "center",
      originY: "center",
      fill: "#123",
    });

    let textTop = new fabric.IText("Météo", {
      originX: "center",
      originY: "center",
      textAlign: "center",
      fontFamily: "Segoe UI",
      top: 0,
      left: 0,
      fontSize: fontSize,
      fill: "#fefefe",
    });
    let group = new fabric.Group([bgRect, textTop], {
      left: left,
      top: top,
      originX: "left",
      originY: "top",
      width: weatherGrpWidth,
      height: weatherGrpHeight,
      lockSkewingX: true,
      lockSkewingY: true,
      lockScalingFlip: true,
      lockRotation: true,
    });

    group.setControlVisible("mtr", false);

    //@ts-ignore
    group.id = "weatherGroup";
    return {
      id: "weather",
      label: "Météo",
      object: group,
      height: 18,
      width: 16,
      x: 0,
      y: 0,
    };
  } else if (id === "clock") {
    let clockGrpWidth = 0.16 * frameWidth;
    let clockGrpHeight = 0.18 * frameHeight;
    let fontSize = Math.max(
      Math.min(18 * clockGrpHeight * 0.01 - 20, 18 * clockGrpWidth * 0.01 - 20),
      36
    );

    let bgRect = new fabric.Rect({
      width: clockGrpWidth,
      height: clockGrpHeight,
      left: 0,
      top: 0,
      originX: "center",
      originY: "center",
      fill: "#123",
    });

    let textTop = new fabric.IText(dayjs().format("hh:mm A"), {
      originX: "center",
      originY: "bottom",
      textAlign: "center",
      fontFamily: "Segoe UI",
      top: 0,
      left: 0,
      fontSize: fontSize,
      fill: "#fefefe",
    });
    let textBottom = new fabric.IText(dayjs().format("DD MMMM"), {
      originX: "center",
      originY: "top",
      textAlign: "center",
      fontFamily: "Segoe UI",
      top: 0,
      left: 0,
      fontSize: fontSize,
      fill: "#fefefe",
    });
    let group = new fabric.Group([bgRect, textTop, textBottom], {
      left: left,
      top: top,
      originX: "left",
      originY: "top",
      width: clockGrpWidth,
      height: clockGrpHeight,
      lockSkewingX: true,
      lockSkewingY: true,
      lockScalingFlip: true,
      lockRotation: true,
    });

    group.setControlVisible("mtr", false);

    //@ts-ignore
    group.id = "clockGroup";
    return {
      id: "clock",
      label: "Horloge",
      object: group,
      height: 18,
      width: 16,
      x: 0,
      y: 0,
    };
  } else {
    // playlist
    let weatherGrpWidth = 0.16 * frameWidth;
    let weatherGrpHeight = 0.18 * frameHeight;
    let fontSize = Math.max(
      Math.min(
        18 * weatherGrpHeight * 0.01 - 20,
        18 * weatherGrpWidth * 0.01 - 20
      ),
      36
    );

    let bgRect = new fabric.Rect({
      width: weatherGrpWidth,
      height: weatherGrpHeight,
      left: 0,
      top: 0,
      originX: "center",
      originY: "center",
      fill: "#123",
    });

    let textTop = new fabric.IText("Playlist", {
      originX: "center",
      originY: "center",
      textAlign: "center",
      fontFamily: "Segoe UI",
      top: 0,
      left: 0,
      fontSize: fontSize,
      fill: "#fefefe",
    });
    let group = new fabric.Group([bgRect, textTop], {
      left: left,
      top: top,
      originX: "left",
      originY: "top",
      width: weatherGrpWidth,
      height: weatherGrpHeight,
      lockSkewingX: true,
      lockSkewingY: true,
      lockScalingFlip: true,
      lockRotation: true,
    });

    group.setControlVisible("mtr", false);

    //@ts-ignore
    group.id = "playlist";
    return {
      id: "playlist",
      label: "Playlist",
      object: group,
      height: 18,
      width: 16,
      x: 0,
      y: 0,
    };
  }
};

// resize with inputs from settings
export const resizeCanvasObject = (
  canvasObject: ICanvasObject,
  newOptions: Partial<ICanvasObject>,
  canvas: fabric.Canvas,
  frameWidth: number,
  frameHeight: number,
  frameLeft: number,
  frameTop: number
) => {
  redrawCanvasObject(
    { ...canvasObject, ...newOptions },
    canvas,
    frameWidth,
    frameHeight,
    frameLeft,
    frameTop
  );
};

export const redrawCanvasObject = (
  canvasObject: ICanvasObject,
  canvas: fabric.Canvas,
  frameWidth: number,
  frameHeight: number,
  frameLeft: number,
  frameTop: number
) => {

  var newWidth = (canvasObject.width / 100) * frameWidth;
  var newHeight = (canvasObject.height / 100) * frameHeight;
  var newLeft = (canvasObject.x / 100) * frameWidth + frameLeft;
  var newTop = (canvasObject.y / 100) * frameHeight + frameTop;  

  var group = canvasObject.object as fabric.Group;
  var groupObjects = group.getObjects();
  if (canvasObject.id === "layer") {
    let bgRect = groupObjects[0] as fabric.Rect;
    bgRect.set({
      width: newWidth,
      height: newHeight,
      scaleX: 1,
      scaleY: 1,
      fill: canvasObject?.bgColor || "#e9eef5",
      opacity: (canvasObject?.opacity ?? 100) / 100,
    });
    bgRect.setCoords();
    if (groupObjects.length > 1) {
      let img = groupObjects[1] as fabric.Image;
      img.scaleToWidth(newWidth);
      img.setCoords();
    }
    group.set({
      left: newLeft,
      top: newTop,
      width: newWidth,
      height: newHeight,
      scaleX: 1,
      scaleY: 1,
    });
  } else if (canvasObject.id === "weather" || canvasObject.id === "playlist") {
    let bgRect = groupObjects[0] as fabric.Rect;
    bgRect.set({
      width: newWidth,
      height: newHeight,
      scaleX: 1,
      scaleY: 1,
      fill: canvasObject?.bgColor || "#123",
      opacity: (canvasObject?.opacity ?? 100) / 100,
    });
    let textTop = groupObjects[1] as fabric.IText;
    textTop.set({
      fontSize: Math.max(
        Math.min(18 * newWidth * 0.01 - 20, 18 * newHeight * 0.01 - 20),
        36
      ),
    });
    textTop.setCoords();
    bgRect.setCoords();
    group.set({
      left: newLeft,
      top: newTop,
      width: newWidth,
      height: newHeight,
      scaleX: 1,
      scaleY: 1,
    });
  } else if (canvasObject.id === "clock") {
    let bgRect = groupObjects[0] as fabric.Rect;
    bgRect.set({
      width: newWidth,
      height: newHeight,
      scaleX: 1,
      scaleY: 1,
      fill: canvasObject?.bgColor || "#123",
      opacity: (canvasObject?.opacity ?? 100) / 100,
    });
    let textTop = groupObjects[1] as fabric.IText;
    textTop.set({
      fontSize: Math.max(
        Math.min(18 * newWidth * 0.01 - 20, 18 * newHeight * 0.01 - 20),
        36
      ),
    });
    textTop.setCoords();
    let textBottom = groupObjects[2] as fabric.IText;
    textBottom.set({
      fontSize: Math.max(
        Math.min(18 * newWidth * 0.01 - 20, 18 * newHeight * 0.01 - 20),
        36
      ),
    });
    textBottom.setCoords();
    bgRect.setCoords();
    group.set({
      left: newLeft,
      top: newTop,
      width: newWidth,
      height: newHeight,
      scaleX: 1,
      scaleY: 1,
    });
  }

  group.setCoords();
  canvas.renderAll();
};

export const drawLayers = (
  layers: Omit<ICanvasObject, "object">[],
  canvas: fabric.Canvas,
  frameWidth: number,
  frameHeight: number,
  frameLeft: number,
  frameTop: number
) => {
  var newLayers = layers.map((layer) => {
    var canvasObject = drawLayer(
      layer,
      canvas,
      frameWidth,
      frameHeight,
      frameLeft,
      frameTop
    );
    if(canvasObject?.object){
      canvas.add(canvasObject.object);
    }
    return canvasObject;
  })
  canvas.renderAll();
  return newLayers; 
};

export const drawLayer = (
  layer: Omit<ICanvasObject, "object">,
  canvas: fabric.Canvas,
  frameWidth: number,
  frameHeight: number,
  frameLeft: number,
  frameTop: number
) => {

  let cnvsObject = createCanvasObject(
    layer.id,
    frameLeft,
    frameTop,
    frameWidth,
    frameHeight
  );

  resizeCanvasObject(
    cnvsObject,
    layer,
    canvas,
    frameWidth,
    frameHeight,
    frameLeft,
    frameTop
  );
  return {
    ...layer,
    object: cnvsObject.object,
  } as ICanvasObject;
};
