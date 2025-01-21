import { Edge, EdgeProps, Node, NodeProps } from "@xyflow/react";
import type { FlowBlock } from "./FlowBlock";
import type { FlowPathsBlock } from "./FlowPathsBlock";
import { LoopNodeCode } from "./core/LoopConnector";
import { PathRuleCode } from "./core/PathRuleConnector";
import { PathsNodeCode } from "./core/PathsConnector";
import type { FlowLoopBlock } from "./FlowLoopBlock";

export type EndNode = WflowNode & { realParentId?: string };

export type ReactFlowData = {
  nodes: WflowNode[];
  edges: WflowEdge[];
  endNode: EndNode;
  index: number;
};
export type WflowEdge = Edge & { data: { parentId: string } };
export type WflowEdgeProps = EdgeProps & { data: { parentId: string } };
export type WflowNode = Node & {
  data: {
    nodeData: WorkflowNode;
    index?: number;
  };
};
export type WorkflowNodeProps = NodeProps & {
  data: {
    nodeData: WorkflowNode;
    label: string;
    vw: number;
    vh: number;
    index: number;
    [x: string]: any;
  };
};

export const uuid = (): string =>
  new Date().getTime().toString(36) + Math.random().toString(36).slice(2);

export function traceBlock(block: FlowBlock, cb: (b: FlowBlock) => void) {
  let currentBlock: FlowBlock | undefined = block;
  while (currentBlock) {
    cb(currentBlock);
    currentBlock = currentBlock.next;
  }
}

export function traceAll(block: FlowBlock, cb: (b: FlowBlock) => void) {
  let currentBlock: FlowBlock | undefined = block;
  while (currentBlock) {
    cb(currentBlock);
    if (isPathsBlock(currentBlock)) {
      for (const child of (currentBlock as FlowPathsBlock).children) {
        traceAll(child, cb);
      }
    }
    if (isLoopBlock(currentBlock)) {
      traceAll((currentBlock as any).innerBlock, cb);
    }
    currentBlock = currentBlock.next;
  }
}

export function isPathRuleNode(node: WorkflowNode) {
  return node.connectorCode === PathRuleCode;
}

export function isPathRuleBlock(block: FlowBlock) {
  return isPathRuleNode(block.flowNodeData);
}

export function isPathsNode(node: WorkflowNode) {
  return node.connectorCode === PathsNodeCode;
}

export function isPathsBlock(block: FlowBlock) {
  if (!block) return false;
  return isPathsNode(block.flowNodeData);
}

export function isLoopNode(node: WorkflowNode) {
  return node.connectorCode === LoopNodeCode;
}

export function isLoopBlock(block: FlowBlock) {
  return isLoopNode(block.flowNodeData);
}

export function generateEdge(config: {
  sourceNode: WflowNode;
  targetNode: WflowNode;
  type?: string;
}): WflowEdge {
  const { sourceNode, targetNode, type } = config;
  let _type = type || "stepflowEdge";

  if (targetNode.data?.nodeData && isEmptyNode(targetNode.data.nodeData)) {
    _type = "placeholderEdge";
  }
  if (sourceNode.data?.nodeData && isEmptyNode(sourceNode.data.nodeData)) {
    _type = "placeholderEdge";
  }

  return {
    id: `${sourceNode.id}-${targetNode.id}`,
    source: sourceNode.id,
    target: targetNode.id,
    type: _type,
    data: {
      parentId: (sourceNode as any).realParentId || sourceNode.id,
    },
    style: {
      visibility: "visible",
    },
  };
}

export function isEmptyNode(node: WorkflowNode) {
  return !node.connectorCode;
}

export function isInnerBlock(block: FlowBlock) {
  const { parent } = block;
  if (!parent) return false;
  if (isLoopBlock(parent)) {
    return (parent as FlowLoopBlock).innerBlock === block;
  }
  if (isPathsBlock(parent)) {
    return (parent as FlowPathsBlock).hasChild(block.id);
  }
  return false;
}

export function generateNode(config: { block: FlowBlock }): WflowNode {
  const { block } = config;
  const { parent: parentBlock } = block;
  const position: {
    x: number;
    y: number;
  } = (() => {
    if (!parentBlock)
      return {
        x: -block.w / 2,
        y: 0,
      };
    if (isPathsBlock(parentBlock)) {
      if (isPathRuleBlock(block)) {
        const pathBlock = parentBlock as FlowPathsBlock;
        pathBlock.queryViewWidth();

        const vw = pathBlock.childrenViewWidth;
        let w = (pathBlock.w - vw) / 2;
        const index = pathBlock.children.indexOf(block);
        for (let i = 0; i < index; i++) {
          w += pathBlock.children[i].queryViewWidth() + pathBlock.oy;
        }
        return {
          x: w + (block.queryViewWidth() - block.w) / 2,
          y: pathBlock.innerMb + pathBlock.h,
        };
      } else {
        return {
          x: (parentBlock.w - block.w) / 2,
          y: parentBlock.mb + parentBlock.queryViewHeight(),
        };
      }
    }
    if (isLoopBlock(parentBlock)) {
      if ((parentBlock as FlowLoopBlock).innerBlock !== block) {
        return {
          x: (parentBlock.w - block.w) / 2,
          y: parentBlock.mb + parentBlock.queryViewHeight(),
        };
      }
    }
    return {
      x: (parentBlock.w - block.w) / 2,
      y: parentBlock.mb + parentBlock.h,
    };
  })();

  let type = "placeholderNode";
  if (isLoopBlock(block)) {
    type = "loopNode";
  } else if (!isEmptyNode(block.flowNodeData)) {
    type = "workflowNode";
  }

  return {
    id: block.id,
    data: {
      label: block.id,
      nodeData: block.flowNodeData,
      vw: block.queryViewWidth(),
      vh: block.queryViewHeight(),
      index: block.index,
    },
    position,
    parentId: parentBlock?.id,
    type,
    style: {
      visibility: "visible",
    },
  };
}
