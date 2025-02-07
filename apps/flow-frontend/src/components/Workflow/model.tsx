import { createContext } from "react";
import { LayoutEngine } from "./layoutEngine";
import { queueEffectFn } from "./layoutEngine/queueTickFn";
import { createStore } from "zustand";
import { debounce } from "lodash-es";
import { WflowEdge, WflowNode } from "./layoutEngine/utils";

interface LFStoreState {
  nodes: WflowNode[];
  getNodes(): WflowNode[];
  edges: WflowEdge[];
  getEdges(): WflowEdge[];

  deleteNode(id: string): void;
  layoutEngine: LayoutEngine;
  rerender(): void;
  macroRender(): void;
  strokeColor: string;
  selectedId: string;
  setSelectedId(id: string): void;

  flowNodes: WorkflowNode[];
  setFlowNodes(nodes: WorkflowNode[]): void;
  getFlowNodes(): WorkflowNode[];
}

export type LFStore = ReturnType<typeof createLFStore>;

export const StoreContext = createContext<LFStore>({} as any);

export interface LFStoreConfig {
  flowNodes: WorkflowNode[];
}

export function createLFStore(config: LFStoreConfig) {
  const engineIns = new LayoutEngine(config.flowNodes);
  const data = engineIns.exportReactFlowData();
  const store = createStore<LFStoreState>((set, get) => {
    function setNodesEdges() {
      const newData = engineIns.exportReactFlowData();
      const flowNodes = engineIns.exportFlowNodes();
      const nodesWithTransition = newData.nodes.map((node) => ({
        ...node,
        style: {
          ...node.style,
          // transition: "all 200ms ease-in-out",
        },
      }));
      const sid =
        flowNodes.find((node) => node.id === get().selectedId)?.id || "";
      set({
        nodes: nodesWithTransition,
        edges: newData.edges,
        flowNodes,
        selectedId: sid,
      });
    }

    function setFlowNodes(fnodes: WorkflowNode[]) {
      engineIns.generateFlowBlockTree(fnodes);
      setNodesEdges();
    }

    function render() {
      queueEffectFn(setNodesEdges);
    }

    // @ts-nocheck
    const macroRender = debounce(setNodesEdges, 0);

    // setNodesEdges();

    return {
      rerender: render,
      // 宏任务渲染
      macroRender,
      layoutEngine: engineIns,
      nodes: data.nodes,
      getNodes() {
        return get().nodes;
      },
      edges: data.edges,
      getEdges() {
        return get().edges;
      },
      deleteNode(id) {
        engineIns.deleteFlowBlock(id);
        render();
      },
      strokeColor: "#98a2b3",
      selectedId: "",
      setSelectedId(id) {
        set({ selectedId: id });
      },

      flowNodes: config.flowNodes,
      setFlowNodes,
      getFlowNodes() {
        return get().flowNodes;
      },
    };
  });

  return store;
}
