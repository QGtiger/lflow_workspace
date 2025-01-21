import { Dropdown, MenuProps } from "antd";
import useDelNode from "../hooks/useDelNode";
import { isPathRuleNode } from "../layoutEngine/utils";
import useFlowNode from "../hooks/useFlowNode";

export default function ContextMenuDropDown(
  props: React.PropsWithChildren<{
    flowNode: WorkflowNode;
  }>
) {
  const del = useDelNode();
  const { replaceNode } = useFlowNode();
  const { flowNode } = props;

  const couldChangeNode = !isPathRuleNode(flowNode);
  const couldDuplicateNode = !isPathRuleNode(flowNode);

  const items: MenuProps["items"] = [
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
      label: "拷贝",
      key: "duplicate",
      extra: "⌘D",
      disabled: !couldDuplicateNode,
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

  return (
    <Dropdown
      menu={{ items }}
      trigger={["contextMenu"]}
      overlayStyle={{
        width: 200,
      }}
    >
      {props.children}
    </Dropdown>
  );
}
