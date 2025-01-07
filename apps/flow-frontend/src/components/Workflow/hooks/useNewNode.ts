import useLFStoreState from "./useLFStoreState";

export default function useNewNode() {
  const { addNewNode } = useLFStoreState();

  return addNewNode;
}
