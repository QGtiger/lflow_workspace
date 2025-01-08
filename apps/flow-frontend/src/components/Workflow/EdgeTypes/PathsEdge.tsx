import { BaseEdge, EdgeLabelRenderer, EdgeProps } from "@xyflow/react";
import useAddPathRule from "../hooks/useAddPathRule";

function getCustomSmoothStepPath(config: {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  radius: number;
}): [string, number, number] {
  const { sourceX, sourceY, targetX, targetY, radius } = config;
  const midY = sourceY + (targetY - sourceY) / 2;
  const f = sourceX > targetX ? 1 : -1;
  const sweepFlag = sourceX > targetX ? 1 : 0;

  const labelX = sourceX;
  const labelY = sourceY + 10; //;

  if (Math.abs(sourceX - targetX) < 2 * radius) {
    return [`M ${sourceX} ${sourceY} L ${targetX} ${targetY}`, labelX, labelY];
  }

  const path = [
    `M ${sourceX} ${sourceY}`,
    `L ${sourceX} ${midY - radius}`,
    `A ${radius} ${radius} 0 0 ${sweepFlag} ${sourceX - f * radius} ${midY}`,
    `L ${targetX + f * radius} ${midY}`,
    `A ${radius} ${radius} 0 0 ${Number(!sweepFlag)} ${targetX} ${
      midY + radius
    }`,
    `L ${targetX} ${targetY}`,
  ].join(" ");

  return [path, labelX, labelY];
}

export function PathsEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, markerEnd, data, source } = props;
  const [edgePath, labelX, labelY] = getCustomSmoothStepPath({
    radius: 3,
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  const addPath = useAddPathRule();

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
            className=" cursor-pointer text-xs"
            onClick={() => {
              addPath(source);
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
