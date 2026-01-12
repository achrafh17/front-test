import  { StateCreator } from "zustand";
import { ICanvasObject } from "../types";

export interface ILayersSlice {
  layers: ICanvasObject[];
  addLayer: (newLayer: ICanvasObject) => void;
  updateLayer: (
    object: fabric.Object,
    newOptions: Partial<ICanvasObject>
  ) => void;
  deleteLayer: (object: fabric.Object) => void;
  setLayers: (fn: (oldLayers: ICanvasObject[]) => ICanvasObject[]) => void;
}

const createLayerSlice: StateCreator<ILayersSlice> = (set) => ({
  layers: [],
  addLayer: (newLayer) =>
    set((state) => ({
      layers: [...state.layers, newLayer],
    })),
  updateLayer: (object, newOptions) => {
    set((state) => {
      const newLayers = state.layers.concat().map((layer) => {
        if (layer.object === object) {
          return {
            ...layer,
            ...newOptions,
          };
        }
        return layer;
      });
      return {
        layers: newLayers,
      };
    });
  },
  deleteLayer: (object: fabric.Object) =>
    set((state) => {
      const newLayers = state.layers
        .concat()
        .filter((layer) => layer.object !== object);
      return {
        layers: newLayers,
      };
    }),
  setLayers: (fn) =>
    set((state) => ({
      layers: fn(state.layers),
    })),
});

export default createLayerSlice;
