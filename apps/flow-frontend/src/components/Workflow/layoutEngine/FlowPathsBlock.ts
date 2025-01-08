import { Node } from "@xyflow/react";
import { FlowBlock } from "./FlowBlock";
import { FlowPathRuleBlock } from "./FlowPathRuleBlock";
import { EndNode, generateEdge, ReactFlowData } from "./utils";

export class FlowPathsBlock extends FlowBlock {
  children: FlowBlock[] = [];
  innerMb: number = 50;
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

  exportReactFlowDataByFlowBlock(): ReactFlowData {
    const childrenNodes = this.children.reduce(
      (acc, curr) => {
        const d = curr.exportReactFlowDataByFlowBlock();
        acc.nodes.push(...d.nodes);
        acc.edges.push(...d.edges);
        acc.startNodes.push(d.nodes[0]);
        acc.endNodes.push(d.endNode);
        return acc;
      },
      {
        nodes: [],
        edges: [],
        startNodes: [],
        endNodes: [],
      } as {
        nodes: ReactFlowData["nodes"];
        edges: ReactFlowData["edges"];
        startNodes: ReactFlowData["nodes"];
        endNodes: ReactFlowData["nodes"];
      }
    );

    const endNode = this.generateEndNode();

    const nextBlockData = this.next?.exportReactFlowDataByFlowBlock() || {
      nodes: [],
      edges: [],
      endNode,
    };

    const nodes = Array.prototype.concat.call(
      [],
      this.getNodeData(),
      childrenNodes.nodes,
      endNode,
      nextBlockData.nodes
    );

    const edges = Array.prototype.concat.call(
      [],
      (() => {
        return childrenNodes.startNodes.map((node) => {
          return generateEdge({
            sourceNode: this,
            targetNode: node,
            type: "pathsEdge",
          });
        });
      })(),
      childrenNodes.edges,
      (() => {
        return childrenNodes.endNodes.map((node) => {
          return generateEdge({
            sourceNode: node,
            targetNode: endNode,
            type: "endflowEdge",
          });
        });
      })(),
      (() => {
        const nextNode = nextBlockData.nodes.at(0);
        if (!nextNode) return [];
        return generateEdge({
          sourceNode: endNode,
          targetNode: nextNode,
        });
      })(),
      nextBlockData.edges
    );

    return { nodes, edges, endNode: nextBlockData.endNode };
  }
}
