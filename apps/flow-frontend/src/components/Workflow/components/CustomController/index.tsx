import {
  BackwardOutlined,
  ClockCircleOutlined,
  ForwardOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { Empty, Popover } from "antd";
import { UndoRedoModel } from "../../model/UndoRedoModel";
import classNames from "classnames";

function HistoryContent() {
  const { historyList, currentIndex, jumpTo } = UndoRedoModel.useModel();

  return (
    <div>
      <div className="flex flex-col text-xs -mx-1">
        {historyList.length <= 1 ? (
          <Empty
            description="暂无变更历史"
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{ height: 60 }}
          />
        ) : (
          historyList
            .map((it, index) => {
              let label = "";
              if (index === currentIndex) {
                label = "当前状态";
              } else if (index > currentIndex) {
                label = `重做${index - currentIndex}次`;
              } else if (index < currentIndex) {
                label = `撤销${currentIndex - index}次`;
              }
              return (
                <div
                  key={`${it.title}${index}`}
                  className={classNames(
                    "cursor-pointer hover:bg-gray-100 rounded-md py-1.5  flex items-center p-1",
                    {
                      "bg-gray-100": index === currentIndex,
                    }
                  )}
                  onClick={() => {
                    jumpTo(it.uuid);
                  }}
                >
                  {it.title} ({label})
                </div>
              );
            })
            .reverse()
        )}
      </div>
      <div className="desc"></div>
    </div>
  );
}

export default function CustomController() {
  const { undo, redo, canRedo, canUndo } = UndoRedoModel.useModel();

  const clx1 =
    "cursor-pointer hover:bg-gray-100 rounded-md p-1 w-8 h-8 flex items-center justify-center text-xl";
  return (
    <div className="flex  shadow-lg bg-white rounded-md p-1 ">
      <Popover
        content={
          <div className="flex items-center gap-1">
            撤销{" "}
            <span className="bg-gray-200 rounded-md p-1 w-6 h-6 flex items-center justify-center">
              ⌘
            </span>
            {"+"}
            <span className="bg-gray-200 rounded-md p-1 w-6 h-6 flex items-center justify-center">
              z
            </span>
          </div>
        }
        arrow={false}
        overlayInnerStyle={{
          padding: "8px",
          fontSize: "12px",
        }}
      >
        <div
          className={classNames(clx1, {
            "pointer-events-none opacity-30": !canUndo,
          })}
          onClick={() => undo()}
        >
          <BackwardOutlined />
        </div>
      </Popover>
      <Popover
        content={
          <div className="flex items-center gap-1">
            重做{" "}
            <span className="bg-gray-200 rounded-md p-1 w-6 h-6 flex items-center justify-center">
              ⌘
            </span>
            {"+"}
            <span className="bg-gray-200 rounded-md p-1 w-6 h-6 flex items-center justify-center">
              y
            </span>
          </div>
        }
        arrow={false}
        overlayInnerStyle={{
          padding: "8px",
          fontSize: "12px",
        }}
      >
        <div
          className={classNames(clx1, {
            "pointer-events-none opacity-30": !canRedo,
          })}
          onClick={() => redo()}
        >
          <ForwardOutlined />
        </div>
      </Popover>

      <Popover
        title="变更历史"
        content={<HistoryContent />}
        trigger={["click"]}
      >
        <div
          className={classNames(
            "cursor-pointer hover:bg-gray-100 rounded-md p-1 w-8 h-8 flex items-center justify-center"
          )}
        >
          <HistoryOutlined />
        </div>
      </Popover>
    </div>
  );
}
