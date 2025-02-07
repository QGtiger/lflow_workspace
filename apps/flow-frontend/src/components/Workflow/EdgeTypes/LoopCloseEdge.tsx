import { BaseEdge, EdgeLabelRenderer, XYPosition } from "@xyflow/react";
import CommonAddButton from "./CommonAddButton";
import useStrokeColor from "../hooks/useStrokeColor";
import useFlowNode from "../hooks/useFlowNode";
import { WflowEdgeProps } from "../layoutEngine/utils";
import useFlowNodeViewRect from "../hooks/useFlowNodeViewRect";

type P = Partial<XYPosition>;

function MakeLine(opts: { points: P[] }) {
  const result = opts.points.reduce(
    (res, cur) => {
      const { path, prePoint } = res;
      const c = {
        ...prePoint,
        ...cur,
      };
      if (!path) {
        res.path = `M${c.x || 0} ${c.y || 0}`;
      } else {
        res.path += ` L${c.x || 0} ${c.y || 0}`;
      }

      res.prePoint = c;
      return res;
    },
    {
      path: "",
      prePoint: {},
    }
  );
  return result.path;
}

export default function LoopCloseEdge(props: WflowEdgeProps) {
  const {
    sourceX,
    sourceY,
    targetX,
    targetY,
    markerEnd,
    data,
    source,
    target,
  } = props;
  const labelX = sourceX;
  const labelY = sourceY + 13;
  const strokeColor = useStrokeColor();
  const { addNodeByEdge } = useFlowNode();
  const { vw: targetVw, h: targetH } = useFlowNodeViewRect(target);
  console.log(source);

  if (targetVw === 0) return null;

  const edgePath = MakeLine({
    points: [
      {
        x: sourceX,
        y: sourceY,
      },
      {
        y: sourceY + 28,
      },
      {
        x: targetX - targetVw / 2 + 20,
      },
      {
        y: targetY + targetH + 15,
      },
      {
        x: targetX,
        y: targetY + targetH + 15,
      },
    ],
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: strokeColor,
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
          <CommonAddButton
            onClick={() => {
              addNodeByEdge(data.parentId);
            }}
          />
        </div>
      </EdgeLabelRenderer>
      )
    </>
  );
}
