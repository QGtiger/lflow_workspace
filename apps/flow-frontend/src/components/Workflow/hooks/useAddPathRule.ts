import { generatePathRuleNode } from "../layoutEngine/core/PathRuleConnector";
import type { FlowPathsBlock } from "../layoutEngine/FlowPathsBlock";
import { isPathsBlock } from "../layoutEngine/utils";
import useLFStoreState from "./useLFStoreState";

export default function useAddPathRule() {
  const { layoutEngine, rerender } = useLFStoreState();

  const addPathRule = (parentId: string) => {
    const b = layoutEngine.getBlockByCheckNodeExist(parentId);
    if (!isPathsBlock(b)) {
      throw new Error("only Path block can add PathRule");
    }
    (b as FlowPathsBlock).addChild(
      layoutEngine.generateBlock(generatePathRuleNode())
    );
    rerender();
  };

  return addPathRule;
}
