import { createCustomModel } from "@/common/createModel";
import { useCallback, useEffect, useState } from "react";

import { WflowEdge, WflowNode } from "../layoutEngine/utils";
import useLFStoreState from "../hooks/useLFStoreState";

// type UseUndoRedo = (options?: UseUndoRedoOptions) => {
//   undo: () => void;
//   redo: () => void;
//   takeSnapshot: () => void;
//   canUndo: boolean;
//   canRedo: boolean;
// };

type HistoryItem = {
  nodes: WflowNode[];
  edges: WflowEdge[];
  flowNodes: WorkflowNode[];
  title: string;
};

const maxHistorySize = 100;

export const UndoRedoModel = createCustomModel(() => {
  // 过去和未来的数组存储了我们可以跳转到的状态
  const [past, setPast] = useState<HistoryItem[]>([]);
  const [future, setFuture] = useState<HistoryItem[]>([]);

  const { getFlowNodes, setFlowNodes, setNodes, setEdges, getNodes, getEdges } =
    useLFStoreState();

  const takeSnapshot = useCallback(
    (title: string) => {
      // 将当前图表推送到过去状态
      setPast((past) => [
        ...past.slice(past.length - maxHistorySize + 1, past.length),
        {
          nodes: getNodes(),
          edges: getEdges(),
          flowNodes: getFlowNodes(),
          title,
        },
      ]);

      // 每当我们拍摄新快照时，重做操作需要清除，以避免状态不匹配
      setFuture([]);
    },
    [getNodes, getEdges, maxHistorySize, getFlowNodes]
  );

  const undo = useCallback(() => {
    // 获取我们想要返回的最后一个状态
    const pastState = past[past.length - 1];

    if (pastState) {
      // 首先我们从历史记录中删除状态
      setPast((past) => past.slice(0, past.length - 1));
      // 我们存储当前图表以供重做操作
      setFuture((future) => [
        ...future,
        {
          nodes: getNodes(),
          edges: getEdges(),
          flowNodes: getFlowNodes(),
          title: pastState.title,
        },
      ]);
      // 现在我们可以将图表设置为过去的状态
      setNodes(pastState.nodes);
      setEdges(pastState.edges);
      setFlowNodes(pastState.flowNodes);
    }
  }, [
    setNodes,
    setEdges,
    getNodes,
    getEdges,
    past,
    setFlowNodes,
    getFlowNodes,
  ]);

  const redo = useCallback(() => {
    const futureState = future[future.length - 1];

    if (futureState) {
      setFuture((future) => future.slice(0, future.length - 1));
      setPast((past) => [
        ...past,
        {
          nodes: getNodes(),
          edges: getEdges(),
          flowNodes: getFlowNodes(),
          title: futureState.title,
        },
      ]);
      setNodes(futureState.nodes);
      setEdges(futureState.edges);
      setFlowNodes(futureState.flowNodes);
    }
  }, [
    setNodes,
    setEdges,
    getNodes,
    getEdges,
    future,
    setFlowNodes,
    getFlowNodes,
  ]);

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (
        event.key === "z" &&
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey
      ) {
        redo();
      } else if (event.key === "z" && (event.ctrlKey || event.metaKey)) {
        undo();
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [undo, redo]);

  return {
    undo,
    redo,
    takeSnapshot,
    canUndo: !past.length,
    canRedo: !future.length,
  };
});
