import { Background, ReactFlow, ReactFlowProvider } from "@xyflow/react";
import { useEffect, useRef } from "react";
import nodeTypes from "./NodeTypes";
import { createLFStore, LFStore, LFStoreConfig, StoreContext } from "./model";
import useLFStoreState from "./hooks/useLFStoreState";
import edgeTypes from "./EdgeTypes";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { ConnectorModel } from "./model/connectorModal";
import { ShortcutModal } from "./model/shortcutModal";
import { WflowNode } from "./layoutEngine/utils";
import { UndoRedoModel } from "./model/UndoRedoModel";

function WorkflowWrapper() {
  const { nodes, edges, layoutEngine } = useLFStoreState();
  const { contextHolder } = ConnectorModel.useModel();
  const { setSelectedId, flowNodes } = useLFStoreState();
  // const tt = layoutEngine.exportFlowNodes();

  // useCopilotReadable({
  //   description:
  //     "当前流程的连接器数据, 数据结构中 index 表示节点在流程中的索引值",
  //   value: tt,
  // });

  // useCopilotAction({
  //   name: "addNode",
  //   description:
  //     "添加节点，需要用户提供父节点id，或者给索引值，你推导出具体的id",
  //   parameters: [
  //     {
  //       name: "parentId",
  //       description: "父节点id",
  //       type: "string",
  //     },
  //   ],
  //   handler: (params) => {
  //     const { parentId } = params;
  //   },
  // });

  const selectNode = (node: WflowNode) => {
    if (!node.data.nodeData.connectorCode) return;
    setSelectedId(node.id);
  };

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
      onNodeClick={(event, node) => {
        selectNode(node);
      }}
      onNodeContextMenu={(event, node) => {
        selectNode(node);
      }}
    >
      <Background />
      {contextHolder}
    </ReactFlow>
  );
}

export default function Workflow(props: LFStoreConfig) {
  const storeRef = useRef<LFStore>();
  if (!storeRef.current) {
    storeRef.current = createLFStore(props);
  }

  return (
    <ConnectorModel.Provider>
      <StoreContext.Provider value={storeRef.current}>
        <UndoRedoModel.Provider>
          <ShortcutModal.Provider>
            <ReactFlowProvider>
              <WorkflowWrapper />
            </ReactFlowProvider>
          </ShortcutModal.Provider>
        </UndoRedoModel.Provider>
      </StoreContext.Provider>
    </ConnectorModel.Provider>
  );
}
