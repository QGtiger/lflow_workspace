import { FlowBlock } from "./FlowBlock";
import { RectInfer } from "./DisplayObject";
import { FlowPathsBlock } from "./FlowPathsBlock";
import { FlowPathRuleBlock } from "./FlowPathRuleBlock";
import { isLoopNode, isPathRuleNode, isPathsNode, traceAll } from "./utils";
import { FlowLoopBlock } from "./FlowLoopBlock";

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

  getBlockByCheckNodeExist(id: string) {
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
      if (!node.children?.length) {
        throw new Error("循环 节点必须有 children");
      }
      this.flowBlockMap[node.id] = item = new FlowLoopBlock(
        node,
        this.transferWrokflowNodeToFlowBlock({
          nodes: initialNodes,
          startId: node.children[0],
        })
      );
    } else if (isPathsNode(node)) {
      if (!node.children) {
        throw new Error("分支 节点必须有 children");
      }
      this.flowBlockMap[node.id] = item = new FlowPathsBlock(
        node,
        node.children.map((child) => {
          return this.transferWrokflowNodeToFlowBlock({
            nodes: initialNodes,
            startId: child,
          });
        })
      );
    } else if (isPathRuleNode(node)) {
      this.flowBlockMap[node.id] = item = new FlowPathRuleBlock(node);
    } else {
      this.flowBlockMap[node.id] = item = new FlowBlock(node);
    }

    return item;
  }

  createFlowBlock(node: WorkflowNode, parentId?: string): FlowBlock {
    const item = this.generateBlock(node);
    if (parentId) {
      const parentBlock = this.getBlockByCheckNodeExist(parentId);
      parentBlock.setNext(item);
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
    return b.exportReactFlowDataByFlowBlock();
  }
}
