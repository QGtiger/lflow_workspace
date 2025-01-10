import { Handle, Position } from "@xyflow/react";
import { WorkflowNodeProps } from "../layoutEngine/utils";
import { memo, useRef } from "react";
import useNodeResize from "../hooks/useNodeResize";
import { useResizeObserver } from "../layoutEngine/useResizeObserver";

function LoopNode(props: WorkflowNodeProps) {
  const {
    id,
    data: { vw, vh, label },
  } = props;
  const nodeRef = useRef<HTMLDivElement>(null);
  const nodeResize = useNodeResize();
  // 视觉节点
  const visualNodeRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="loop-wrapper relative">
      <div
        className="mask absolute z-0 node-style "
        style={{
          width: `${vw}px`,
          height: `${vh}px`,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <div
          className="custom-node"
          ref={visualNodeRef}
          style={{
            transform: "translate(-1px, -1px)",
            width: `calc(100% + 2px)`,
          }}
        >
          {label}
        </div>
      </div>
      <div
        className="custom-node"
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
  );
}

export default memo(LoopNode);
