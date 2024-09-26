import { createFormItem } from "../RecursionFormItem/createFormItem";
import { IPaasDynamicFormItem, IpaasFormSchema } from "../type";

function isVisibleFunc(expression: string, formValue: object) {
  return new Function(
    "context",
    `
    try {
      with(context) {
        return !!(${expression});
      }
    } catch (e) {
      return false
    }
  `
  )(formValue);
}

export function findCusrorItem(
  schema: IpaasFormSchema[],
  formValue: object,
  index: number
): IPaasDynamicFormItem | null {
  if (!schema || index >= schema.length) return null;

  const item = schema[index];
  // 有校验规则并且不通过 就接着往下找
  if (item.visibleRules && !isVisibleFunc(item.visibleRules, formValue)) {
    return findCusrorItem(schema, formValue, index + 1);
  } else {
    return createFormItem({
      type: item.editor.kind,
      payload: item,
      next: () => {
        return findCusrorItem(schema, formValue, index + 1);
      },
      parent: null,
    });
  }
}
