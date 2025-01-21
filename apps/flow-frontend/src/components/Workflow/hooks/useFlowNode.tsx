import { Empty, Input } from "antd";
import { ConnectorModel } from "../model/connectorModal";
import useLFStoreState from "./useLFStoreState";
import { useDebounceFn } from "ahooks";
import { useState, useRef } from "react";
import { isInnerBlock, uuid } from "../layoutEngine/utils";
import useDelNode from "./useDelNode";

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

  const addConnectorNode = (options: {
    parentId?: string;
    connector: Connector;
    inner?: boolean;
  }) => {
    const { parentId, connector, inner } = options;
    layoutEngine.createFlowBlock(
      {
        ...generateNodeDataByConnector(connector),
        id: uuid(),
      },
      parentId,
      inner
    );
    rerender();
  };

  const replaceNode = (id: string) => {
    createModal({
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
          }}
        />
      ),
      footer: null,
      closable: true,
    });
  };

  const addNodeByEdge = (parentId: string) => {
    createModal({
      title: "添加节点",
      icon: null,
      content: (
        <AddNodeModal
          onItemClick={(item) => {
            addConnectorNode({ parentId, connector: item });
          }}
        />
      ),
      footer: null,
      closable: true,
    });
  };

  return {
    replaceNode,
    addNodeByEdge,
  };
}
