import { createCustomModel } from "@/common/createModel";
import { buildInConncetor } from "../layoutEngine/core";
import { Modal, ModalFuncProps } from "antd";
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

export const ConnectorModel = createCustomModel(() => {
  const list = buildInConncetor.filter((item) => !item.hidden);
  const [modal, contextHolder] = Modal.useModal();
  const modalInsListRef = useRef<any[]>([]);
  const location = useLocation();

  useEffect(() => {
    // 监听路由变化，关闭所有模态框
    modalInsListRef.current.forEach((modalInstance) => {
      modalInstance.destroy();
    });
    modalInsListRef.current = [];
  }, [location]);

  return {
    connectorList: list,
    createModal(config: ModalFuncProps) {
      const modalIns = modal.confirm(config);
      modalInsListRef.current.push(modalIns);
      return modalIns;
    },
    contextHolder,
  };
});
