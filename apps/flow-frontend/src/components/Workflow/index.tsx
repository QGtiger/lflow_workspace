import { Background, ReactFlow, ReactFlowProvider } from "@xyflow/react";
import { useRef } from "react";
import nodeTypes from "./NodeTypes";
import { createLFStore, LFStore, LFStoreConfig, StoreContext } from "./model";
import useLFStoreState from "./hooks/useLFStoreState";

function WorkflowWrapper() {
  const { nodes, edges } = useLFStoreState();
  return (
    <ReactFlowProvider>
      <ReactFlow
        fitView
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        minZoom={0.2}
        // nodesDraggable={false}
        nodesConnectable={false}
        zoomOnDoubleClick={false}
        // we are setting deleteKeyCode to null to prevent the deletion of nodes in order to keep the example simple.
        // If you want to enable deletion of nodes, you need to make sure that you only have one root node in your graph.
        deleteKeyCode={null}
      >
        <Background />
      </ReactFlow>
    </ReactFlowProvider>
  );
}

export default function Workflow(props: LFStoreConfig) {
  const storeRef = useRef<LFStore>();
  if (!storeRef.current) {
    storeRef.current = createLFStore(props);
  }

  return (
    <StoreContext.Provider value={storeRef.current}>
      <WorkflowWrapper />
    </StoreContext.Provider>
  );
}
