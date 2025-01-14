import { Background, ReactFlow, ReactFlowProvider } from "@xyflow/react";
import { useRef } from "react";
import nodeTypes from "./NodeTypes";
import { createLFStore, LFStore, LFStoreConfig, StoreContext } from "./model";
import useLFStoreState from "./hooks/useLFStoreState";
import edgeTypes from "./EdgeTypes";

function WorkflowWrapper() {
  const { nodes, edges } = useLFStoreState();

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
