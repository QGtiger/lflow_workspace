import { memo, useRef, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import cx from "classnames";

import { useResizeObserver } from "../layoutEngine/useResizeObserver";
import useNodeResize from "../hooks/useNodeResize";
import { WorkflowNodeProps } from "../layoutEngine/utils";

const WorkflowNode = (props: WorkflowNodeProps) => {
  // see the hook implementation for details of the click handler
  // calling onClick adds a child node to this node
  // const onClick = useNodeClickHandler(id);
  const { id, data } = props;
  const nodeRef = useRef<HTMLDivElement>(null);
  const nodeResize = useNodeResize();

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
      className={cx("work-flow-node")}
      title="click to add a child node"
    >
      {data.label}
      <Handle type="target" position={Position.Top} isConnectable={false} />
      <Handle type="source" position={Position.Bottom} isConnectable={false} />
    </div>
  );
};

export default memo(WorkflowNode);
