import { Dropdown } from "antd";
import { ShortcutModal } from "../model/shortcutModal";

export default function ContextMenuDropDown(
  props: React.PropsWithChildren<{
    flowNode: WorkflowNode;
  }>
) {
  const { flowNode } = props;
  const { queryMenu } = ShortcutModal.useModel();

  const items = queryMenu(flowNode);

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
