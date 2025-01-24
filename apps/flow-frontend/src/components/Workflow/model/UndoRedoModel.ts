import { createCustomModel } from "@/common/createModel";
import { useCallback, useMemo, useState } from "react";

import useLFStoreState from "../hooks/useLFStoreState";
import { useDebounceFn, useKeyPress, useReactive } from "ahooks";
import { message } from "antd";
import { v4 as uuidV4 } from "uuid";

type HistoryItem = {
  flowNodes: WorkflowNode[];
  title: string;
  uuid: string;
};

const maxHistorySize = 100;

export const UndoRedoModel = createCustomModel(() => {
  const pastModel = useReactive({
    historyList: [] as HistoryItem[],
    currHistoryUuid: "",
  });
  const { historyList, currHistoryUuid } = pastModel;
  const currentIndex = historyList.findIndex(
    (it) => it.uuid === currHistoryUuid
  );

  const { getFlowNodes, setFlowNodes } = useLFStoreState();

  const { run: takeSnapshot } = useDebounceFn(
    (title: string) => {
      const { historyList, currHistoryUuid } = pastModel;
      const i = historyList.findIndex((it) => it.uuid === currHistoryUuid);
      if (i > -1) {
        // 新的快照时，redo 需要清除
        historyList.splice(i + 1);
      }

      historyList.push({
        flowNodes: getFlowNodes(),
        title,
        uuid: uuidV4(),
      });
      pastModel.currHistoryUuid = historyList[historyList.length - 1].uuid;
    },
    {
      wait: 50,
    }
  );

  const undo = useCallback(() => {
    return new Promise((resolve, reject) => {
      const { historyList, currHistoryUuid } = pastModel;
      const i = historyList.findIndex((it) => it.uuid === currHistoryUuid);
      const pastState = historyList[i - 1];
      if (pastState) {
        setFlowNodes(pastState.flowNodes);
        pastModel.currHistoryUuid = pastState.uuid;
        resolve(pastState);
        message.success(`撤销到 "${pastState.title}"`);
      } else {
        reject("没有可以撤销的快照");
      }
    });
  }, [pastModel, setFlowNodes]);

  const redo = useCallback(() => {
    return new Promise((resolve, reject) => {
      const { historyList, currHistoryUuid } = pastModel;
      const i = historyList.findIndex((it) => it.uuid === currHistoryUuid);
      const pastState = historyList[i + 1];
      if (pastState) {
        setFlowNodes(pastState.flowNodes);
        pastModel.currHistoryUuid = pastState.uuid;
        resolve(pastState);
        message.success(`重做到 "${pastState.title}"`);
      } else {
        reject("没有可以重做的快照");
      }
    });
  }, [pastModel, setFlowNodes]);

  const jumpTo = (uuid: string) => {
    const { historyList } = pastModel;
    const pastState = historyList.find((it) => it.uuid === uuid);
    if (pastState) {
      setFlowNodes(pastState.flowNodes);
      pastModel.currHistoryUuid = pastState.uuid;
      message.success(`跳转至 "${pastState.title}"`);
    }
  };

  useKeyPress(["meta.z", "ctrl.z"], (e) => {
    e.preventDefault();
    undo();
  });

  useKeyPress(["meta.y", "ctrl.y"], (e) => {
    e.preventDefault();
    redo();
  });

  return {
    undo,
    redo,
    takeSnapshot,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < historyList.length - 1,
    ...pastModel,
    currentIndex,
    jumpTo,
  };
});
