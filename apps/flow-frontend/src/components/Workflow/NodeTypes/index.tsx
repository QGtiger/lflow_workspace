import { NodeTypes } from "@xyflow/react";
import WorkflowNode from "./WorkflowNode";
import { EndFlowNode } from "./EndFlowNode";
import "./index.css";
import LoopNode from "./LoopNode";

// two different node types are needed for our example: workflow and placeholder nodes
const nodeTypes: NodeTypes = {
  workflowNode: WorkflowNode,
  endflowNode: EndFlowNode,
  loopNode: LoopNode,
};

export default nodeTypes;
