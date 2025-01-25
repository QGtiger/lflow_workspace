import { DisplayObject } from "./DisplayObject";
import {
  generateEdge,
  generateNode,
  isPathRuleBlock,
  ReactFlowData,
} from "./utils";

export class FlowBlock extends DisplayObject {
  next?: FlowBlock;
  parent?: FlowBlock;

  viewWidth: number = 0;
  viewHeight: number = 0;
  index: number = 0;
  get id() {
    return this.flowNodeData.id;
  }

  constructor(public nodeData: WorkflowNode) {
    super();
  }

  get flowNodeData(): WorkflowNode {
    return {
      ...this.nodeData,
      next: this.next?.id,
      sequence: this.index,
    };
  }

  set flowNodeData(node: WorkflowNodeData) {
    Object.assign(this.nodeData, node);
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

  /**
   * 导出 flowNodes
   */
  exportFlowNodes(): WorkflowNode[] {
    return Array.prototype.concat.call(
      [],
      this.flowNodeData,
      this.next?.exportFlowNodes() || []
    );
  }

  exportReactFlowDataByFlowBlock(index: number = 1): ReactFlowData {
    this.index = index;
    const currNode = generateNode({
      block: this,
    });
    const nextBlockData = this.next?.exportReactFlowDataByFlowBlock(
      index + 1
    ) || {
      nodes: [],
      edges: [],
      endNode: currNode,
      index: this.index + 1,
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
      index: nextBlockData.index,
    };
  }
}
