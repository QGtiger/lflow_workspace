import { Edge, Node } from "@xyflow/react";
import type { FlowBlock } from "./FlowBlock";
import type { FlowPathsBlock } from "./FlowPathsBlock";

export type ReactFlowData = { nodes: Node[]; edges: Edge[]; endNode: Node };

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
    currentBlock = currentBlock.next;
  }
}

export function isPathRuleNode(node: WorkflowNode) {
  return node.connectorCode === "PathRule";
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
