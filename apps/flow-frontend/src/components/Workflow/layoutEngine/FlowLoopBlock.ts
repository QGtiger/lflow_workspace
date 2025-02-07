import { FlowBlock } from "./FlowBlock";
import {
  EndNode,
  generateEdge,
  generateNode,
  isEmptyNode,
  ReactFlowData,
  traceBlock,
} from "./utils";

export class FlowLoopBlock extends FlowBlock {
  innerBlock?: FlowBlock;
  innerMb: number = 40;
  // 左右padding
  padding: number = 40;

  constructor(public nodeData: WorkflowNode, innerBlock: FlowBlock) {
    super(nodeData);
    this.setInnerBlock(innerBlock);
  }

  setInnerBlock(block?: FlowBlock, replace?: boolean) {
    if (this.innerBlock) {
      // 如果 innerBlock 为空，则直接移除
      if (replace || isEmptyNode(this.innerBlock.flowNodeData)) {
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
    if (!this.open) return this.h;
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
    if (!this.open) return this.w;
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
      sequence: this.index,
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

  private open: boolean = true;

  fold() {
    this.open = false;
  }

  unfold() {
    this.open = true;
  }

  /**
   * 查询节点数量
   */
  queryNodeCount(): number {
    let count = 1;
    let b = this.innerBlock;
    while (b) {
      count += b.queryNodeCount();
      b = b.next;
    }
    return count;
  }

  exportReactFlowDataByFlowBlock(
    index: number = 1,
    offsetNext: number = 1
  ): ReactFlowData {
    if (!this.innerBlock) {
      throw new Error("innerBlock is required");
    }
    this.index = index;

    if (!this.open) {
      // 未展开
      return super.exportReactFlowDataByFlowBlock(index, this.queryNodeCount());
    }

    const endNode = this.generateEndNode();

    const innerChildNodes = this.innerBlock.exportReactFlowDataByFlowBlock(
      index + offsetNext
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
        type: "loopInnerEdge",
      }),
      ...innerChildNodes.edges,

      ...(isEmptyNode(innerChildNodes.nodes[0].data.nodeData)
        ? []
        : [
            generateEdge({
              sourceNode: innerChildNodes.endNode,
              targetNode: currNode,
              type: "loopCloseEdge",
            }),
          ]),
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
