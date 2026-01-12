import create from "zustand";
import createLayerSlice, {ILayersSlice} from "./LayersSlice";
import createCanvasSlice, {ICanvasSlice} from "./CommonSlice";
import createPickContentSlice, {IPickContentSlice} from "./PickContentSlice";
import createFrameSlice, {IFrameSlice} from "./FrameSlice";
import createAdminSlice, {IAdminSlice} from "./AdminSlice"

interface ICommonSlice {
  setActiveObjectByFabricObject: (object: fabric.Object) => void;
  errorMsg: string | null; // error message to display over the whole app in a snackbar (see AppLayout.tsx)
  setErrorMsg: (newError: string | null) => void; // error message setter
  successMsg: string | null; // success message to display over the whole app in a snackbar (see AppLayout.tsx)
  setSuccessMsg: (newSuccess: string | null) => void; // success message setter
}


const useStore = create<
  ILayersSlice & ICanvasSlice & ICommonSlice & IPickContentSlice & IFrameSlice & IAdminSlice
>()((...a) => ({
  ...createLayerSlice(...a),
  ...createCanvasSlice(...a),
  ...createPickContentSlice(...a),
  ...createFrameSlice(...a),
  ...createAdminSlice(...a),
  setActiveObjectByFabricObject: (object: fabric.Object) => {
    var set = a[0];
    set(({ layers }) => {
      var layer = layers.find((layer) => layer.object === object);
      return {
        activeObject: layer ?? null,
      };
    });
  },
  errorMsg: null,
  setErrorMsg: (newError) => {
    var set = a[0];
    set({ errorMsg: newError });
  },
  successMsg: null,
  setSuccessMsg: (newSuccess) => {
    var set = a[0];
    set({ successMsg: newSuccess });
  }

}));

export default useStore;
