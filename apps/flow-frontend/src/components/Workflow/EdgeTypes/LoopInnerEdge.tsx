import { BaseEdge, EdgeLabelRenderer, getStraightPath } from "@xyflow/react";
import { WflowEdgeProps } from "../layoutEngine/utils";
import useLoopNode from "../hooks/useLoopNode";
import CommonAddButton from "./CommonAddButton";
import useStrokeColor from "../hooks/useStrokeColor";

export default function LoopInnerEdge(props: WflowEdgeProps) {
  const { sourceX, sourceY, targetX, targetY, markerEnd, data } = props;
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  const { addInnerNode } = useLoopNode();
  const strokeColor = useStrokeColor();

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: strokeColor,
        }}
      />
      <EdgeLabelRenderer>
        <div
          className=" absolute pointer-events-auto"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            transformOrigin: "center",
          }}
        >
          <CommonAddButton
            onClick={() => {
              addInnerNode(data.parentId);
            }}
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
