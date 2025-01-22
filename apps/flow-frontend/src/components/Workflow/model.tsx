import { createContext } from "react";
import { LayoutEngine } from "./layoutEngine";
import { queueEffectFn } from "./layoutEngine/queueTickFn";
import { createStore } from "zustand";
import { debounce } from "lodash-es";
import { WflowEdge, WflowNode } from "./layoutEngine/utils";

interface LFStoreState {
  nodes: WflowNode[];
  edges: WflowEdge[];
  deleteNode(id: string): void;
  layoutEngine: LayoutEngine;
  rerender(): void;
  macroRender(): void;
  strokeColor: string;
  selectedId: string;
  setSelectedId(id: string): void;
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
      console.log("generate");
      const data = engineIns.exportReactFlowData();
      engineIns.exportFlowNodes();
      const nodesWithTransition = data.nodes.map((node) => ({
        ...node,
        style: {
          ...node.style,
          transition: "all 200ms ease-in-out",
        },
      }));
      // console.log(nodesWithTransition);
      set({ nodes: nodesWithTransition, edges: data.edges });
    }

    function render() {
      queueEffectFn(setNodesEdges);
    }

    // @ts-nocheck
    const macroRender = debounce(setNodesEdges, 0);

    setNodesEdges();

    return {
      rerender: render,
      // 宏任务渲染
      macroRender,
      layoutEngine: engineIns,
      nodes: data.nodes,
      edges: data.edges,
      deleteNode(id) {
        engineIns.deleteFlowBlock(id);
        render();
      },
      strokeColor: "#98a2b3",
      selectedId: "",
      setSelectedId(id) {
        set({ selectedId: id });
      },
    };
  });

  return store;
}
