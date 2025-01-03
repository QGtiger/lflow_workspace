export type DynamicFormFieldsType =
  | "Input"
  | "Textarea"
  | "InputNumber"
  | "Select"
  | "DynamicForm"
  | "RadioGroup"
  | "InputWithCopy"
  | "InputPassword"
  | "EmailCaptcha";

type BaseDynamicPayload = FormSchema;

export type DynamicFormItem = {
  type: string;
  payload: BaseDynamicPayload;
  next: (
    current: DynamicFormItem,
    acient: DynamicFormItem[]
  ) => DynamicFormItem | null;
  parent: DynamicFormItem | null;
};

export type FormSchema = {
  name: string | string[];
  label?: string;
  description?: string;
  type: DynamicFormFieldsType;
  required?: boolean;
  visibleRules?: (value: any) => boolean;
  valadator?: (value: any) => string | void;
  config?: any;
  extra?: React.ReactNode;
};

export type CommonFormFieldProps<T = string> = {
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
};
