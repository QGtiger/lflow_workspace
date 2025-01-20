import type { FlowLoopBlock } from "../layoutEngine/FlowLoopBlock";
import { isLoopBlock, uuid } from "../layoutEngine/utils";
import useLFStoreState from "./useLFStoreState";

export default function useLoopNode() {
  const { layoutEngine, rerender } = useLFStoreState();

  return {
    addInnerNode(id: string) {
      const b = layoutEngine.getBlockByCheckNodeExist(id);
      if (!isLoopBlock(b)) {
        throw new Error("addInnerNode 只能用在 循环 节点上");
      }
      (b as FlowLoopBlock).setInnerBlock(
        layoutEngine.generateBlock({
          id: uuid(),
        })
      );
      rerender();
    },
  };
}
