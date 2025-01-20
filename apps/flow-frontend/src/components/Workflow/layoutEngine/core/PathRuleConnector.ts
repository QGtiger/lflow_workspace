import { uuid } from "../utils";
import PathRuleLogo from "./assets/PathRule.png";

export const PathRuleCode = "PathRule";

export const PathRuleConnector: Connector = {
  code: PathRuleCode,
  name: "路径规则",
  logo: PathRuleLogo,
  version: "1.0.0",
  description: "路径规则",
  actions: [
    {
      code: "rule",
      name: "规则",
      description: "规则",
    },
    {
      code: "else",
      name: "否则",
      description: "否则",
    },
  ],
};

export function generatePathRuleNode(): WorkflowNode {
  return {
    id: uuid(),
    connectorCode: PathRuleCode,
    connectorName: PathRuleConnector.name,
    version: PathRuleConnector.version,
    logo: PathRuleConnector.logo,
    description: PathRuleConnector.actions[0].description,

    actionCode: PathRuleConnector.actions[0].code,
    actionName: PathRuleConnector.actions[0].name,
  };
}
