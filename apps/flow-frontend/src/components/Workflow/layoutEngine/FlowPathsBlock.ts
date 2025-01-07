import { Node, Edge } from "@xyflow/react";
import { FlowBlock } from "./FlowBlock";
import { FlowPathRuleBlock } from "./FlowPathRuleBlock";

type ReactFlowData = { nodes: Node[]; edges: Edge[] };

export class FlowPathsBlock extends FlowBlock {
  children: FlowBlock[] = [];
  innerMb: number = 40;
  oy: number = 30;
  childrenViewWidth: number = 0;

  addChild(block: FlowPathRuleBlock, index: number = this.children.length) {
    if (!(block instanceof FlowPathRuleBlock)) {
      throw new Error("FlowPathsBlock can only add FlowPathRuleBlock");
    }
    this.children.splice(index, 0, block);
    block.parent = this;

    return block;
  }

  removeChild(block: FlowBlock) {
    const index = this.children.indexOf(block);
    if (index !== -1) {
      this.children.splice(index, 1);
      block.parent = undefined;
    }
  }

  queryViewHeight() {
    if (this.viewHeight) return this.viewHeight;
    const vh = Math.max(
      ...this.children.map((child) => child.queryViewHeight())
    );
    this.viewHeight = vh + this.h + this.innerMb;
    return this.viewHeight;
  }

  queryViewWidth(): number {
    if (this.viewWidth) return this.viewWidth;
    const vw = this.children.reduce((acc, child, index) => {
      return acc + child.queryViewWidth() + (index > 0 ? this.oy : 0);
    }, 0);

    this.childrenViewWidth = vw;

    this.viewWidth = Math.max(vw, this.w);
    return vw;
  }

  exportReactFlowDataByFlowBlock(): ReactFlowData {
    const childrenNodes = this.children.reduce(
      (acc, curr) => {
        const d = curr.exportReactFlowDataByFlowBlock();
        acc.nodes.push(...d.nodes);
        acc.edges.push(...d.edges);
        return acc;
      },
      {
        nodes: [],
        edges: [],
      } as ReactFlowData
    );

    const dd = super.exportReactFlowDataByFlowBlock();

    const nodes = Array.prototype.concat.call(
      [],
      dd.nodes,
      childrenNodes.nodes
    );

    const edges = Array.prototype.concat.call([], dd.edges);

    return { nodes, edges };
  }
}
