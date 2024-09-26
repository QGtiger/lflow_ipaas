import { IPaasDynamicFormItem } from "../type";

export function createFormItem(itemConfig: IPaasDynamicFormItem) {
  const { type, payload, next, parent } = itemConfig;

  const nextFunc: IPaasDynamicFormItem["next"] = (current, acient) => {
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
