import { useContext } from "react";
import { useStore } from "zustand";
import { StoreContext } from "../model";

export default function useLFStoreState() {
  const store = useContext(StoreContext);
  return useStore(store);
}
