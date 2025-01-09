import { Node } from "@xyflow/react";
import { DisplayObject } from "./DisplayObject";
import {
  generateEdge,
  isLoopBlock,
  isPathRuleBlock,
  isPathsBlock,
  ReactFlowData,
} from "./utils";
import type { FlowLoopBlock } from "./FlowLoopBlock";

export class FlowBlock extends DisplayObject {
  next?: FlowBlock;
  parent?: FlowBlock;

  viewWidth: number = 0;
  viewHeight: number = 0;

  get id() {
    return this.flowNodeData.id;
  }

  constructor(public flowNodeData: WorkflowNode) {
    super();
  }

  setLastNext(block: FlowBlock) {
    if (this.next) {
      this.next.setLastNext(block);
    } else {
      this.setNext(block);
    }
  }

  setNext(block?: FlowBlock) {
    if (!block) {
      this.next = undefined;
      return this;
    }

    if (isPathRuleBlock(block)) {
      throw new Error("FlowBlock can't set FlowPathRuleBlock next");
    }

    if (this.next) {
      block.setNext(this.next);
    }
    this.next = block;
    block.parent = this;

    return block;
  }

  break() {
    const { parent } = this;
    if (parent) {
      parent.next = this.next;
      if (this.next) {
        this.next.parent = parent;
      }
    }

    this.removeLink();
  }

  /**
   * 移除所有的链接,清除引用
   */
  removeLink() {
    this.next = undefined;
    this.parent = undefined;
  }

  queryViewHeight() {
    return this.h;
  }

  queryViewWidth() {
    return this.w;
  }

  getNodeData(opt?: { type?: string }): Node {
    const { id, parent: parentBlock } = this;
    const ph = (() => {
      if (!parentBlock) return 0;
      if (isPathsBlock(parentBlock)) {
        return parentBlock.queryViewHeight();
      }
      if (isLoopBlock(parentBlock)) {
        if ((parentBlock as FlowLoopBlock).innerBlock === this) {
          return parentBlock.h;
        }
        return parentBlock.queryViewHeight();
      }
      return parentBlock.h;
    })();
    return {
      id: this.id,
      data: {
        label: id,
        nodeData: this.flowNodeData,
        vh: this.queryViewHeight(),
        vw: this.queryViewWidth(),
      },
      parentId: parentBlock?.id,
      position: {
        x: parentBlock ? (parentBlock.w - this.w) / 2 : -this.w / 2,
        y: parentBlock ? parentBlock.mb + ph : 0,
      },
      type: opt?.type || "workflowNode",
      style: {
        visibility: "visible",
      },
    };
  }

  exportReactFlowDataByFlowBlock(): ReactFlowData {
    const currNode = this.getNodeData();
    const nextBlockData = this.next?.exportReactFlowDataByFlowBlock() || {
      nodes: [],
      edges: [],
      endNode: currNode,
    };

    const nodes = Array.prototype.concat.call(
      [],
      currNode,
      nextBlockData.nodes
    );

    const edges = Array.prototype.concat.call(
      [],
      (() => {
        const nextNode = nextBlockData.nodes.at(0);
        if (!nextNode) return [];
        return generateEdge({
          sourceNode: this,
          targetNode: nextNode,
        });
      })(),
      nextBlockData.edges
    );

    return {
      nodes,
      edges,
      endNode: nextBlockData.endNode,
    };
  }
}
