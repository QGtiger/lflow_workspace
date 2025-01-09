import { RectInfer } from "./DisplayObject";
import { FlowBlock } from "./FlowBlock";
import {
  EndNode,
  generateEdge,
  ReactFlowData,
  traceBlock,
  WflowEdge,
} from "./utils";

export class FlowLoopBlock extends FlowBlock {
  innerBlock: FlowBlock | null = null;
  innerMb: number = 50;
  // 左右padding
  padding: number = 20;

  setInnerBlock(block: FlowBlock) {
    if (this.innerBlock) {
      block.setLastNext(this.innerBlock);
    }
    this.innerBlock = block;
    block.parent = this;

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
        // visibility: "hidden",
      },
      type: "endflowNode",
      realParentId: this.id,
    };
  }

  exportReactFlowDataByFlowBlock(): ReactFlowData {
    if (!this.innerBlock) {
      throw new Error("innerBlock is required");
    }

    const endNode = this.generateEndNode();

    const innerChildNodes = this.innerBlock.exportReactFlowDataByFlowBlock();

    console.log("========Loop=====", {
      width: this.queryViewWidth(),
      height: this.queryViewHeight(),
    });

    const currNode = this.getNodeData({
      style: {
        width: this.queryViewWidth(),
        height: this.queryViewHeight(),
      },
    });

    const nextBlockData = this.next?.exportReactFlowDataByFlowBlock() || {
      nodes: [],
      edges: [],
      endNode,
    };

    const nodes = [
      currNode,
      ...innerChildNodes.nodes,
      endNode,
      ...nextBlockData.nodes,
    ];
    const edges = [
      // TODO 循环内线
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
      // { id: `${currNode.id}-${innerChildNodes.startNode.id}`, source: currNode.id, target: innerChildNodes.startNode.id, type: "smoothstep" },
      // { id: `${innerChildNodes.endNode.id}-${endNode.id}`, source: innerChildNodes.endNode.id, target: endNode.id, type: "smoothstep" },
    ];

    return {
      nodes,
      edges,
      endNode: nextBlockData.endNode,
    };
  }
}
