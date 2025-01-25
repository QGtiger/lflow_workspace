interface WorkflowNode {
  id: string;

  connectorCode?: string;
  connectorName?: string;
  actionCode?: string;
  actionName?: string;
  logo?: string;
  version?: string;
  description?: string;

  sequence?: number;

  children?: WorkflowNode["id"][];
  next?: WorkflowNode["id"];

  inputs?: any;
  outputs?: any;

  outputsSchema?: any;
}

type WorkflowNodeData = Omit<WorkflowNode, "id" | "next" | "children">;

interface WorkflowNodeV2 {
  connectorCode: string;
  connectorName: string;
  actionCode: string;
  actionName: string;
  logo: string;
  version: string;
  description: string;
}
