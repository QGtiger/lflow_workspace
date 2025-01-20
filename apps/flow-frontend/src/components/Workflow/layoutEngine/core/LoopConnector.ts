import LoopLogo from "./assets/Loop.png";

export const LoopNodeCode = "Loop";

export const LoopConnectorNode: Connector = {
  code: LoopNodeCode,
  name: "循环",
  logo: LoopLogo,
  version: "1.0.0",
  description: "循环",
  actions: [
    {
      code: "for",
      name: "for",
      description: "for 循环",
    },
  ],
};
