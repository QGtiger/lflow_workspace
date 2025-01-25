import { uuid } from "../utils";
import { LoopConnectorNode } from "./LoopConnector";
import { PathRuleConnector } from "./PathRuleConnector";
import { PathsConnector } from "./PathsConnector";
import StartLogo from "./assets/Start.png";
import FeishuLogo from "./assets/Feishu.png";
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

const feishuConnector: Connector = {
  code: "Feishu",
  name: "飞书",
  logo: FeishuLogo,
  version: "1.0.0",
  description: "飞书",
  actions: [
    {
      code: "SendMessage",
      name: "发送消息",
      description: "发送消息",
    },
  ],
};

export const buildInConncetor: Connector[] = [
  PathRuleConnector,
  PathsConnector,
  LoopConnectorNode,
  startConnector,
  feishuConnector,
];
