import { memo, useEffect, useRef, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import cx from "classnames";

import { useResizeObserver } from "../layoutEngine/useResizeObserver";
import useNodeResize from "../hooks/useNodeResize";
import { WorkflowNodeProps } from "../layoutEngine/utils";
import ContextMenuDropDown from "./ContextMenuDropDown";
import useLFStoreState from "../hooks/useLFStoreState";

const WorkflowNode = (props: WorkflowNodeProps) => {
  // see the hook implementation for details of the click handler
  // calling onClick adds a child node to this node
  // const onClick = useNodeClickHandler(id);
  const { id, data, width, height } = props;
  const { selectedId } = useLFStoreState();
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
    <ContextMenuDropDown flowNode={data.nodeData}>
      <div
        ref={nodeRef}
        className={cx("work-flow-node", {
          " ring-1 ring-[#0984e3] border-[#0984e3]": selectedId === id,
        })}
        title="click to add a child node"
      >
        {data.index}.{data.nodeData.connectorName || "空白节点"}
        <Handle type="target" position={Position.Top} isConnectable={false} />
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={false}
        />
      </div>
    </ContextMenuDropDown>
  );
};

export default memo(WorkflowNode);
