import { generateEmptyNode } from "../layoutEngine/core";
import { generatePathRuleNode } from "../layoutEngine/core/PathRuleConnector";
import { FlowLoopBlock } from "../layoutEngine/FlowLoopBlock";
import { FlowPathsBlock } from "../layoutEngine/FlowPathsBlock";
import useLFStoreState from "./useLFStoreState";

export default function useDelNode() {
  const { layoutEngine, rerender } = useLFStoreState();

  return (id: string, autoAddEmptyNode?: boolean) => {
    const b = layoutEngine.getBlockByCheckNodeExist(id);
    const { parent } = b;
    if (parent) {
      if (parent instanceof FlowLoopBlock && parent.innerBlock === b) {
        parent.setInnerBlock(b.next, true);
        // 只有一个节点，则添加一个空节点
        if (!b.next && autoAddEmptyNode) {
          layoutEngine.createFlowBlock(generateEmptyNode(), parent.id, true);
        }
      } else if (parent instanceof FlowPathsBlock && parent.hasChild(id)) {
        parent.removeChild(b);
        // 分支最少两个
        if (parent.children.length < 2) {
          parent.addChild(layoutEngine.generateBlock(generatePathRuleNode()));
        }
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
