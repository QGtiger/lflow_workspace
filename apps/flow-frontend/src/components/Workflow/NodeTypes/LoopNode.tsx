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
    <div className="loop-wrapper relative">
      <div
        className="mask absolute z-0 bg-slate-300 pointer-events-none"
        style={{
          width: `${vw}px`,
          height: `${vh}px`,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      ></div>
      <div className="custom-node" ref={nodeRef} onClick={() => {}}>
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
