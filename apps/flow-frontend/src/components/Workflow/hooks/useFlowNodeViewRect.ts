import useFlowEngine from "./useFlowEngine";

export default function useFlowNodeViewRect(id: string) {
  const engine = useFlowEngine();
  try {
    const block = engine.getBlockByCheckNodeExist(id);
    return {
      vw: block.viewWidth,
      vh: block.viewHeight,
      w: block.w,
      h: block.h,
    };
  } catch (e) {
    return {
      vw: 0,
      vh: 0,
      w: 0,
      h: 0,
    };
  }
}
