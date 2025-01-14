import { useCallback } from "react";
import useLFStoreState from "./useLFStoreState";
import { RectInfer } from "../layoutEngine/DisplayObject";

// 两个数字是否太过于接近
function isClose(a: number, b: number) {
  return Math.abs(a - b) < 1;
}

export default function useNodeResize() {
  const { layoutEngine, rerender } = useLFStoreState();

  const nodeResize = useCallback((id: string, size: RectInfer) => {
    const b = layoutEngine.getBlockByCheckNodeExist(id);
    if (isClose(b.w, size.w) && isClose(b.h, size.h)) return;
    if (!size.w || !size.h) return;
    b.setRect(size);
    rerender();
  }, []);

  return nodeResize;
}
