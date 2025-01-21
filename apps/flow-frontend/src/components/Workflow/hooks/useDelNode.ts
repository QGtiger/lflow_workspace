import { FlowLoopBlock } from "../layoutEngine/FlowLoopBlock";
import { FlowPathsBlock } from "../layoutEngine/FlowPathsBlock";
import useLFStoreState from "./useLFStoreState";

export default function useDelNode() {
  const { layoutEngine, rerender } = useLFStoreState();

  return (id: string) => {
    const b = layoutEngine.getBlockByCheckNodeExist(id);
    const { parent } = b;
    if (parent) {
      if (parent instanceof FlowLoopBlock && parent.innerBlock === b) {
        parent.setInnerBlock(b.next, true);
      } else if (parent instanceof FlowPathsBlock && parent.hasChild(id)) {
        parent.removeChild(b);
      } else {
        parent.next = b.next;
        if (b.next) {
          b.next.parent = parent;
        }
      }
    } else {
      // 删除根节点
      layoutEngine.rootId = b.next?.id;
    }
    b.removeLink();

    layoutEngine.deleteFlowBlock(id);
    rerender();
  };
}
