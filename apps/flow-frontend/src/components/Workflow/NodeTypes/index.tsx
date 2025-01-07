import { NodeTypes } from "@xyflow/react";
import WorkflowNode from "./WorkflowNode";

// two different node types are needed for our example: workflow and placeholder nodes
const nodeTypes: NodeTypes = {
  workflowNode: WorkflowNode,
};

export default nodeTypes;
