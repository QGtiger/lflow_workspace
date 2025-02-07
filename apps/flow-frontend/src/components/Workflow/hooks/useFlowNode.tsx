import { Empty, Input, message } from "antd";
import { ConnectorModel } from "../model/connectorModal";
import useLFStoreState from "./useLFStoreState";
import { useDebounceFn } from "ahooks";
import { useState, useRef } from "react";
import {
  isInnerBlock,
  isLoopBlock,
  isLoopNode,
  isPathRuleBlock,
  isPathsBlock,
  isPathsNode,
  uuid,
} from "../layoutEngine/utils";
import useFlowEngine from "./useFlowEngine";
import { generatePathRuleNode } from "../layoutEngine/core/PathRuleConnector";
import { UndoRedoModel } from "../model/UndoRedoModel";
import { FlowLoopBlock } from "../layoutEngine/FlowLoopBlock";
import { generateEmptyNode } from "../layoutEngine/core";
import { FlowPathsBlock } from "../layoutEngine/FlowPathsBlock";

function AddNodeModal({
  onItemClick,
}: {
  onItemClick: (item: Connector) => void;
}) {
  const [searchText, setSearchText] = useState("");
  const isComposingRef = useRef(false);
  const { connectorList } = ConnectorModel.useModel();

  const { run: handleInput } = useDebounceFn(
    (text: string) => {
      if (isComposingRef.current) return;
      setSearchText(text);
    },
    {
      wait: 300,
    }
  );

  // 不区分大小写
  const filterToolList = connectorList.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="mt-2">
      <Input
        placeholder="搜索"
        onChange={(e) => {
          handleInput(e.target.value);
        }}
        onCompositionStart={() => {
          isComposingRef.current = true;
        }}
        onCompositionEnd={(e) => {
          isComposingRef.current = false;
          handleInput((e.target as HTMLInputElement).value);
        }}
      />
      <div className="list mt-2 h-[200px] overflow-auto">
        {filterToolList.length ? (
          filterToolList!.map((item) => {
            return (
              <div
                onClick={() => {
                  onItemClick(item);
                }}
                key={item.code}
                className="flex items-center gap-2 px-1 py-2 hover:bg-slate-200 rounded-md cursor-pointer"
              >
                <img
                  className="w-7 h-7 rounded-md"
                  src={item.logo}
                  alt={item.name}
                />
                <div className="name flex-shrink-0">{item.name}</div>
                {/* <div className="desc text-xs text-gray-500 line-clamp-1">
                  {item.description}
                </div> */}
              </div>
            );
          })
        ) : (
          <div className="mt-6">
            <Empty />
          </div>
        )}
      </div>
    </div>
  );
}

const generateNodeDataByConnector = (connector: Connector) => {
  return {
    connectorCode: connector.code,
    version: connector.version,
    connectorName: connector.name,
    logo: connector.logo,
    description: connector.description,
  };
};

export default function useFlowNode() {
  const { layoutEngine, rerender } = useLFStoreState();
  const { createModal } = ConnectorModel.useModel();
  const { getBlockByCheckNodeExist, generateBlock, insetBlockById } =
    useFlowEngine();
  const { takeSnapshot } = UndoRedoModel.useModel();

  const addConnectorNode = (options: {
    parentId?: string;
    connector: Connector;
    inner?: boolean;
  }) => {
    const { parentId, connector, inner } = options;
    layoutEngine.createFlowBlock({
      node: {
        ...generateNodeDataByConnector(connector),
        id: uuid(),
      },
      parentId,
      inner,
      isResetRoot: true,
    });
    rerender();
    takeSnapshot(`添加 "${options.connector.name}" 节点`);
  };

  const delNode = (
    id: string,
    autoAddEmptyNode?: boolean,
    isTaskSnapshot?: boolean
  ) => {
    const b = layoutEngine.getBlockByCheckNodeExist(id);
    const { parent } = b;
    if (parent) {
      if (parent instanceof FlowLoopBlock && parent.innerBlock === b) {
        const hasNext = !!b.next;
        parent.setInnerBlock(b.next, true);
        // 只有一个节点，则添加一个空节点
        if (!hasNext && autoAddEmptyNode) {
          layoutEngine.createFlowBlock({
            node: generateEmptyNode(),
            parentId: parent.id,
            inner: true,
          });
        }
      } else if (parent instanceof FlowPathsBlock && parent.hasChild(id)) {
        parent.removeChild(b);
        // 分支最少两个
        if (parent.children.length < 2) {
          parent.addChild(layoutEngine.generateBlock(generatePathRuleNode()));
        }
      } else {
        parent.next = b.next;
        if (b.next) {
          b.next.parent = parent;
        }
      }
    } else {
      // 删除根节点
      layoutEngine.rootId = b.next?.id;
      if (b.next) {
        b.next.parent = undefined;
      }
    }
    b.removeLink();

    layoutEngine.deleteFlowBlock(id);
    rerender();
    if (isTaskSnapshot) {
      takeSnapshot(`删除 "${b.flowNodeData.connectorName}" 节点`);
    }
  };

  const replaceNode = (id: string) => {
    const ins = createModal({
      title: "替换节点",
      icon: null,
      content: (
        <AddNodeModal
          onItemClick={(item) => {
            const block = layoutEngine.getBlockByCheckNodeExist(id);
            const parentId = block.parent?.id;
            const isInner = isInnerBlock(block);

            delNode(id, false);

            addConnectorNode({ parentId, connector: item, inner: isInner });
            ins.destroy();
          }}
        />
      ),
      footer: null,
      closable: true,
      maskClosable: true,
    });
    return ins;
  };

  const duplicateNode = async (id: string) => {
    return new Promise((resolve, reject) => {
      const block = layoutEngine.getBlockByCheckNodeExist(id);
      if (isPathRuleBlock(block)) {
        const msg = "路径规则节点不能克隆";
        message.error(msg);
        return reject(msg);
      }
      layoutEngine.createFlowBlock({
        node: block.flowNodeData,
        parentId: id,
        inner: false,
        forceWithId: true,
      });
      rerender();
      takeSnapshot(`克隆 "${block.flowNodeData.connectorName}" 节点`);

      resolve(true);
      message.success("克隆成功");
    });
  };

  const copyNode = (id: string) => {
    return new Promise<WorkflowNode[]>((resolve, reject) => {
      const block = layoutEngine.getBlockByCheckNodeExist(id);
      if (isPathRuleBlock(block)) {
        const msg = "路径规则节点不能复制";
        message.error(msg);
        return reject(msg);
      }
      resolve(
        generateBlock(
          getBlockByCheckNodeExist(id).flowNodeData
        ).exportFlowNodes()
      );
      message.success("节点复制成功");
    });
  };

  const addNodeByEdge = (parentId: string, inner?: boolean) => {
    const ins = createModal({
      title: "添加节点",
      icon: null,
      content: (
        <AddNodeModal
          onItemClick={(item) => {
            addConnectorNode({ parentId, connector: item, inner });
            ins.destroy();
          }}
        />
      ),
      footer: null,
      closable: true,
      maskClosable: true,
    });
    return ins;
  };

  const addPathRule = (parentId: string) => {
    const b = layoutEngine.getBlockByCheckNodeExist(parentId);
    if (!isPathsBlock(b)) {
      throw new Error("only Path block can add PathRule");
    }
    insetBlockById({
      block: generateBlock(generatePathRuleNode()),
      parentId,
      inner: true,
    });
    rerender();
    takeSnapshot(`添加 "路径规则" 节点`);
  };

  const isComplexNodeById = (id: string) => {
    const block = layoutEngine.getBlockByCheckNodeExist(id);
    return isPathsBlock(block) || isLoopBlock(block);
  };

  const isComplexNode = (node: WorkflowNode) => {
    return isPathsNode(node) || isLoopNode(node);
  };

  const isLoopNodeById = (id: string) => {
    const block = layoutEngine.getBlockByCheckNodeExist(id);
    return isLoopBlock(block);
  };

  const isPathNodeById = (id: string) => {
    const block = layoutEngine.getBlockByCheckNodeExist(id);
    return isPathsBlock(block);
  };

  const foldNodeById = (id: string) => {
    const block = layoutEngine.getBlockByCheckNodeExist(id);
    (block as any).fold?.();
    rerender();
  };

  const unfoldNodeById = (id: string) => {
    const block = layoutEngine.getBlockByCheckNodeExist(id);
    (block as any).unfold?.();
    rerender();
  };

  return {
    delNode,
    replaceNode,
    addNodeByEdge,
    duplicateNode,
    isLoopNodeById,
    isPathNodeById,
    isPathRuleNodeById(id: string) {
      const block = layoutEngine.getBlockByCheckNodeExist(id);
      return isPathRuleBlock(block);
    },
    copyNode,
    addPathRule,
    isComplexNodeById,
    foldNodeById,
    unfoldNodeById,
    isComplexNode,
  };
}
