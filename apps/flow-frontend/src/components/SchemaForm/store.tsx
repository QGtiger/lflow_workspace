import { create } from "zustand";
import { DynamicFormFieldsType } from "./typings";
import { Input, InputNumber, Radio, Select } from "antd";
import DynamicForm from "./components/DynamicForm";
import InputWithCopy from "./components/InputWithCopy";
import useDefaultValue from "./hooks/useDefaultValue";
import EmailCaptcha from "./components/EmailCaptcha";

function CustomTextArea(props: any) {
  return (
    <Input.TextArea
      autoSize={{
        minRows: 5,
      }}
      {...props}
    />
  );
}

export const useFormStore = create<{
  fieldComponentMap: Record<
    DynamicFormFieldsType,
    (props: any) => React.ReactNode
  >;
  formValue: Record<string, any>;
  setFormValue: (
    fn: (value: Record<string, any>) => Record<string, any>
  ) => void;
  onFileUpload: (file: File) => Promise<string>;
  setFileUpload: (fn: (file: File) => Promise<string>) => void;
  injectComponents: (
    map: Partial<Record<DynamicFormFieldsType, (props: any) => React.ReactNode>>
  ) => void;
}>((set) => ({
  formValue: {},
  fieldComponentMap: {
    Input: Input,
    Textarea: CustomTextArea,
    InputNumber: InputNumber,
    Select: (props: any) => {
      useDefaultValue(props);
      return <Select {...props} />;
    },
    DynamicForm: DynamicForm,
    RadioGroup: Radio.Group,
    InputWithCopy: InputWithCopy,
    InputPassword: Input.Password,
    EmailCaptcha,
  },
  onFileUpload(file) {
    // TODO 就放这里吧先
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  },

  injectComponents: (
    map: Partial<Record<DynamicFormFieldsType, (props: any) => React.ReactNode>>
  ) => {
    set((state) => {
      state.fieldComponentMap = { ...state.fieldComponentMap, ...map };
      return { ...state };
    });
  },
  setFormValue: (fn: (value: Record<string, any>) => Record<string, any>) => {
    set((state) => {
      state.formValue = fn(state.formValue);
      return { ...state };
    });
  },
  setFileUpload: (fn: (file: File) => Promise<string>) => {
    set((state) => {
      state.onFileUpload = fn;
      return { ...state };
    });
  },
}));
