import { uuid } from "../utils";
import { LoopConnectorNode } from "./LoopConnector";
import { PathRuleConnector } from "./PathRuleConnector";
import { PathsConnector } from "./PathsConnector";
import StartLogo from "./assets/Start.png";

export function generateEmptyNode(): WorkflowNode {
  return {
    id: uuid(),
  };
}

const startConnector: Connector = {
  code: "Start",
  name: "开始",
  logo: StartLogo,
  version: "1.0.0",
  description: "开始",
  actions: [],
};

export const buildInConncetor: Connector[] = [
  PathRuleConnector,
  PathsConnector,
  LoopConnectorNode,
  startConnector,
];
