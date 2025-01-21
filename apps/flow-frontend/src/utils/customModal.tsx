import { SchemaForm } from "@/components/SchemaForm";
import { FormInstance, ModalFuncProps } from "antd";
import { createRef } from "react";
import { FormSchema } from "@/components/SchemaForm/typings";
import { HookAPI } from "antd/es/modal/useModal";

/**
 * 简单的一个节流函数
 * @param fn 节流函数
 * @param delay 节流时间
 * @returns
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
) {
  let lastTime = 0;
  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastTime > delay) {
      lastTime = now;
      return fn.apply(this, args);
    }
  };
}

export const ModalRef = {
  current: undefined as unknown as HookAPI,
  modalInsList: [] as { destroy: () => void }[],
};

export function createModal(config: ModalFuncProps) {
  // 路由拦截，不让跳转
  const ins = ModalRef.current.confirm({
    ...config,
  });
  ModalRef.modalInsList.push(ins);
  return ins;
}

export const createSchemaFormModal = throttle(function <
  T extends Record<string, any>
>(config: {
  title: string;
  schema: FormSchema[];
  onFinished: (values: T) => Promise<any>;
  schemaFormProps?: Partial<Parameters<typeof SchemaForm>[0]>;
  modalProps?: ModalFuncProps;
  useConsoleModal?: boolean;
}) {
  const formRef = createRef<FormInstance>();
  const ModalCur = ModalRef.current;
  const ins = ModalCur.confirm({
    title: config.title,
    closable: true,
    icon: null,
    width: 704,
    content: (
      <div className="mt-3">
        <SchemaForm
          layout="vertical"
          ref={formRef}
          schema={config.schema}
        ></SchemaForm>
      </div>
    ),
    onOk: () => {
      return new Promise((resolve, reject) => {
        formRef.current?.validateFields().then(async (v) => {
          resolve(await config.onFinished(v as T).catch(reject));
        }, reject);
      });
    },
    ...config.modalProps,
  });
  ModalRef.modalInsList.push(ins);
  // @ts-expect-error  Modal 示例上没有 getFieldsValue 方法
  ins.getFieldsValue = () => formRef.current?.getFieldsValue();
  return ins;
},
500);
