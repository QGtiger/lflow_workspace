import { Empty, Input, message } from "antd";
import { ConnectorModel } from "../model/connectorModal";
import useLFStoreState from "./useLFStoreState";
import { useDebounceFn } from "ahooks";
import { useState, useRef } from "react";
import {
  isInnerBlock,
  isLoopBlock,
  isPathRuleBlock,
  isPathsBlock,
  uuid,
} from "../layoutEngine/utils";
import useDelNode from "./useDelNode";
import useFlowEngine from "./useFlowEngine";
import { generatePathRuleNode } from "../layoutEngine/core/PathRuleConnector";

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
  const delNode = useDelNode();
  const { getBlockByCheckNodeExist, generateBlock, insetBlockById } =
    useFlowEngine();

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

            delNode(id);

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
        return reject("路径规则节点不能克隆");
      }
      layoutEngine.createFlowBlock({
        node: block.flowNodeData,
        parentId: id,
        inner: false,
        forceWithId: true,
      });
      rerender();
      resolve(true);
    });
  };

  const copyNode = (id: string) => {
    return new Promise<WorkflowNode[]>((resolve, reject) => {
      const block = layoutEngine.getBlockByCheckNodeExist(id);
      if (isPathRuleBlock(block)) {
        return reject("路径规则节点不能复制");
      }
      resolve(
        generateBlock(
          getBlockByCheckNodeExist(id).flowNodeData
        ).exportFlowNodes()
      );
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
  };

  const isComplexBlock = (id: string) => {
    const block = layoutEngine.getBlockByCheckNodeExist(id);
    return isPathsBlock(block) || isLoopBlock(block);
  };

  return {
    replaceNode,
    addNodeByEdge,
    duplicateNode,
    isComplexBlock,
    isLoopNodeById(id: string) {
      const block = layoutEngine.getBlockByCheckNodeExist(id);
      return isLoopBlock(block);
    },
    isPathNodeById(id: string) {
      const block = layoutEngine.getBlockByCheckNodeExist(id);
      return isPathsBlock(block);
    },
    isPathRuleNodeById(id: string) {
      const block = layoutEngine.getBlockByCheckNodeExist(id);
      return isPathRuleBlock(block);
    },
    copyNode,
    addPathRule,
  };
}
