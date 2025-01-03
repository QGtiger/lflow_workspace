import { Form } from "antd";
import useEditor from "../hooks/useEditor";
import { DynamicFormItem } from "../typings";
import { useMemo } from "react";
import GithubMarkdown from "@/components/GithubMarkdown";

const DefaultConfig = {
  placeholder: "请输入",
};

function WrapperFieldComponent(props: {
  formItemState: DynamicFormItem;
  [x: string]: any;
}) {
  const { formItemState, ...otherProps } = props;
  const { type, payload } = props.formItemState;
  const FieldComponent = useEditor(type);
  const _config = Object.assign({}, DefaultConfig, payload.config);
  return (
    <div className="relative">
      {payload.description && (
        <div className="desc text-[#888f9d] mb-1 mt-1">
          <GithubMarkdown>{payload.description}</GithubMarkdown>
        </div>
      )}
      <div>
        {payload.extra}
        <FieldComponent {...otherProps} {..._config} />
      </div>
    </div>
  );
}

export default function RecursionFormItem({
  formItemState,
}: {
  formItemState: DynamicFormItem;
}) {
  const { payload, next } = formItemState;

  const nextFieldItem = useMemo(() => {
    let current: DynamicFormItem | null = formItemState;
    if (!next || !current) return null;

    // 获取所有祖先节点
    const acients: DynamicFormItem[] = [];
    acients.unshift(current);
    while ((current = current.parent)) {
      acients.unshift(current);
    }

    // 递归渲染
    const item = next(formItemState, acients);
    if (!item) return null;
    return <RecursionFormItem formItemState={item} />;
  }, [formItemState]);

  return (
    <>
      <Form.Item
        label={payload.label}
        name={payload.name}
        required={payload.required}
        rules={[
          {
            validator(_, value) {
              return new Promise<void>((r, j) => {
                if (payload.required && !value) return j(new Error("必填项"));
                const error = payload.valadator?.(value);
                if (error) j(error);
                r();
              });
            },
          },
        ]}
      >
        <WrapperFieldComponent formItemState={formItemState} />
      </Form.Item>
      {nextFieldItem}
    </>
  );
}
