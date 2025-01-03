import { DynamicFormItem } from "../typings";

export function createFormItem(itemConfig: DynamicFormItem) {
  const { type, payload, next, parent } = itemConfig;

  const nextFunc: DynamicFormItem["next"] = (current, acient) => {
    const nextItem = next(current, acient);
    if (!nextItem) return null;

    nextItem.parent = current;
    return nextItem;
  };

  return {
    type,
    payload,
    next: nextFunc,
    parent,
  };
}
