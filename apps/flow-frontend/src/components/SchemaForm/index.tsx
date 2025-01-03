import { Form, FormInstance, FormProps } from "antd";
import { FormSchema } from "./typings";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import RecursionFormItem from "./RecursionFormItem";
import { useFormStore } from "./store";
import { findCusrorItem } from "./utils/findCursorItem";
import { useForm } from "antd/es/form/Form";

type SchemaProps = {
  schema: FormSchema[];
  onFileUpload?: (file: File) => Promise<string>;
  extraComponents?: Partial<Record<string, (props: any) => React.ReactNode>>;
} & FormProps;

export const SchemaForm = forwardRef<FormInstance, SchemaProps>(
  (props, ref) => {
    const { schema, onFileUpload, extraComponents, ...formProps } = props;
    const [form] = useForm();
    const formRef = useRef<FormInstance>(null);
    const formValue = useFormStore((state) => state.formValue);
    const setFormValue = useFormStore((state) => state.setFormValue);
    const injectComponents = useFormStore((state) => state.injectComponents);
    const setFileUpload = useFormStore((state) => state.setFileUpload);

    useEffect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      extraComponents && injectComponents(extraComponents);
    }, [extraComponents]);

    useEffect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onFileUpload && setFileUpload(onFileUpload);
    }, [onFileUpload]);

    useEffect(() => {
      setFormValue(() => {
        return props.initialValues || {};
      });
    }, []);

    useImperativeHandle(ref, () => formRef.current as FormInstance);

    const cursorFormItem = findCusrorItem(
      schema,
      formRef.current?.getFieldsValue() || formValue,
      0
    );

    return (
      <Form
        ref={formRef}
        form={form}
        layout="vertical"
        {...formProps}
        autoComplete={"off"}
        id="custom_dynamic_form"
        onValuesChange={(c, v) => {
          formProps.onValuesChange?.(c, v);
          setFormValue(() => v);
        }}
      >
        {cursorFormItem && <RecursionFormItem formItemState={cursorFormItem} />}
      </Form>
    );
  }
);
