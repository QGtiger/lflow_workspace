import { BaseEdge, getStraightPath } from "@xyflow/react";
import { WflowEdgeProps } from "../layoutEngine/utils";
import useStrokeColor from "../hooks/useStrokeColor";

export default function PlaceholderEdge(props: WflowEdgeProps) {
  const { sourceX, sourceY, targetX, targetY, markerEnd } = props;
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  const strokeColor = useStrokeColor();

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        stroke: strokeColor,
        strokeDasharray: "3 3",
      }}
    />
  );
}
