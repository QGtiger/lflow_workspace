import { createContext, useRef } from "react";
import { LayoutEngine } from "./layoutEngine";
import { Edge, Node } from "@xyflow/react";
import { queueEffectFn } from "./layoutEngine/queueTickFn";
import { createStore } from "zustand";
import { uuid } from "./layoutEngine/utils";
import { debounce } from "lodash-es";

interface LFStoreState {
  nodes: Node[];
  edges: Edge[];
  addNewNode(parentId: string, nodeData?: WorkflowNode): void;
  deleteNode(id: string): void;
  changeNodeData(id: string, data: Omit<WorkflowNode, "id">): void;
  layoutEngine: LayoutEngine;
  rerender(): void;
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
  const store = createStore<LFStoreState>((set, get) => {
    function setNodesEdges() {
      const data = engineIns.exportReactFlowData();
      set({ nodes: data.nodes, edges: data.edges });
    }

    function render() {
      queueEffectFn(setNodesEdges);
    }

    const rerender = debounce(setNodesEdges, 0);

    return {
      rerender: render,
      layoutEngine: engineIns,
      nodes: data.nodes,
      edges: data.edges,
      addNewNode(parentId: string, nodeData?: WorkflowNode) {
        engineIns.createFlowBlock(
          nodeData || {
            id: uuid(),
          },
          parentId
        );
        render();
      },
      deleteNode(id) {
        engineIns.deleteFlowBlock(id);
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
