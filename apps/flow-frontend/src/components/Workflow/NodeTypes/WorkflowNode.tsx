import { memo, useRef } from "react";
import { Handle, Position } from "@xyflow/react";
import cx from "classnames";
import { WorkflowNodeProps } from "../layoutEngine/utils";
import ContextMenuDropDown from "./ContextMenuDropDown";
import useLFStoreState from "../hooks/useLFStoreState";
import useFlowNodeResize from "./useFlowNodeResize";
import FlowNode from "./components/FlowNode";

const WorkflowNode = (props: WorkflowNodeProps) => {
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
        <FlowNode nodeData={data.nodeData} index={data.index} />
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
