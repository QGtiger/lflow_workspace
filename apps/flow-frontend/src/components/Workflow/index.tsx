import { Background, ReactFlow, ReactFlowProvider } from "@xyflow/react";
import { useRef } from "react";
import nodeTypes from "./NodeTypes";
import { createLFStore, LFStore, LFStoreConfig, StoreContext } from "./model";
import useLFStoreState from "./hooks/useLFStoreState";
import edgeTypes from "./EdgeTypes";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import useNewNode from "./hooks/useNewNode";

function WorkflowWrapper() {
  const { nodes, edges, layoutEngine } = useLFStoreState();
  const addNewNode = useNewNode();

  const tt = layoutEngine.exportFlowNodes();
  console.log(tt);

  useCopilotReadable({
    description:
      "当前流程的连接器数据, 数据结构中 index 表示节点在流程中的索引值",
    value: tt,
  });

  useCopilotAction({
    name: "addNode",
    description:
      "添加节点，需要用户提供父节点id，或者给索引值，你推导出具体的id",
    parameters: [
      {
        name: "parentId",
        description: "父节点id",
        type: "string",
      },
    ],
    handler: (params) => {
      const { parentId } = params;
      addNewNode(parentId);
    },
  });

  return (
    <ReactFlow
      fitView
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      minZoom={0.2}
      // nodesDraggable={false}
      nodesConnectable={false}
      zoomOnDoubleClick={false}
      // we are setting deleteKeyCode to null to prevent the deletion of nodes in order to keep the example simple.
      // If you want to enable deletion of nodes, you need to make sure that you only have one root node in your graph.
      deleteKeyCode={null}
      nodesDraggable={false}
    >
      <Background />
    </ReactFlow>
  );
}

export default function Workflow(props: LFStoreConfig) {
  const storeRef = useRef<LFStore>();
  if (!storeRef.current) {
    storeRef.current = createLFStore(props);
  }

  return (
    <StoreContext.Provider value={storeRef.current}>
      <ReactFlowProvider>
        <WorkflowWrapper />
      </ReactFlowProvider>
    </StoreContext.Provider>
  );
}
