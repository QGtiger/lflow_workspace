import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from "@xyflow/react";

export function CustomStepEdge(props: any) {
  const { sourceX, sourceY, targetX, targetY, markerEnd, data } = props;
  const [edgePath] = getSmoothStepPath({
    borderRadius: 0,
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          strokeWidth: 2,
        }}
      />
      (
      {/* <EdgeLabelRenderer>
        <CustomEdgeButtonByRenderProps sourceX={sourceX} sourceY={sourceY + 10} renderProps={data.renderProps} />
      </EdgeLabelRenderer> */}
      )
    </>
  );
}
