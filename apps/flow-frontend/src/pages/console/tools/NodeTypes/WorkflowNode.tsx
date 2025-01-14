import { memo, useState } from "react";
import {
  Handle,
  Position,
  NodeProps,
  BuiltInNode,
  useReactFlow,
} from "@xyflow/react";
import cx from "classnames";

import styles from "./NodeTypes.module.css";
import useNodeClickHandler from "../hooks/useNodeClick";

const WorkflowNode = ({ id, data }: NodeProps<BuiltInNode>) => {
  // see the hook implementation for details of the click handler
  // calling onClick adds a child node to this node
  const onClick = useNodeClickHandler(id);
  const [innerText] = useState(data.label);
  // @ts-expect-error 做调试
  const { setNodes, getNodes } = useReactFlow();

  console.log("render", id);

  return (
    <div
      onClick={() => {
        onClick();
        // setInnerText(innerText + "1111111111");
        // setNodes(JSON.parse(JSON.stringify(getNodes())));
      }}
      className={cx(styles.node, " break-words")}
      title="click to add a child node"
    >
      {innerText}
      <Handle
        className={styles.handle}
        type="target"
        position={Position.Top}
        isConnectable={false}
      />
      <Handle
        className={styles.handle}
        type="source"
        position={Position.Bottom}
        isConnectable={false}
      />
    </div>
  );
};

export default memo(WorkflowNode);
