import useLFStoreState from "./useLFStoreState";

export default function useDelNode() {
  const { deleteNode } = useLFStoreState();

  return deleteNode;
}
