export type IPaasDynamicFormItem = {
  type: ExtractEditorKinds;
  payload: IpaasFormSchema;
  next: (
    current: IPaasDynamicFormItem,
    acient: IPaasDynamicFormItem[]
  ) => IPaasDynamicFormItem | null;
  parent: IPaasDynamicFormItem | null;
};

export type IPaasCommonFormFieldProps<T = string> = {
  value: T;
  onChange: (value: T) => void;
  placeholder?: string;
  name: string;
  schemaInfo: IpaasFormSchema;
};
