import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Panel,
} from "@xyflow/react";
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
import CustomController from "./components/CustomController";

import "./index.css";
import { useMount } from "ahooks";
import useFlowEngine from "./hooks/useFlowEngine";

function WorkflowWrapper() {
  const { nodes, edges } = useLFStoreState();
  const { contextHolder } = ConnectorModel.useModel();
  const { setSelectedId, flowNodes, rerender } = useLFStoreState();
  const { takeSnapshot } = UndoRedoModel.useModel();
  const { connectorListWithBuildIn, generateNodeDataByConnector } =
    ConnectorModel.useModel();
  const { insetBlockById, transferWrokflowNodeToFlowBlock, createFlowBlock } =
    useFlowEngine();

  console.log("======flowNodes======\n", flowNodes);
  console.log(
    "======connectorListWithBuildIn======\n",
    connectorListWithBuildIn
  );

  useCopilotReadable({
    description: `
      当前 <可以使用的连接器>，
      其数据结构如下：
      interface Connector {
        code: string; // 连接器编码
        name: string; // 连接器名称
        logo: string; // 连接器logo
        version: string; // 连接器版本
        description: string; // 连接器描述

        hidden?: boolean; // 是否隐藏，隐藏的连接器不能被用户选择， 你也不能进行回复，例如用户询问你当前可以使用的连接器有哪些，你不能回答隐藏的连接器

        actions: ConnectorAction[]; // 连接器支持的操作
      }

      interface ConnectorAction {
        code: string; // 操作编码
        name: string; // 操作名称
        description: string; // 操作描述
      }

      回答内容不准涉及到隐藏的连接器
    `,
    value: connectorListWithBuildIn,
  });

  useCopilotReadable({
    description: `当前流程的连接器数据，
      其数据结构如下：
      interface WorkflowNode {
        id: string; // 随机生成的id
        connectorCode?: string; // 连接器编码
        connectorName?: string; // 连接器名称
        actionCode?: string; // 执行操作编码
        actionName?: string; // 执行操作名称
        logo?: string; // 连接器logo
        version?: string; // 连接器版本
        description?: string; // 连接器描述

        sequence?: number; // 索引

        children?: WorkflowNode["id"][]; // 子节点
        next?: WorkflowNode["id"]; // 下一个节点
      }
        注意，回答问题时，不要回答数据结构，只回答数据。
        且有以下规则:
        1. 如果节点不包含 connectorCode, 则视为空白节点，不能视作连接器，需要提示用户去添加连接器`,
    value: flowNodes,
  });

  useCopilotAction({
    name: "addNode",
    description: `
      添加流程逻辑，你需要从 <可以使用的连接器> 中选择一个连接器. 到涉及到分支判断，不能直接设置 pathRule节点，需要先设置分支节点，然后再去分支内的 pathRule 节点后面添加逻辑
      `,
    parameters: [
      {
        name: "connectorCode",
        description: "连接器编码",
        type: "string",
        required: true,
      },
      {
        name: "actionCode",
        description: "操作编码",
        type: "string",
        required: true,
      },
      {
        name: "parentId",
        description: "父节点id",
        type: "string",
        required: true,
      },
      {
        name: "inner",
        description:
          "是否是内部节点, 只有在循环节点和分支节点时，才需要设置为true",
        type: "boolean",
        required: true,
      },
    ],
    handler: (params) => {
      console.log("======params======\n", params);
      // insetBlockById({
      //   block: transferWrokflowNodeToFlowBlock({
      //     nodes: clipboardDataRef.current,
      //     startId: clipboardDataRef.current[0].id,
      //   }),
      //   parentId: id,
      //   inner: true,
      //   isResetRoot: false,
      // });
      createFlowBlock({
        node: generateNodeDataByConnector({
          connectorCode: params.connectorCode,
          actionCode: params.actionCode,
        }),
        parentId: params.parentId,
        inner: params.inner,
      });
      rerender();
    },
  });

  const selectNode = (node: WflowNode) => {
    if (!node.data?.nodeData?.connectorCode) return;
    setSelectedId(node.id);
  };

  useMount(() => {
    takeSnapshot("初始化 flow");
  });

  return (
    <div
      className="relative w-full h-full bg-[#f2f4f7]"
      id="workflow-container"
    >
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
        <Panel position="bottom-left">
          <CustomController />
        </Panel>
        {contextHolder}
      </ReactFlow>
    </div>
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
