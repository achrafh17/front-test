import React from "react";
import useStore from "../../../../../store/store";
import CanvasObjectSettings from "./CanvasObjectSettings";
import LayoutSettings from "./LayoutSettings";


const SettingsTab : React.FC<{}> = () => {
  var activeObject  = useStore((state) => (state.activeObject));

  return (
    <>
      {activeObject ? (
        <CanvasObjectSettings canvasObject={activeObject} />
      ) : (
        <LayoutSettings />
      )}
    </>
  );
}
export default SettingsTab;