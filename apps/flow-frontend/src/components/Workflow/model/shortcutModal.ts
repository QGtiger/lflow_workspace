import { createCustomModel } from "@/common/createModel";
import { useKeyPress } from "ahooks";
import { isLoopNode, isPathRuleNode } from "../layoutEngine/utils";
import { MenuProps, message } from "antd";
import useFlowNode from "../hooks/useFlowNode";
import useLFStoreState from "../hooks/useLFStoreState";
import { useRef } from "react";
import useFlowEngine from "../hooks/useFlowEngine";
import { UndoRedoModel } from "./UndoRedoModel";
import { keyPressConfig } from "../utils";

// 类型推导
type MenuItemType = NonNullable<MenuProps["items"]>[number];

export const ShortcutModal = createCustomModel(() => {
  const {
    replaceNode,
    duplicateNode,
    isLoopNodeById,
    copyNode,
    delNode,
    isComplexNodeById,
    foldNodeById,
    unfoldNodeById,
  } = useFlowNode();
  const { selectedId, rerender } = useLFStoreState();
  const { transferWrokflowNodeToFlowBlock, insetBlockById } = useFlowEngine();
  const clipboardDataRef = useRef<WorkflowNode[] | undefined>();
  const { takeSnapshot } = UndoRedoModel.useModel();

  const copyNodeWithClipboard = (id: string) => {
    return copyNode(id).then((data) => {
      clipboardDataRef.current = data;
    });
  };

  useKeyPress(
    ["meta.d", "ctrl.d"],
    (e) => {
      e.preventDefault();
      if (!selectedId) {
        return message.info("请先选择节点");
      }
      duplicateNode(selectedId);
    },
    keyPressConfig
  );

  useKeyPress(
    ["meta.c", "ctrl.c"],
    (e) => {
      e.preventDefault();
      if (!selectedId) {
        return message.info("请先选择节点");
      }

      copyNodeWithClipboard(selectedId);
    },
    keyPressConfig
  );

  const pasteNodeById = (id: string) => {
    if (!id) {
      return message.info("请先选择粘贴节点");
    }
    if (!clipboardDataRef.current?.length) {
      return message.info("请先复制节点");
    }

    insetBlockById({
      block: transferWrokflowNodeToFlowBlock({
        nodes: clipboardDataRef.current,
        startId: clipboardDataRef.current[0].id,
      }),
      parentId: id,
      inner: false,
      isResetRoot: false,
    });

    rerender();

    takeSnapshot(`粘贴 "${clipboardDataRef.current?.[0]?.connectorName}" 节点`);
    message.success("节点粘贴成功");
  };

  useKeyPress(
    ["meta.v", "ctrl.v"],
    (e) => {
      e.preventDefault();
      pasteNodeById(selectedId);
    },
    keyPressConfig
  );

  const pasteNodeInnerById = (id: string) => {
    if (!id) {
      return message.info("请先选择粘贴节点");
    }
    if (!clipboardDataRef.current?.length) {
      return message.info("请先复制节点");
    }
    if (!isLoopNodeById(id)) {
      return message.error("请先选择循环节点");
    }
    insetBlockById({
      block: transferWrokflowNodeToFlowBlock({
        nodes: clipboardDataRef.current,
        startId: clipboardDataRef.current[0].id,
      }),
      parentId: id,
      inner: true,
      isResetRoot: false,
    });

    rerender();
    takeSnapshot(
      `粘贴节点 "${clipboardDataRef.current?.[0].connectorName}" 至循环节点内`
    );
    message.success("节点粘贴成功");
  };

  useKeyPress(
    ["meta.i", "ctrl.i"],
    (e) => {
      e.preventDefault();
      pasteNodeInnerById(selectedId);
    },
    keyPressConfig
  );

  useKeyPress(
    ["meta.backspace", "ctrl.backspace"],
    (e) => {
      e.preventDefault();
      if (!selectedId) {
        return message.info("请先选择节点");
      }
      delNode(selectedId, true, true);
      message.success("节点删除成功");
    },
    keyPressConfig
  );

  const queryMenu = (flowNode: WorkflowNode) => {
    const couldChangeNode = !isPathRuleNode(flowNode);
    const couldDuplicateNode = !isPathRuleNode(flowNode);

    const items: Array<
      MenuItemType & {
        hidden?: boolean;
      }
    > = [
      {
        label: "运行",
        key: "1",
      },
      {
        label: "更改节点",
        key: "2",
        disabled: !couldChangeNode,
        onClick() {
          replaceNode(flowNode.id);
        },
      },
      {
        type: "divider",
      },
      {
        label: "克隆",
        key: "duplicate",
        extra: "⌘D",
        disabled: !couldDuplicateNode,
        onClick() {
          duplicateNode(flowNode.id);
        },
      },
      {
        label: "复制",
        key: "copy",
        extra: "⌘C",
        disabled: !couldDuplicateNode,
        onClick() {
          copyNodeWithClipboard(flowNode.id);
        },
      },
      {
        label: "粘贴",
        key: "paste",
        extra: "⌘V",
        onClick() {
          pasteNodeById(flowNode.id);
        },
      },
      {
        label: "粘贴至节点内",
        key: "paste-inner",
        extra: "⌘I",
        hidden: !isLoopNode(flowNode),
        onClick() {
          pasteNodeInnerById(flowNode.id);
        },
      },
      {
        type: "divider",
      },
      {
        label: "删除",
        key: "delete",
        extra: "⌘Delete",
        onClick: () => {
          delNode(flowNode.id, true, true);
        },
      },
      {
        label: "收起",
        key: "fold",
        onClick: () => {
          foldNodeById(flowNode.id);
        },
        hidden: !isComplexNodeById(flowNode.id),
      },
      {
        label: "展开",
        key: "unfold",
        onClick: () => {
          unfoldNodeById(flowNode.id);
        },
        hidden: !isComplexNodeById(flowNode.id),
      },
    ];

    return items.filter((item) => !item.hidden);
  };

  return {
    queryMenu,
  };
});
