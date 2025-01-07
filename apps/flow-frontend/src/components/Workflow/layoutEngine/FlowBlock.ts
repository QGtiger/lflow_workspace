import { Edge, Node } from "@xyflow/react";
import { DisplayObject } from "./DisplayObject";
import { isPathRuleBlock, isPathsBlock } from "./utils";

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

  getNodeData(): Node {
    const { id, parent: parentBlock } = this;
    const ph = (() => {
      if (!parentBlock) return 0;
      if (isPathsBlock(parentBlock)) {
        return parentBlock.queryViewHeight();
      }
      return parentBlock.h;
    })();
    return {
      id: this.id,
      data: { label: id, nodeData: this.flowNodeData },
      parentId: parentBlock?.id,
      position: {
        x: parentBlock ? (parentBlock.w - this.w) / 2 : -this.w / 2,
        y: parentBlock ? parentBlock.mb + ph : 0,
      },
      type: "workflowNode",
    };
  }

  exportReactFlowDataByFlowBlock(): {
    nodes: Node[];
    edges: Edge[];
  } {
    const nextBlockData = this.next?.exportReactFlowDataByFlowBlock() || {
      nodes: [],
      edges: [],
    };

    const nodes = Array.prototype.concat.call(
      [],
      this.getNodeData(),
      nextBlockData.nodes
    );

    const edges = Array.prototype.concat.call(
      [],
      (() => {
        const nextNode = nextBlockData.nodes.at(0);
        if (!nextNode) return [];
        return {
          id: `${this.id}-${nextNode.id}`,
          source: this.id,
          target: nextNode.id,
        } as Edge;
      })(),
      nextBlockData.edges
    );

    return {
      nodes,
      edges,
    };
  }
}
