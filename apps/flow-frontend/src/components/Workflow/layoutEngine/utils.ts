import { Edge, EdgeProps, Node, NodeProps } from "@xyflow/react";
import type { FlowBlock } from "./FlowBlock";
import type { FlowPathsBlock } from "./FlowPathsBlock";
import { PathRuleCode } from "../hooks/useAddPathRule";
import { LoopNodeCode } from "../hooks/useLoopNode";

export type EndNode = Node & { realParentId?: string };

export type ReactFlowData = {
  nodes: Node[];
  edges: WflowEdge[];
  endNode: EndNode;
};
export type WflowEdge = Edge & { data: { parentId: string } };
export type WflowEdgeProps = EdgeProps & { data: { parentId: string } };
export type WorkflowNodeProps = NodeProps & {
  data: {
    nodeData: WorkflowNode;
    label: string;
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
  return node.connectorCode === "Path";
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
  sourceNode: { id: string };
  targetNode: { id: string };
  type?: string;
}): WflowEdge {
  const { sourceNode, targetNode, type } = config;
  return {
    id: `${sourceNode.id}-${targetNode.id}`,
    source: sourceNode.id,
    target: targetNode.id,
    type: type || "stepflowEdge",
    data: {
      parentId: (sourceNode as any).realParentId || sourceNode.id,
    },
  };
}

export function generateNode(config: {}) {}
