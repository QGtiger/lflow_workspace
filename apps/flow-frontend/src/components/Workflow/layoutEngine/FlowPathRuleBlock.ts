import { FlowBlock } from "./FlowBlock";
import type { FlowPathsBlock } from "./FlowPathsBlock";
import { traceBlock } from "./utils";
import { Node } from "@xyflow/react";

export class FlowPathRuleBlock extends FlowBlock {
  queryViewHeight(this: FlowBlock): number {
    if (this.viewHeight) return this.viewHeight;
    let vh = this.h + this.mb;
    if (this.next) {
      traceBlock(this.next, (block) => {
        vh += block.queryViewHeight() + block.mb;
      });
    }

    this.viewHeight = vh;
    return vh;
  }

  queryViewWidth(): number {
    if (this.viewWidth) return this.viewWidth;
    let vw = this.w;
    if (this.next) {
      traceBlock(this.next, (block) => {
        vw = Math.max(vw, block.queryViewWidth());
      });
    }

    this.viewWidth = vw;
    return vw;
  }

  getNodeData(): Node {
    const { id, parent: parentBlock } = this;
    const parent = parentBlock as FlowPathsBlock;
    // 需要先计算一下父节点的宽度，才能拿到自己的位置
    parent.queryViewWidth();
    const vw = parent.childrenViewWidth;
    console.log(vw);
    let w = (parent.w - vw) / 2;

    const index = parent.children.indexOf(this);
    for (let i = 0; i < index; i++) {
      w += parent.children[i].queryViewWidth() + parent.oy;
    }

    return {
      id: this.id,
      data: { label: id, nodeData: this.flowNodeData },
      parentId: parent?.id,
      position: {
        x: w + (this.queryViewWidth() - this.w) / 2,
        y: parent ? parent.innerMb + parent.h : 0,
      },
      type: "workflowNode",
    };
  }
}
