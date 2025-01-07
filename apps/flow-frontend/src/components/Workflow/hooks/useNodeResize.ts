import useLFStoreState from "./useLFStoreState";

export default function useNodeResize() {
  const { nodeResize } = useLFStoreState();

  return nodeResize;
}
