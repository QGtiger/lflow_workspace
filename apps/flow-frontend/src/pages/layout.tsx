import { UserModel } from "@/model/UserModel";
import { NotificationRef } from "@/utils/customNotification";
import { ConfigProvider, notification } from "antd";
import { useEffect, useRef } from "react";
import { useOutlet } from "react-router-dom";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function Layout() {
  const outlet = useOutlet();
  const holderRef = useRef<HTMLDivElement>(null);

  const [notificationApi, notificationContextHolder] =
    notification.useNotification();

  useEffect(() => {
    NotificationRef.current = notificationApi;
  });

  return (
    <ConfigProvider prefixCls="lflow">
      <UserModel.Provider>
        {outlet}
        <div ref={holderRef}>{notificationContextHolder}</div>
      </UserModel.Provider>
      {/* <ReactQueryDevtools initialIsOpen={false} position="left" /> */}
    </ConfigProvider>
  );
}
