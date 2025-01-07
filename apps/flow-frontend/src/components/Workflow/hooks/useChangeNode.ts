import useLFStoreState from "./useLFStoreState";

export default function useChangeNode() {
  const { changeNodeData } = useLFStoreState();

  return changeNodeData;
}
