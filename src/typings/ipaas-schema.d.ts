type FieldType =
  | "string"
  | "number"
  | "boolean"
  | "datetime"
  | "any"
  | "list"
  | "struct";

type EditorKindMapping = {
  string:
    | "Input"
    | "Upload"
    | "PlainText"
    | "InputWithCopy"
    | "Select"
    | "Textarea";
  number: "InputNumber" | "Select";
  boolean: "Switch" | "Select";
  datetime: "DateTimePicker" | "DatePicker" | "TimePicker";
  any: "Input";
  list: "MultiSelect" | "MultiList";
  struct: "DynamicForm";
};

type EditorTypeConfig = {
  kind: EditorKindMapping[FieldType];
  config?: EditotKindConfigMapping[EditorKindMapping[FieldType]];
};

type EditotKindConfigMapping = {
  Input: {
    placeholder?: string;
    defaultValue?: any;
  };
  Upload: any;
  PlainText: {
    mdContent: string;
  };
  InputWithCopy: {
    defaultValue?: any;
    btnText?: string;
  };
  Select: {
    placeholder?: string;
    defaultValue?: any;

    isDynamic: boolean;

    dynamicScript: string;
    depItems?: string[];

    options: Array<{ label: string; value: string }>;
  };
  Textarea: {
    placeholder?: string;
    defaultValue?: string;
  };
  InputNumber: {
    placeholder?: string;
    defaultValue?: number;
  };
  Switch: {
    checkedChildren?: string;
    unCheckedChildren?: string;
  };
  DateTimePicker: {
    format: string;
  };
  DatePicker: {
    format: string;
  };
  TimePicker: {
    format: string;
  };
  MultiSelect: {
    placeholder?: string;
    defaultValue?: any;

    isDynamic: boolean;

    dynamicScript: string;
    depItems?: string[];

    options: Array<{ label: string; value: string }>;
  };
  MultiList: EditorTypeConfig;
  DynamicForm: {
    isDynamic: boolean;

    dynamicScript?: string; // () => IpaasFormSchema[]
    depItems?: string[];

    staticSubFields?: Array<IpaasFormSchema>;
  };
};

// 提取 EditorKindMapping 中的所有值
type ExtractEditorKinds =
  keyof EditorKindMapping extends keyof EditorKindMapping
    ? EditorKindMapping[keyof EditorKindMapping]
    : never;

interface IpaasFormSchema {
  code: string | string[];
  name: string;
  type: FieldType;
  description?: string;
  required?: boolean;

  group?: string;
  visibleRules?: string; // 可见规则

  editor: EditorTypeConfig;

  validateRules?: string; // 校验规则
}
