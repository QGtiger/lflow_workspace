import { memo, useEffect, useRef } from "react";
import { Handle, Position } from "@xyflow/react";
import { WorkflowNodeProps } from "../layoutEngine/utils";
import useFlowNode from "../hooks/useFlowNode";
import useNodeResize from "../hooks/useNodeResize";
import { useResizeObserver } from "../layoutEngine/useResizeObserver";

const PlaceholderNode = (props: WorkflowNodeProps) => {
  const { replaceNode } = useFlowNode();

  const { id, width, height } = props;
  const nodeRef = useRef<HTMLDivElement>(null);
  const nodeResize = useNodeResize();

  useEffect(() => {
    if (!id || !width || !height) return;
    nodeResize(id, {
      w: width,
      h: height,
    });
  }, [width, height]);

  useResizeObserver(nodeRef, (entry) => {
    if (!id) return;
    const { offsetWidth, offsetHeight } = entry.target as HTMLDivElement;
    if (!offsetWidth || !offsetHeight) return;
    nodeResize(id, {
      w: offsetWidth,
      h: offsetHeight,
    });
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
