import { BaseEdge, EdgeLabelRenderer, getStraightPath } from "@xyflow/react";
import useNewNode from "../hooks/useNewNode";
import { WflowEdgeProps } from "../layoutEngine/utils";

export default function StepflowEdge(props: WflowEdgeProps) {
  const { sourceX, sourceY, targetX, targetY, markerEnd, data } = props;
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  const add = useNewNode();

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: "#0984e3",
        }}
      />
      (
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
              add(data.parentId);
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
