import { Node } from "@xyflow/react";
import { FlowBlock } from "./FlowBlock";
import { FlowPathRuleBlock } from "./FlowPathRuleBlock";
import { ReactFlowData } from "./utils";

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

  generateEndNode(): Node {
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
    };

    const nodes = Array.prototype.concat.call(
      [],
      this.getNodeData(),
      childrenNodes.nodes,
      endNode,
      nextBlockData.nodes
    );

    console.log(
      childrenNodes.endNodes.map((node) => {
        return {
          id: `${node.id}-${endNode.id}`,
          source: node.id,
          target: endNode.id,
        };
      })
    );

    const edges = Array.prototype.concat.call(
      [],
      (() => {
        return childrenNodes.startNodes.map((node) => {
          return {
            id: `${this.id}-${node.id}`,
            source: this.id,
            target: node.id,
          };
        });
      })(),
      childrenNodes.edges,
      (() => {
        return childrenNodes.endNodes.map((node) => {
          return {
            id: `${node.id}-${endNode.id}`,
            source: node.id,
            target: endNode.id,
            type: "endflowEdge",
          };
        });
      })(),
      (() => {
        const nextNode = nextBlockData.nodes.at(0);
        if (!nextNode) return [];
        return {
          id: `${endNode.id}-${nextNode.id}`,
          source: endNode.id,
          target: nextNode.id,
        };
      })(),
      nextBlockData.edges
    );

    // const dd = super.exportReactFlowDataByFlowBlock();

    // const nodes = Array.prototype.concat.call(
    //   [],
    //   dd.nodes,
    //   childrenNodes.nodes
    // );

    // const edges = Array.prototype.concat.call(
    //   [],
    //   dd.edges,
    //   childrenNodes.edges
    // );

    return { nodes, edges, endNode };
  }
}
