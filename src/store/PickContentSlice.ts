import { StateCreator } from "zustand";

export interface IPickContentSlice {
  isPanelOpen: boolean;
  setIsPanelOpen: (isPanelOpen: boolean) => void;
  panelCallback: ((imageURL: string) => void) | null;
  setPanelCallback: (callback: (imageURL: string) => void) => void;
}

const createPickContentSlice: StateCreator<IPickContentSlice> = (set) => ({
  isPanelOpen: false,
  setIsPanelOpen: (isPanelOpen) =>
    set((state) => ({
      isPanelOpen: isPanelOpen,
    })),
  panelCallback: null,
  setPanelCallback: (callback) =>
    set((state) => ({
      panelCallback: callback,
    })),
});

export default createPickContentSlice;
