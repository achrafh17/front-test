import React from "react";
import { Canvas, useEditor } from "@layerhub-io/react";
import {
  handleObjectMoving,
  handleObjectScaling,
} from "../../../utils/canvas.utils";
import useStore from "../../../store/store";
import { IEvent } from "fabric/fabric-impl";
import { roundToTwo } from "../../../utils/utils";
import { drawLayers } from "../../../utils/canvas.utils";

const MyCanvas: React.FC<{}> = () => {
  const editor = useEditor();
  const canvas = useStore((state) => state.canvas);
  const setCanvas = useStore((state) => state.setCanvas);
  const frame = useStore((state) => state.frame);
  const setFrame = useStore((state) => state.setFrame);
  const frameDimensions = useStore((state) => state.frameDimensions);
  const setFrameDimensions = useStore((state) => state.setFrameDimensions);
  const frameACoords = useStore((state) => state.frameACoords);
  const setFrameACoords = useStore((state) => state.setFrameACoords);
  const updateLayer = useStore((state) => state.updateLayer);
  const deleteLayer = useStore((state) => state.deleteLayer);
  const setActiveObject = useStore((state) => state.setActiveObject);
  const setActiveObjectByFabricObject = useStore(
    (state) => state.setActiveObjectByFabricObject
  );
  const setLayers = useStore((state) => state.setLayers);
  const initialState = useStore((state) => state.initialState);
  const setFrameOrientation = useStore((state) => state.setFrameOrientation);
  const setFrameRatio = useStore((state) => state.setFrameRatio);

  const [hasInitialStateRendered, setHasInitialStateRendered] =
    React.useState(false);

  React.useEffect(() => {
    if (editor && frameDimensions) {
      editor.frame.resize(frameDimensions);
      setFrame(editor.frame.frame);
        setFrameACoords(editor.frame.frame.aCoords);
        editor.frame.frame.scaleX = editor.frame.frame.scaleY = 1;
        editor.frame.frame.setCoords();
    }
    if (frameDimensions) {
      var frameDimensionsString = `${frameDimensions.width}x${frameDimensions.height}`;
      if (
        ["1920x1080", "2560x1440", "3840x2160"].includes(frameDimensionsString)
      ) {
        setFrameRatio((prv) => "16x9");
      } else if (["1024x768", "1200x900"].includes(frameDimensionsString)) {
        setFrameRatio((prv) => "4x3");
      } else if (
        ["1080x1920", "1440x2560", "2160x3840"].includes(frameDimensionsString)
      ) {
        setFrameRatio((prv) => "9x16");
      } else if (["768x1024", "900x1200"].includes(frameDimensionsString)) {
        setFrameRatio((prv) => "3x4");
      } else {
        setFrameRatio((prv) => "autre");
      }
      if (frameDimensions.width < frameDimensions.height) {
        setFrameOrientation("vertical");
      } else {
        setFrameOrientation("horizontal");
      }
    }
    return ()=>{
      setFrameACoords(null)
    }
  }, [
    frameDimensions,
    editor,
    setFrame,
    setFrameOrientation,
    setFrameACoords,
    setFrameRatio,
  ]);

  // setup canvas and frame
  React.useEffect(() => {
    if (editor) {
      editor.canvas.canvas.selection = false; // disable group selection
      if (!canvas) setCanvas(editor.canvas.canvas);
      if (!frame) setFrame(editor.frame.frame);
    } else {
      setCanvas(null);
      setFrame(null);
      setActiveObject(null);
    }
  }, [editor, canvas, frame, setCanvas, setFrame, setActiveObject]);

  // handle initialization
  React.useEffect(() => {
    if (editor) {
      if (initialState) {
        setFrameDimensions({
          height: initialState.frameHeight,
          width: initialState.frameWidth,
        });
      } else {
        setFrameDimensions({
          height: 1080,
          width: 1920,
        });
      }
    }
  }, [
    editor,
    initialState,
    setFrameDimensions,
  ]);

  React.useEffect(() => {
    if (frameACoords && canvas && !hasInitialStateRendered && initialState) {
      console.log("drawing layers")
      var newLayers = drawLayers(
        initialState.layers,
        canvas,
        initialState.frameWidth,
        initialState.frameHeight,
        frameACoords.tl.x,
        frameACoords.tl.y
      );
      console.log(newLayers)
      setLayers((prev) => {
        return newLayers;
      });
      canvas.add(...newLayers.map(l => l.object));
      canvas.renderAll();
      setHasInitialStateRendered(true);
    }
  }, [initialState, canvas, frameACoords, hasInitialStateRendered, setLayers]);

  // event handlers & listeners
  React.useEffect(() => {
    if (canvas && frame) {
      // console.log("setting listeners")

      canvas.on("object:scaling", (e) => {
        if (!e.target) return;
        handleObjectScaling(e, frame);
      });

      // snap objects to frame
      canvas.on("object:moving", (e) => {
        handleObjectMoving(e, frame);
      });

      canvas.on("object:modified", (e) => {
        // ignore event if object is being scaled
        if (!e.target) return;
        var targetLeft = e.target.get("left");
        var targetTop = e.target.get("top");
        if (targetLeft !== undefined && targetTop !== undefined) {
          updateLayer(e.target, {
            x: roundToTwo(
              ((targetLeft - frame.aCoords.tl.x) / frame.width) * 100
            ),
            y: roundToTwo(
              ((targetTop - frame.aCoords.tl.y) / frame.height) * 100
            ),
            width: Math.min(
              roundToTwo((e.target.getScaledWidth() / frame.width) * 100),
              100
            ),
            height: Math.min(
              roundToTwo((e.target.getScaledHeight() / frame.height) * 100),
              100
            ),
          });
        }
      });

      canvas.on("selection:created", (e: IEvent) => {
        if (e?.selected?.length) {
          setActiveObjectByFabricObject(e.selected[0]);
        }
      });
      canvas.on("selection:updated", (e: IEvent) => {
        if (e?.selected?.length) {
          setActiveObjectByFabricObject(e.selected[0]);
        }
      });
      canvas.on("selection:cleared", (e) => {
        setActiveObject(null);
      });

      canvas.on("object:removed", (e) => {
        if (e.target) deleteLayer(e.target);
      });
    }
    return () => {
      if (canvas) {
        // remove event listeners on canvas
        canvas.off("object:moving");
        canvas.off("object:scaling");
        canvas.off("selection:created");
        canvas.off("selection:updated");
        canvas.off("selection:cleared");
      }
    };
  }, [
    canvas,
    frame,
    setActiveObject,
    setActiveObjectByFabricObject,
    deleteLayer,
    updateLayer,
  ]);

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        width: "100%",
      }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, display: "flex", position: "relative" }}>
          <Canvas
            config={{
              background: "#f1f2f6",
              controlsPosition: {
                rotation: "TOP",
              },
              id: "canvas",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MyCanvas;
