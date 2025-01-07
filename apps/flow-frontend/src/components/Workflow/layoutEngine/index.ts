import { Edge, Node } from "@xyflow/react";
import { FlowBlock } from "./FlowBlock";
import { RectInfer } from "./DisplayObject";

export class LayoutEngine {
  rootId?: string;
  private flowBlockMap: Record<string, FlowBlock> = {};

  constructor(nodes: WorkflowNode[]) {
    this.transferWrokflowNodeToFlowBlock({ nodes, startIndex: 0 });
  }

  resizeNode(id: string, size: RectInfer) {
    const block = this.getBlockByCheckNodeExist(id);
    block.setRect(size);
  }

  getBlockByCheckNodeExist(id: string) {
    const block = this.flowBlockMap[id];
    if (!block) {
      throw new Error(`node ${id} not found`);
    }
    return block;
  }

  createFlowBlock(node: WorkflowNode, parentId?: string): FlowBlock {
    const item = new FlowBlock(node);
    this.flowBlockMap[node.id] = item;
    if (parentId) {
      const parentBlock = this.getBlockByCheckNodeExist(parentId);
      parentBlock.setNext(item);
    } else {
      if (this.rootId !== node.id) {
        throw new Error("创建节点必须添加至其他节点");
      }
    }

    return item;
  }

  deleteFlowBlock(id: string) {
    const block = this.getBlockByCheckNodeExist(id);
    delete this.flowBlockMap[id];
    block.break();
  }

  changeFlowBlockData(id: string, data: Omit<WorkflowNode, "id">) {
    const block = this.getBlockByCheckNodeExist(id);
    Object.assign(block.flowNodeData, data);
  }

  transferWrokflowNodeToFlowBlock(opts: {
    nodes: WorkflowNode[];
    startIndex?: number;
  }) {
    const { nodes, startIndex = 0 } = opts;
    let node: WorkflowNode | undefined = nodes[startIndex];
    if (!node) {
      throw new Error("获取首节点错误");
    }
    this.rootId = node.id;

    let parentBlock: FlowBlock | undefined;

    const nodeMap: Record<string, WorkflowNode> = {};
    nodes.forEach((node) => {
      nodeMap[node.id] = node;
    });

    while (node) {
      const block = this.createFlowBlock(node, parentBlock?.id);
      parentBlock = block;
      node = node.next ? nodeMap[node.next] : undefined;
    }
  }

  private getNodeData(id: string): Node {
    const block = this.flowBlockMap[id];
    const parentBlock = block.parent;
    return {
      id,
      data: { label: id, nodeData: this.flowBlockMap[id].flowNodeData },
      parentId: parentBlock?.id,
      position: {
        x: parentBlock ? (parentBlock.w - block.w) / 2 : -block.w / 2,
        y: parentBlock ? parentBlock.mb + parentBlock.h : 0,
      },
      type: "workflowNode",
    };
  }

  exportReactFlowDataByFlowBlock(block?: FlowBlock): {
    nodes: Node[];
    edges: Edge[];
  } {
    if (!block) {
      return {
        nodes: [],
        edges: [],
      };
    }
    // 区分分支 循环
    // const nodes: WorkflowNode[] = [];
    // const edges: any[] = [];
    // let blockId = block.id;
    // while (blockId) {
    //   const node = this.nodeMap[blockId];
    //   if (!node) {
    //     throw new Error(`node ${blockId} not found`);
    //   }
    //   nodes.push(node);
    //   if (block.next) {
    //     edges.push({
    //       id: `${block.id}-${block.next.id}`,
    //       source: block.id,
    //       target: block.next.id,
    //     });
    //   }
    //   blockId = block.next?.id;
    // }

    const nextBlockData = this.exportReactFlowDataByFlowBlock(block.next);
    const nodes = Array.prototype.concat.call(
      [],
      this.getNodeData(block.id),
      nextBlockData.nodes
    );

    const edges = Array.prototype.concat.call(
      [],
      (() => {
        const nextNode = nextBlockData.nodes.at(0);
        if (!nextNode) return [];
        return {
          id: `${block.id}-${nextNode.id}`,
          source: block.id,
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

  exportReactFlowData() {
    if (!this.rootId) {
      throw new Error("rootId is required");
    }
    return this.exportReactFlowDataByFlowBlock(this.flowBlockMap[this.rootId!]);
  }
}
