import PathsLogo from "./assets/Paths.png";

export const PathsNodeCode = "Path";

export const PathsConnector: Connector = {
  code: PathsNodeCode,
  name: "分支",
  logo: PathsLogo,
  version: "1.0.0",
  description: "分支判断",
  actions: [
    {
      code: "branch",
      name: "分支",
      description: "互斥分支",
    },
    {
      code: "broadcast",
      name: "广播",
      description: "非互斥分支，从左到右依次执行",
    },
  ],
};
