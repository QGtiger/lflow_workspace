import { createCustomModel } from "@/common/createModel";
import { useKeyPress } from "ahooks";
import { isLoopNode, isPathRuleNode } from "../layoutEngine/utils";
import { MenuProps, message } from "antd";
import useFlowNode from "../hooks/useFlowNode";
import useDelNode from "../hooks/useDelNode";
import useLFStoreState from "../hooks/useLFStoreState";
import { useRef } from "react";
import useFlowEngine from "../hooks/useFlowEngine";

// 类型推导
type MenuItemType = NonNullable<MenuProps["items"]>[number];

export const ShortcutModal = createCustomModel(() => {
  const { replaceNode, duplicateNode, isLoopNodeById, copyNode } =
    useFlowNode();
  const del = useDelNode();
  const { selectedId, rerender } = useLFStoreState();
  const { transferWrokflowNodeToFlowBlock, insetBlockById } = useFlowEngine();
  const clipboardDataRef = useRef<WorkflowNode[] | undefined>();

  useKeyPress(["meta.d", "ctrl.d"], (e) => {
    e.preventDefault();
    if (!selectedId) {
      return message.info("请先选择节点");
    }
    duplicateNode(selectedId)
      .then(() => {
        message.success("克隆成功");
      })
      .catch((e) => {
        message.error(e);
      });
  });

  useKeyPress(["meta.c", "ctrl.c"], (e) => {
    e.preventDefault();
    if (!selectedId) {
      return message.info("请先选择节点");
    }

    copyNode(selectedId)
      .then((data) => {
        message.success("节点复制成功");
        clipboardDataRef.current = data;
      })
      .catch(message.error);
  });

  useKeyPress(["meta.v", "ctrl.v"], (e) => {
    e.preventDefault();
    if (!selectedId) {
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
      parentId: selectedId,
      inner: false,
      isResetRoot: false,
    });

    rerender();
    message.success("节点粘贴成功");
  });

  useKeyPress(["meta.i", "ctrl.i"], (e) => {
    e.preventDefault();
    if (!selectedId) {
      return message.info("请先选择粘贴节点");
    }
    if (!clipboardDataRef.current?.length) {
      return message.info("请先复制节点");
    }
    if (!isLoopNodeById(selectedId)) {
      return message.error("请先选择循环节点");
    }
    insetBlockById({
      block: transferWrokflowNodeToFlowBlock({
        nodes: clipboardDataRef.current,
        startId: clipboardDataRef.current[0].id,
      }),
      parentId: selectedId,
      inner: true,
      isResetRoot: false,
    });

    rerender();
    message.success("节点粘贴成功");
  });

  useKeyPress(["meta.backspace", "ctrl.backspace"], (e) => {
    e.preventDefault();
    if (!selectedId) {
      return message.info("请先选择粘贴节点");
    }
    del(selectedId, true);
    message.success("节点删除成功");
  });

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
      },
      {
        label: "粘贴",
        key: "paste",
        extra: "⌘V",
      },
      {
        label: "粘贴至节点内",
        key: "paste-inner",
        extra: "⌘I",
        hidden: !isLoopNode(flowNode),
      },
      {
        type: "divider",
      },
      {
        label: "删除",
        key: "delete",
        extra: "⌘Delete",
        onClick: () => {
          del(flowNode.id, true);
        },
      },
    ];

    return items.filter((item) => !item.hidden);
  };

  return {
    queryMenu,
  };
});
