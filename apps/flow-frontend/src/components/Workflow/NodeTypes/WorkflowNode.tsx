import { memo, useRef } from "react";
import { Handle, Position } from "@xyflow/react";
import cx from "classnames";
import { WorkflowNodeProps } from "../layoutEngine/utils";
import ContextMenuDropDown from "./ContextMenuDropDown";
import useLFStoreState from "../hooks/useLFStoreState";
import useFlowNodeResize from "./useFlowNodeResize";

const WorkflowNode = (props: WorkflowNodeProps) => {
  // see the hook implementation for details of the click handler
  // calling onClick adds a child node to this node
  // const onClick = useNodeClickHandler(id);
  const { id, data, width, height } = props;
  const { selectedId } = useLFStoreState();
  const nodeRef = useRef<HTMLDivElement>(null);

  useFlowNodeResize({
    id,
    width,
    height,
    nodeRef,
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
