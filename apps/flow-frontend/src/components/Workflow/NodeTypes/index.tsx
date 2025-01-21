import { NodeTypes } from "@xyflow/react";
import WorkflowNode from "./WorkflowNode";
import { EndFlowNode } from "./EndFlowNode";
import LoopNode from "./LoopNode";
import PlaceholderNode from "./PlaceholderNode";
import "./index.css";

// two different node types are needed for our example: workflow and placeholder nodes
const nodeTypes: NodeTypes = {
  workflowNode: WorkflowNode,
  endflowNode: EndFlowNode,
  loopNode: LoopNode,
  placeholderNode: PlaceholderNode,
};

export default nodeTypes;
