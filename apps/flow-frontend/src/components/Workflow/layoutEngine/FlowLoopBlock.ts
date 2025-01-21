import { generateEmptyNode } from "./core";
import { FlowBlock } from "./FlowBlock";
import {
  EndNode,
  generateEdge,
  generateNode,
  ReactFlowData,
  traceBlock,
} from "./utils";

export class FlowLoopBlock extends FlowBlock {
  innerBlock?: FlowBlock;
  innerMb: number = 50;
  // 左右padding
  padding: number = 40;

  constructor(public nodeData: WorkflowNode, innerBlock?: FlowBlock) {
    super(nodeData);
    this.setInnerBlock(innerBlock || new FlowBlock(generateEmptyNode()));
  }

  setInnerBlock(block?: FlowBlock, replace?: boolean) {
    if (this.innerBlock) {
      if (replace) {
        this.innerBlock.removeLink();
      } else {
        block?.setLastNext(this.innerBlock);
      }
    }
    this.innerBlock = block;
    if (block) {
      block.parent = this;
    }

    return block;
  }

  queryViewHeight(): number {
    if (this.viewHeight) return this.viewHeight;
    let vh = this.h + this.innerMb;
    if (this.innerBlock) {
      traceBlock(this.innerBlock, (block) => {
        vh += block.queryViewHeight() + block.mb;
      });
    }

    this.viewHeight = vh;
    return vh;
  }

  queryViewWidth(): number {
    if (this.viewWidth) return this.viewWidth;

    let vw = this.w;
    if (this.innerBlock) {
      traceBlock(this.innerBlock, (block) => {
        vw = Math.max(vw, block.queryViewWidth());
      });
    }

    this.viewWidth = vw + 2 * this.padding;
    return this.viewWidth;
  }

  generateEndNode(): EndNode {
    const lw = 100;
    return {
      id: `${this.id}-end`,
      data: { label: "end", nodeData: this.flowNodeData },
      parentId: this.id,
      position: {
        x: (this.w - lw) / 2,
        y: this.queryViewHeight(),
      },
      style: {
        width: lw,
        height: 1,
        visibility: "hidden",
      },
      type: "endflowNode",
      realParentId: this.id,
    };
  }

  get flowNodeData(): WorkflowNode {
    return {
      ...this.nodeData,
      next: this.next?.id,
      children: this.innerBlock ? [this.innerBlock.id] : [],
    };
  }

  /**
   * 导出 flowNodes
   */
  exportFlowNodes(): WorkflowNode[] {
    return Array.prototype.concat.call(
      [],
      this.flowNodeData,
      this.innerBlock?.exportFlowNodes() || [],
      this.next?.exportFlowNodes() || []
    );
  }

  exportReactFlowDataByFlowBlock(index: number = 1): ReactFlowData {
    if (!this.innerBlock) {
      throw new Error("innerBlock is required");
    }
    this.index = index;

    const endNode = this.generateEndNode();

    const innerChildNodes = this.innerBlock.exportReactFlowDataByFlowBlock(
      index + 1
    );

    const currNode = generateNode({
      block: this,
    });

    const nextBlockData = this.next?.exportReactFlowDataByFlowBlock(
      innerChildNodes.index
    ) || {
      nodes: [],
      edges: [],
      endNode,
      index: innerChildNodes.index,
    };

    const nodes = [
      currNode,
      ...innerChildNodes.nodes,
      endNode,
      ...nextBlockData.nodes,
    ];
    const edges = [
      generateEdge({
        sourceNode: currNode,
        targetNode: innerChildNodes.nodes[0],
        type: "LoopInnerEdge",
      }),
      ...innerChildNodes.edges,
      // generateEdge({
      //   sourceNode: innerChildNodes.endNode,
      //   targetNode: endNode,
      // }),
      ...(() => {
        const nextNode = nextBlockData.nodes.at(0);
        if (!nextNode) return [];
        return [
          generateEdge({
            sourceNode: endNode,
            targetNode: nextNode,
          }),
        ];
      })(),
      ...nextBlockData.edges,
    ];

    return {
      nodes,
      edges,
      endNode: nextBlockData.endNode,
      index: nextBlockData.index,
    };
  }
}
