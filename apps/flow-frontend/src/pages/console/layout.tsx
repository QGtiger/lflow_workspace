import { useOutlet } from "react-router-dom";
import { ProLayout, ProSettings } from "@ant-design/pro-components";
import classNames from "classnames";
import { Avatar, Dropdown } from "antd";
import { UserModel } from "@/model/UserModel";
import { MoreOutlined, LogoutOutlined } from "@ant-design/icons";
import useNav from "@/hooks/useNav";
import { PropsWithChildren } from "react";
import { AuthLoginLayout } from "@/components/layouts/AuthLogin";

function UserDropDown(
  props: PropsWithChildren<{
    disabled?: boolean;
  }>
) {
  const { userLogout } = UserModel.useModel();
  return (
    <Dropdown
      overlayStyle={{
        width: "160px",
      }}
      disabled={props.disabled}
      menu={{
        items: [
          {
            key: "center",
            label: "个人中心",
          },
          {
            type: "divider",
          },
          {
            key: "logout",
            label: (
              <div className="flex justify-between items-center">
                退出登录
                <LogoutOutlined />
              </div>
            ),
            onClick: userLogout,
          },
        ],
      }}
      placement="bottomRight"
      trigger={["click"]}
    >
      {props.children}
    </Dropdown>
  );
}

const ProSetting: ProSettings = {
  fixSiderbar: true,
};

export default function ConsoleLayout() {
  const outlet = useOutlet();
  const { userInfo } = UserModel.useModel();
  const { nav } = useNav();

  return (
    <AuthLoginLayout>
      <ProLayout
        route={{
          routes: [],
        }}
        title="lflow"
        className="custom-pro-layout"
        appList={[
          {
            icon: "https://qgtiger.github.io/code-playground/assets/react-CHdo91hT.svg",
            title: "React Playground",
            desc: "React Playground",
            url: "https://qgtiger.github.io/code-playground",
            target: "_blank",
          },
          {
            icon: "https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png",
            title: "AntV",
            desc: "node playground",
            url: "https://node-playground.vercel.app/",
            target: "_blank",
          },
        ]}
        menuFooterRender={(props) => {
          const { collapsed } = props || {};
          return (
            <div className="pt-2 border-t">
              <UserDropDown disabled={!collapsed}>
                <div
                  className={classNames(
                    "flex items-center max-w-full pr-3 pl-1.5 py-1 rounded text-[#0b0e14] transition-all cursor-pointer",
                    {
                      "hover:bg-[#eaebeb]": collapsed,
                    }
                  )}
                >
                  <Avatar
                    style={{
                      background: "#f56a00",
                      verticalAlign: "middle",
                      width: "36px",
                      height: "36px",
                    }}
                    className=" flex-grow-0 flex-shrink-0"
                    gap={7}
                  >
                    {userInfo.username?.slice(0, 1)}
                  </Avatar>
                  {collapsed ? null : (
                    <>
                      <div className=" flex flex-col ml-2 min-w-0 flex-1">
                        <span className="text-regular-plus text-sm overflow-hidden overflow-ellipsis text-nowrap">
                          {userInfo.username}
                        </span>
                        <span className="text-regular text-[#47536b] text-xs min-w-0 overflow-hidden overflow-ellipsis">
                          {userInfo.email}
                        </span>
                      </div>
                      <UserDropDown>
                        <MoreOutlined className=" hover:bg-[#eaebeb] rounded p-2" />
                      </UserDropDown>
                    </>
                  )}
                </div>
              </UserDropDown>
            </div>
          );
        }}
        onMenuHeaderClick={(e) => console.log(e)}
        menuItemRender={(item, dom) => (
          <a
            onClick={() => {
              nav(item.path || "/");
            }}
          >
            {dom}
          </a>
        )}
        {...ProSetting}
      >
        <>{outlet}</>
      </ProLayout>
    </AuthLoginLayout>
  );
}
