import {
  BaseEdge,
  EdgeLabelRenderer,
  Node,
  XYPosition,
  useReactFlow,
} from "@xyflow/react";

function getNodeEdgePoint(node: Node, x: number, y: number): XYPosition {
  const { type, position, width, height } = node;
  if (type === "endFlowNode") {
    return {
      x: position.x + (width || 0) / 2,
      y: position.y + (height || 0) / 2,
    };
  } else {
    return {
      x,
      y,
    };
  }
}

function isNumberEqual(n: number, m: number) {
  return Math.abs(n - m) <= 1;
}

function customStepLine(point1: XYPosition, point2: XYPosition) {
  const { x: x1, y: y1 } = point1;
  const { x: x2, y: y2 } = point2;
  const isSingleLine = isNumberEqual(x1, x2) || isNumberEqual(y1, y2);
  if (isSingleLine) {
    return `M${x1} ${y1} L${x2} ${y2}`;
  } else {
    return `M${x1} ${y1} L${x1} ${y2} L${x2} ${y2}`;
  }
}

export function EndflowEdge(props: any) {
  const { sourceX, sourceY, targetX, targetY, markerEnd, source, target } =
    props;
  const { getNode } = useReactFlow();
  const sourceNode = getNode(source);
  const targetNode = getNode(target);

  if (!sourceNode || !targetNode) {
    return <></>;
  }

  const sourcePosition = getNodeEdgePoint(sourceNode, sourceX, sourceY);
  const targetPosition = getNodeEdgePoint(targetNode, targetX, targetY);

  const edgePath2 = customStepLine(sourcePosition, targetPosition);

  return (
    <>
      <BaseEdge path={edgePath2} markerEnd={markerEnd} />
    </>
  );
}
