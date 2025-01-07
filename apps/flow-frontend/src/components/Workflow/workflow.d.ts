interface WorkflowNode {
  id: string;

  connectorCode?: string;
  connectorName?: string;
  actionCode?: string;
  actionName?: string;
  logo?: string;
  version?: string;

  children?: WorkflowNode["id"][];
  next?: WorkflowNode["id"];

  inputs?: any;
  outputs?: any;

  outputsSchema?: any;
}
