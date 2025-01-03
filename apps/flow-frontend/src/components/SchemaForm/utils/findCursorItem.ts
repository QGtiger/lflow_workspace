import { createFormItem } from "../RecursionFormItem/createFormItem";
import { DynamicFormItem, FormSchema } from "../typings";

export function findCusrorItem(
  schema: FormSchema[],
  formValue: object,
  index: number
): DynamicFormItem | null {
  if (!schema || index >= schema.length) return null;

  const item = schema[index];
  // 有校验规则并且不通过 就接着往下找
  if (item.visibleRules && !item.visibleRules(formValue)) {
    return findCusrorItem(schema, formValue, index + 1);
  } else {
    return createFormItem({
      type: item.type,
      payload: item,
      next: () => {
        return findCusrorItem(schema, formValue, index + 1);
      },
      parent: null,
    });
  }
}
