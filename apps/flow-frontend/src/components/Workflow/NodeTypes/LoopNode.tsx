import { Handle, Position } from "@xyflow/react";
import { WorkflowNodeProps } from "../layoutEngine/utils";
import { memo, useRef } from "react";
import useNodeResize from "../hooks/useNodeResize";
import { useResizeObserver } from "../layoutEngine/useResizeObserver";
import ContextMenuDropDown from "./ContextMenuDropDown";
import useLFStoreState from "../hooks/useLFStoreState";
import classNames from "classnames";

function LoopNode(props: WorkflowNodeProps) {
  const {
    id,
    data: { vw, vh, label, index, nodeData },
  } = props;
  const nodeRef = useRef<HTMLDivElement>(null);
  const nodeResize = useNodeResize();
  // 视觉节点
  const visualNodeRef = useRef<HTMLDivElement>(null);
  const { selectedId } = useLFStoreState();

  useResizeObserver(nodeRef, (entry) => {
    if (!id) return;
    const { offsetWidth, offsetHeight } = entry.target as HTMLDivElement;
    if (!offsetWidth || !offsetHeight) return;
    if (visualNodeRef.current) {
      visualNodeRef.current.style.height = `${offsetHeight}px`;
    }
    nodeResize(id, {
      w: offsetWidth,
      h: offsetHeight,
    });
  });

  const isSelected = selectedId === id;

  return (
    <ContextMenuDropDown flowNode={nodeData}>
      <div className="loop-wrapper relative">
        <div
          className={classNames("mask absolute z-0 node-style ", {
            " ring-1 ring-[#0984e3] border-[#0984e3]": isSelected,
          })}
          style={{
            width: `${vw}px`,
            height: `${vh}px`,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <div
            className={classNames("work-flow-node ", {
              " ring-1 ring-[#0984e3] border-[#0984e3]": isSelected,
            })}
            ref={visualNodeRef}
            style={{
              transform: "translate(-1px, -1px)",
              width: `calc(100% + 2px)`,
            }}
          >
            {index}.{label}
          </div>
        </div>
        <div
          className="work-flow-node "
          style={{
            visibility: "hidden",
          }}
          ref={nodeRef}
          onClick={() => {}}
        >
          {label}
          <Handle type="target" position={Position.Top} isConnectable={false} />
          <Handle
            type="source"
            position={Position.Bottom}
            isConnectable={false}
          />
        </div>
      </div>
    </ContextMenuDropDown>
  );
}

export default memo(LoopNode);
