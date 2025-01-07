import { memo, useEffect, useRef } from "react";
import { Handle, Position, NodeProps, BuiltInNode } from "@xyflow/react";
import cx from "classnames";

import styles from "./NodeTypes.module.css";
import { useResizeObserver } from "../layoutEngine/useResizeObserver";
import useNodeResize from "../hooks/useNodeResize";
import useNewNode from "../hooks/useNewNode";
import useDelNode from "../hooks/useDelNode";

const WorkflowNode = (props: NodeProps<BuiltInNode>) => {
  // see the hook implementation for details of the click handler
  // calling onClick adds a child node to this node
  // const onClick = useNodeClickHandler(id);
  const { id, data } = props;
  const nodeRef = useRef<HTMLDivElement>(null);
  const nodeResize = useNodeResize();
  const add = useNewNode();
  const del = useDelNode();

  useResizeObserver(nodeRef, (entry) => {
    if (!id) return;
    const { offsetWidth, offsetHeight } = entry.target as HTMLDivElement;
    if (!offsetWidth || !offsetHeight) return;
    console.log("nodeResize", id, offsetWidth, offsetHeight);
    nodeResize(id, {
      w: offsetWidth,
      h: offsetHeight,
    });
  });

  return (
    <div
      ref={nodeRef}
      onClick={() => {
        if (window["test"]) {
          return del(id);
        }
        add(id);
      }}
      className={cx(styles.node)}
      title="click to add a child node"
    >
      {data.label}
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
