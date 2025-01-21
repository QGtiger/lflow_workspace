import { BaseEdge, EdgeLabelRenderer, getStraightPath } from "@xyflow/react";
import { WflowEdgeProps } from "../layoutEngine/utils";
import CommonAddButton from "./CommonAddButton";
import useStrokeColor from "../hooks/useStrokeColor";
import useFlowNode from "../hooks/useFlowNode";

export default function LoopInnerEdge(props: WflowEdgeProps) {
  const { sourceX, sourceY, targetX, targetY, markerEnd, data } = props;
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  const { addNodeByEdge } = useFlowNode();
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
              addNodeByEdge(data.parentId, true);
            }}
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
