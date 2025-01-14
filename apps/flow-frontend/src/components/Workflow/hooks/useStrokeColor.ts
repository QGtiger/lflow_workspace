import useLFStoreState from "./useLFStoreState";

export default function useStrokeColor() {
  const { strokeColor } = useLFStoreState();
  return strokeColor;
}
