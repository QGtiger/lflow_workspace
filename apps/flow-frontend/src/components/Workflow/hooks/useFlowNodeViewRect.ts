import useFlowEngine from "./useFlowEngine";

export default function useFlowNodeViewRect(id: string) {
  const engine = useFlowEngine();
  const block = engine.getBlockByCheckNodeExist(id);
  return {
    vw: block.viewWidth,
    vh: block.viewHeight,
    w: block.w,
    h: block.h,
  };
}
