import { StateCreator } from "zustand";

export interface IAdminSlice {
    token: string;
    userToPerformActionOn: number | null;
    setUserToPerformActionOn : (newUser: number| null) =>void;
    onConfirm: () => void;
    setOnConfirm: (newOnConfirm: ()=>void) => void;
    successState: boolean;
    setSuccessState: (newSuccessState: boolean) => void;
    failState: boolean;
    setFailState: (newOnFailure: boolean) => void;
}

const createAdminSlice: StateCreator<IAdminSlice> = (set) => ({
    token: "6ToacaobpcW11Kliavu55JQOFrILnIMNDd7q1o06X7egG1puCzEtWykLTsKZkyxl",
    userToPerformActionOn: null,
    setUserToPerformActionOn: (newUser) => {
      set({ userToPerformActionOn: newUser });
    },
    onConfirm: () => {},
    setOnConfirm: (newOnConfirm) => {
      set({ onConfirm: newOnConfirm });
    },
    successState: false,
    setSuccessState:(newSuccessState ) => {
      set({successState: newSuccessState})
    },
    failState: false,
    setFailState: (newFailState) => {
      set({ failState: newFailState });
    }
});

export default createAdminSlice;
