import { uuid } from "../utils";

export function generateEmptyNode(): WorkflowNode {
  return {
    id: uuid(),
  };
}
