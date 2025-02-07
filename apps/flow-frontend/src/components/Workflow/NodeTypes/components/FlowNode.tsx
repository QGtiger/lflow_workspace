export default function FlowNode(props: {
  nodeData: WorkflowNode;
  index: number;
}) {
  const { nodeData, index } = props;
  return (
    <div className="py-2 px-4">
      <div className="header flex items-center gap-2">
        <img
          src={nodeData.logo}
          alt=""
          className="w-4 h-4 overflow-hidden rounded-full"
        />
        <div className="text-xs font-medium text-gray-500">
          {index}. {nodeData.connectorName}
        </div>
      </div>
      <div className="content mt-2">
        <div className="text-sm text-gray-800">{nodeData.description}</div>
      </div>
    </div>
  );
}
