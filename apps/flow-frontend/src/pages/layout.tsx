import { UserModel } from "@/model/UserModel";
import { NotificationRef } from "@/utils/customNotification";
import { ConfigProvider, Modal, notification } from "antd";
import { useEffect, useRef } from "react";
import { useLocation, useOutlet } from "react-router-dom";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ModalRef } from "@/utils/customModal";
import zhCN from "antd/locale/zh_CN";

export default function Layout() {
  const outlet = useOutlet();
  const holderRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const [modalApi, modalContextHolder] = Modal.useModal();

  useEffect(() => {
    NotificationRef.current = notificationApi;
    ModalRef.current = modalApi;
  });

  useEffect(() => {
    while (ModalRef.modalInsList.length) {
      ModalRef.modalInsList.pop()?.destroy();
    }
  }, [location]);

  return (
    <ConfigProvider prefixCls="lflow" locale={zhCN}>
      <UserModel.Provider>
        {outlet}
        <div ref={holderRef}>
          {notificationContextHolder} {modalContextHolder}
        </div>
      </UserModel.Provider>
      {/* <ReactQueryDevtools initialIsOpen={false} position="left" /> */}
    </ConfigProvider>
  );
}
