import { BaseEdge, EdgeLabelRenderer, getStraightPath } from "@xyflow/react";
import { WflowEdgeProps } from "../layoutEngine/utils";
import useLoopNode from "../hooks/useLoopNode";

export default function LoopInnerEdge(props: WflowEdgeProps) {
  const { sourceX, sourceY, targetX, targetY, markerEnd, data } = props;
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  const { addInnerNode } = useLoopNode();

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} />(
      <EdgeLabelRenderer>
        <div
          className=" absolute pointer-events-auto"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            transformOrigin: "center",
          }}
        >
          <div
            className=" cursor-pointer text-xs bg-white border border-solid border-gray-400 rounded-md"
            onClick={() => {
              addInnerNode(data.parentId);
            }}
          >
            +
          </div>
        </div>
      </EdgeLabelRenderer>
      )
    </>
  );
}
