import { useLatest, useUnmount } from "ahooks";
import { useCallback, useEffect, useRef } from "react";
import { BasicTarget, TargetValue } from "./types";
import { OberverCallback, ResizeObserverIns } from "./ResizeObserverDispatcher";

function getTargetElement(target: BasicTarget) {
  if (typeof target === "function") {
    return target();
  } else if ("current" in target) {
    return target.current;
  }
}

export function useResizeObserver(
  target: BasicTarget,
  handler: OberverCallback
) {
  const hasInitRef = useRef(false);

  const lastEleRef = useRef<TargetValue>();
  const unloadRef = useRef<any>();
  const handlerRef = useLatest(handler);

  // 副作用函数
  const effect = useCallback(() => {
    const targetEle = getTargetElement(target);
    if (!targetEle) return;
    const resizeListener: OberverCallback = (entry) => {
      handlerRef.current(entry);
    };
    ResizeObserverIns.observe(targetEle, resizeListener);
    return () => {
      ResizeObserverIns.unobserve(targetEle, resizeListener);
    };
  }, []);

  // 每次 render 都会执行
  useEffect(() => {
    const currEle = getTargetElement(target);

    if (!hasInitRef.current) {
      hasInitRef.current = true;

      lastEleRef.current = currEle;

      unloadRef.current = effect();
      return;
    }

    if (currEle !== lastEleRef.current) {
      unloadRef.current?.();

      lastEleRef.current = currEle;
      unloadRef.current = effect();
    }
  });

  useUnmount(() => {
    unloadRef.current?.();
  });
}
