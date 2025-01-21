import { FlowBlock } from "./FlowBlock";
import { RectInfer } from "./DisplayObject";
import { FlowPathsBlock } from "./FlowPathsBlock";
import { FlowPathRuleBlock } from "./FlowPathRuleBlock";
import {
  isLoopNode,
  isPathRuleNode,
  isPathsNode,
  traceAll,
  uuid,
} from "./utils";
import { FlowLoopBlock } from "./FlowLoopBlock";
import { generatePathRuleNode } from "./core/PathRuleConnector";
import { generateEmptyNode } from "./core";

export class LayoutEngine {
  rootId?: string;
  flowBlockMap: Record<string, FlowBlock> = {};
  viewWidthMap: Record<string, number> = {};
  initialNodes: WorkflowNode[] = [];

  constructor(nodes: WorkflowNode[]) {
    this.rootId = nodes[0].id;
    this.initialNodes = nodes;
    this.transferWrokflowNodeToFlowBlock({ nodes });
  }

  resizeNode(id: string, size: RectInfer) {
    const block = this.getBlockByCheckNodeExist(id);
    block.setRect(size);
  }

  getBlockByCheckNodeExist(id?: string) {
    if (!id) {
      throw new Error("id is required");
    }
    const block = this.flowBlockMap[id];
    if (!block) {
      throw new Error(`node ${id} not found`);
    }
    return block;
  }

  generateBlock(node: WorkflowNode) {
    let item: FlowBlock;
    const { initialNodes } = this;
    if (isLoopNode(node)) {
      // if (!node.children?.length) {
      //   throw new Error("循环 节点必须有 children");
      // }
      const innerNodeId = node.children?.[0];
      const innerBlock = innerNodeId
        ? this.transferWrokflowNodeToFlowBlock({
            nodes: initialNodes,
            startId: innerNodeId,
          })
        : this.generateBlock(generateEmptyNode());
      this.flowBlockMap[node.id] = item = new FlowLoopBlock(node, innerBlock);
    } else if (isPathsNode(node)) {
      // if (!node.children) {
      //   throw new Error("分支 节点必须有 children");
      // }
      const children = node.children?.length
        ? node.children.map((child) => {
            return this.transferWrokflowNodeToFlowBlock({
              nodes: initialNodes,
              startId: child,
            });
          })
        : [
            this.generateBlock(generatePathRuleNode()),
            this.generateBlock(generatePathRuleNode()),
          ];

      this.flowBlockMap[node.id] = item = new FlowPathsBlock(node, children);
    } else if (isPathRuleNode(node)) {
      this.flowBlockMap[node.id] = item = new FlowPathRuleBlock(node);
    } else {
      this.flowBlockMap[node.id] = item = new FlowBlock(node);
    }

    return item;
  }

  createFlowBlock(
    node: WorkflowNode,
    parentId?: string,
    inner?: boolean
  ): FlowBlock {
    const item = this.generateBlock(node);
    if (parentId) {
      const parentBlock = this.getBlockByCheckNodeExist(parentId);

      if (inner) {
        if (parentBlock instanceof FlowLoopBlock) {
          parentBlock.setInnerBlock(item);
        } else if (parentBlock instanceof FlowPathsBlock) {
          parentBlock.addChild(item);
        }
      } else {
        parentBlock.setNext(item);
      }
    } else {
      // 创建根节点
      this.rootId = item.id;
    }
    return item;
  }

  deleteFlowBlock(id: string) {
    this.getBlockByCheckNodeExist(id);
    delete this.flowBlockMap[id];
  }

  changeFlowBlockData(id: string, data: Omit<WorkflowNode, "id">) {
    const block = this.getBlockByCheckNodeExist(id);
    Object.assign(block.flowNodeData, data);
  }

  transferWrokflowNodeToFlowBlock(opts: {
    nodes: WorkflowNode[];
    startId?: string;
  }) {
    const { nodes, startId = this.rootId } = opts;

    const nodeMap: Record<string, WorkflowNode> = {};
    nodes.forEach((node) => {
      nodeMap[node.id] = node;
    });

    let node: WorkflowNode | undefined = nodeMap[startId!];
    if (!node || !startId) {
      throw new Error(`获取 transfer 首节点${startId}错误`);
    }

    let parentBlock: FlowBlock | undefined;

    while (node) {
      const block = this.createFlowBlock(node, parentBlock?.id);
      parentBlock = block;
      node = node.next ? nodeMap[node.next] : undefined;
    }

    return this.flowBlockMap[startId];
  }

  exportReactFlowData() {
    if (!this.rootId) {
      throw new Error("rootId is required");
    }
    const b = this.getBlockByCheckNodeExist(this.rootId);
    traceAll(b, (block) => {
      block.viewHeight = 0;
      block.viewWidth = 0;
    });
    const { nodes, edges, endNode } = b.exportReactFlowDataByFlowBlock();
    // const finalNode = {
    //   id: `final-end`,
    //   data: { label: "end", nodeData: {} },
    //   parentId: endNode.id,
    //   position: { x: 0, y: 0 },
    //   style: { width: 100, height: 1, visibility: "hidden" },
    //   type: "endflowNode",
    //   realParentId: this.rootId,
    // };
    return { nodes, edges, endNode };
  }

  exportFlowNodes() {
    const b = this.getBlockByCheckNodeExist(this.rootId);
    return b.exportFlowNodes();
  }
}
