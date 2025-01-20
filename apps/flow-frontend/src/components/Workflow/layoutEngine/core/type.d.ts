interface Connector {
  code: string;
  name: string;
  logo: string;
  version: string;
  description: string;

  actions: ConnectorAction[];
}

interface ConnectorAction {
  code: string;
  name: string;
  description: string;

  // 额外字段待补充 TODO
}
