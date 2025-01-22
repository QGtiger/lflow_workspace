import useLFStoreState from "./useLFStoreState";

export default function useFlowEngine() {
  const { layoutEngine } = useLFStoreState();
  return layoutEngine;
}
