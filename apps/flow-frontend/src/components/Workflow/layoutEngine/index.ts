import { FlowBlock } from "./FlowBlock";
import { RectInfer } from "./DisplayObject";
import { FlowPathsBlock } from "./FlowPathsBlock";
import { FlowPathRuleBlock } from "./FlowPathRuleBlock";
import {
  generateEdge,
  isLoopNode,
  isPathRuleNode,
  isPathsNode,
  traceAll,
  uuid,
  WflowNode,
} from "./utils";
import { FlowLoopBlock } from "./FlowLoopBlock";
import { generatePathRuleNode } from "./core/PathRuleConnector";
import { generateEmptyNode } from "./core";
import { cloneObject } from "../common/utils";

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

  getBlockByCheckNodeExist = (id?: string) => {
    if (!id) {
      throw new Error("id is required");
    }
    const block = this.flowBlockMap[id];
    if (!block) {
      throw new Error(`node ${id} not found`);
    }
    return block;
  };

  checkNodeByGeneraateId(node: WorkflowNode) {
    if (this.flowBlockMap[node.id]) {
      node.id = uuid();
    }
  }

  generateBlock = (
    cnode: WorkflowNode,
    forceWithId: boolean = true,
    renderingNodes: WorkflowNode[] = this.initialNodes
  ) => {
    let item: FlowBlock;
    const node = cloneObject(cnode);
    // 如果 forceWithId 为 true，则强制生成 唯一id
    if (forceWithId) {
      this.checkNodeByGeneraateId(node);
    }
    if (isLoopNode(node)) {
      const innerNodeId = node.children?.[0];
      const innerBlock = innerNodeId
        ? this.transferWrokflowNodeToFlowBlock({
            nodes: renderingNodes,
            startId: innerNodeId,
          })
        : this.generateBlock(generateEmptyNode(), forceWithId, renderingNodes);
      this.flowBlockMap[node.id] = item = new FlowLoopBlock(node, innerBlock);
    } else if (isPathsNode(node)) {
      const children = node.children?.length
        ? node.children.map((child) => {
            return this.transferWrokflowNodeToFlowBlock({
              nodes: renderingNodes,
              startId: child,
            });
          })
        : [
            this.generateBlock(
              generatePathRuleNode(),
              forceWithId,
              renderingNodes
            ),
            this.generateBlock(
              generatePathRuleNode(),
              forceWithId,
              renderingNodes
            ),
          ];

      this.flowBlockMap[node.id] = item = new FlowPathsBlock(node, children);
    } else if (isPathRuleNode(node)) {
      this.flowBlockMap[node.id] = item = new FlowPathRuleBlock(node);
    } else {
      this.flowBlockMap[node.id] = item = new FlowBlock(node);
    }

    return item;
  };

  insetBlockById = (opts: {
    block: FlowBlock;
    parentId?: string;
    inner?: boolean;
    isResetRoot?: boolean;
  }) => {
    const { block, parentId, inner, isResetRoot } = opts;
    if (parentId) {
      const parentBlock = this.getBlockByCheckNodeExist(parentId);

      if (inner) {
        if (parentBlock instanceof FlowLoopBlock) {
          parentBlock.setInnerBlock(block);
        } else if (parentBlock instanceof FlowPathsBlock) {
          parentBlock.addChild(block);
        }
      } else {
        parentBlock.setNext(block);
      }
    } else {
      if (isResetRoot) {
        this.rootId = block.id;
      }
    }
  };

  createFlowBlock(opts: {
    node: WorkflowNode;
    parentId?: string;
    inner?: boolean;
    forceWithId?: boolean;
    isResetRoot?: boolean;
    renderingNodes?: WorkflowNode[];
  }): FlowBlock {
    const { node, parentId, inner, forceWithId, isResetRoot, renderingNodes } =
      opts;
    const item = this.generateBlock(node, forceWithId, renderingNodes);

    this.insetBlockById({ block: item, parentId, inner, isResetRoot });
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

  transferWrokflowNodeToFlowBlock = (opts: {
    nodes: WorkflowNode[];
    startId?: string;
  }) => {
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
    let rootBlock: FlowBlock | undefined;

    while (node) {
      const block = this.createFlowBlock({
        node: node,
        parentId: parentBlock?.id,
        renderingNodes: nodes,
      });

      if (!rootBlock) {
        rootBlock = block;
      }

      parentBlock = block;
      node = node.next ? nodeMap[node.next] : undefined;
    }

    return rootBlock!;
  };

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

    const lw = 100;
    const parentId = endNode.realParentId || endNode.id;
    const parentBlock = this.getBlockByCheckNodeExist(parentId);
    const finalNode: WflowNode = {
      id: `final-end`,
      data: { label: "结束" } as any,
      parentId,
      position: {
        x: (parentBlock.w - lw) / 2,
        y: parentBlock.queryViewHeight() + parentBlock.mb,
      },
      style: {
        width: lw,
        height: 1,
        textAlign: "center",
        fontSize: 12,
        color: "#bbb",
        fontWeight: "bold",
      },
      type: "endflowNode",
    };
    return {
      nodes: nodes.concat([finalNode]),
      edges: edges.concat([
        generateEdge({
          sourceNode: endNode,
          targetNode: finalNode,
        }),
      ]),
      endNode,
    };
  }

  exportFlowNodes() {
    const b = this.getBlockByCheckNodeExist(this.rootId);
    return (this.initialNodes = b.exportFlowNodes());
  }
}
