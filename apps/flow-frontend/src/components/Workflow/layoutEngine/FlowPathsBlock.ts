import { FlowBlock } from "./FlowBlock";
import { FlowPathRuleBlock } from "./FlowPathRuleBlock";
import { EndNode, generateEdge, generateNode, ReactFlowData } from "./utils";
export class FlowPathsBlock extends FlowBlock {
  children: FlowPathRuleBlock[] = [];
  innerMb: number = 50;
  oy: number = 30;
  childrenViewWidth: number = 0;

  constructor(public nodeData: WorkflowNode, children: FlowPathRuleBlock[]) {
    super(nodeData);
    children.forEach((child) => {
      this.addChild(child);
    });
  }

  hasChild(id: string) {
    return this.children.some((child) => child.id === id);
  }

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

  get flowNodeData(): WorkflowNode {
    return {
      ...this.nodeData,
      next: this.next?.id,
      children: this.children.map((t) => t.id),
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
      ...this.children.reduce((res, cur) => {
        res.push(...cur.exportFlowNodes());
        return res;
      }, [] as WorkflowNode[]),
      this.next?.exportFlowNodes() || []
    );
  }

  exportReactFlowDataByFlowBlock(index: number = 1): ReactFlowData {
    this.index = index;
    const currNode = generateNode({
      block: this,
    });
    const childrenNodes = this.children.reduce(
      (acc, curr) => {
        const d = curr.exportReactFlowDataByFlowBlock(acc.preIndex);
        acc.nodes.push(...d.nodes);
        acc.edges.push(...d.edges);
        acc.startNodes.push(d.nodes[0]);
        acc.endNodes.push(d.endNode);
        acc.preIndex = d.index;
        return acc;
      },
      {
        nodes: [],
        edges: [],
        startNodes: [],
        endNodes: [],
        preIndex: index + 1,
      } as {
        nodes: ReactFlowData["nodes"];
        edges: ReactFlowData["edges"];
        startNodes: ReactFlowData["nodes"];
        endNodes: ReactFlowData["nodes"];
        preIndex: number;
      }
    );

    const endNode = this.generateEndNode();

    const nextBlockData = this.next?.exportReactFlowDataByFlowBlock(
      childrenNodes.preIndex
    ) || {
      nodes: [],
      edges: [],
      endNode,
      index: childrenNodes.preIndex,
    };

    const nodes = Array.prototype.concat.call(
      [],
      currNode,
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

    return {
      nodes,
      edges,
      endNode: nextBlockData.endNode,
      index: nextBlockData.index,
    };
  }
}
