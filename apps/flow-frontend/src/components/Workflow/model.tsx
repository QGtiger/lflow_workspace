import { createContext, useRef } from "react";
import { LayoutEngine } from "./layoutEngine";
import { Edge, Node } from "@xyflow/react";
import { RectInfer } from "./layoutEngine/DisplayObject";
import { queueEffectFn } from "./layoutEngine/queueTickFn";
import { createStore } from "zustand";
import { uuid } from "./layoutEngine/utils";

interface LFStoreState {
  nodeResize(id: string, size: RectInfer): void;
  nodes: Node[];
  edges: Edge[];
  addNewNode(parentId: string, nodeData?: WorkflowNode): void;
  deleteNode(id: string): void;
  changeNodeData(id: string, data: Omit<WorkflowNode, "id">): void;
}

export type LFStore = ReturnType<typeof createLFStore>;

export const StoreContext = createContext<LFStore>({} as any);

export interface LFStoreConfig {
  flowNodes: WorkflowNode[];
}

export function createLFStore(config: LFStoreConfig) {
  const engineIns = new LayoutEngine(config.flowNodes);
  const data = engineIns.exportReactFlowData();
  console.log(data, engineIns.flowBlockMap[engineIns.rootId!]);
  const store = createStore<LFStoreState>((set) => {
    function setNodesEdges() {
      const data = engineIns.exportReactFlowData();
      console.log("setNodesEdges:", data);
      set({ nodes: data.nodes, edges: data.edges });
    }

    function render() {
      queueEffectFn(setNodesEdges);
    }

    return {
      nodes: data.nodes,
      edges: data.edges,
      nodeResize(id, size) {
        engineIns.resizeNode(id, size);
        console.log("resize");
        render();
      },
      addNewNode(parentId: string, nodeData?: WorkflowNode) {
        engineIns.createFlowBlock(
          nodeData || {
            id: uuid(),
          },
          parentId
        );
        console.log("add");
        render();
      },
      deleteNode(id) {
        engineIns.deleteFlowBlock(id);
        console.log("del");
        render();
      },
      changeNodeData(id, data) {
        engineIns.changeFlowBlockData(id, data);
        render();
      },
    };
  });

  return store;
}
