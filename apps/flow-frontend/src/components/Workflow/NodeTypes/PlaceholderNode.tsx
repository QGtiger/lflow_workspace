import { memo, useEffect, useRef } from "react";
import { Handle, Position } from "@xyflow/react";
import { WorkflowNodeProps } from "../layoutEngine/utils";
import useFlowNode from "../hooks/useFlowNode";
import useFlowNodeResize from "./useFlowNodeResize";

const PlaceholderNode = (props: WorkflowNodeProps) => {
  const { replaceNode } = useFlowNode();

  const { id, width, height } = props;
  const nodeRef = useRef<HTMLDivElement>(null);

  useFlowNodeResize({
    id,
    width,
    height,
    nodeRef,
  });

  return (
    <div
      ref={nodeRef}
      className="work-flow-node placeholder-node"
      title="click to add a node"
      onClick={() => {
        replaceNode(props.id);
      }}
    >
      空白节点
      <Handle type="target" position={Position.Top} isConnectable={false} />
      <Handle type="source" position={Position.Bottom} isConnectable={false} />
    </div>
  );
};

export default memo(PlaceholderNode);
