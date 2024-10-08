export const EditorKindEnum: Record<ExtractEditorKinds, string> = {
  DatePicker: "日期选择器",
  DateTimePicker: "日期时间选择器",
  TimePicker: "时间选择器",
  DynamicForm: "动态子表单",
  Input: "单行输入框",
  InputNumber: "数字输入框",
  InputWithCopy: "带复制文本",
  MultiList: "多组数据",
  MultiSelect: "多选下拉",
  PlainText: "纯展示文本",
  Select: "单选下拉",
  Switch: "开关",
  Textarea: "多行文本",
  Upload: "图片上传",
};

const TypeOptions: Record<FieldType, ExtractEditorKinds[]> = {
  string: [
    "Input",
    "Textarea",
    "Select",
    "PlainText",
    "InputWithCopy",
    "Upload",
  ],
  number: ["InputNumber", "Select"],
  boolean: ["Switch"],
  datetime: ["DateTimePicker", "DatePicker", "TimePicker"],
  any: ["Input"],
  list: ["MultiSelect", "MultiList"],
  struct: ["DynamicForm"],
};

function getDefaultInputConfigSchema(opt?: {
  defaultKind?: ExtractEditorKinds;
}): IpaasFormSchema[] {
  const DefaultInputConfigSchema: IpaasFormSchema[] = [
    {
      name: "占位符",
      code: ["editor", "config", "placeholder"],
      type: "string",
      description: "输入框的占位提示",
      editor: {
        kind: "Input",
        config: {
          placeholder: "请输入占位符",
        },
      },
    },
    {
      name: "默认值",
      code: ["editor", "config", "defaultValue"],
      type: "any",
      description: "输入框的默认值",
      editor: {
        kind: opt?.defaultKind || "Input",
        config: {
          placeholder: "请输入默认值",
        },
      },
    },
  ];
  return DefaultInputConfigSchema;
}

const DefaultSelectConfigSchema: IpaasFormSchema[] = [
  {
    name: "占位符",
    code: ["editor", "config", "placeholder"],
    type: "string",
    description: "输入框的占位提示",
    editor: {
      kind: "Input",
      config: {
        placeholder: "请输入占位符",
      },
    },
  },
  {
    name: "默认值",
    code: ["editor", "config", "defaultValue"],
    type: "any",
    description: "输入框的默认值",
    editor: {
      kind: "Input",
      config: {
        placeholder: "请输入默认值",
      },
    },
  },
  {
    name: "是否动态",
    code: ["editor", "config", "isDynamic"],
    type: "boolean",
    description: "是否动态加载数据",
    editor: {
      kind: "Switch",
      config: {
        checkedChildren: "是",
        unCheckedChildren: "否",
        defaultValue: false,
      },
    },
  },
  {
    name: "动态脚本",
    code: ["editor", "config", "dynamicScript"],
    type: "string",
    description: "动态加载数据的脚本",
    required: true,
    visibleRules: "editor.config && !!editor.config.isDynamic",
    editor: {
      kind: "Textarea",
      config: {
        placeholder: "请输入动态脚本",
      },
    },
  },
  {
    name: "静态选项",
    code: ["editor", "config", "options"],
    type: "list",
    required: true,
    description: "下拉选项",
    visibleRules: "!editor.config || !editor.config.isDynamic",
    editor: {
      kind: "Textarea", // TODO 先简单输入吧
    },
  },
];

export const EditorKindConfigSchemaMap: Record<
  ExtractEditorKinds,
  IpaasFormSchema[]
> = {
  Input: getDefaultInputConfigSchema(),
  Textarea: getDefaultInputConfigSchema({
    defaultKind: "Textarea",
  }),
  InputNumber: getDefaultInputConfigSchema({
    defaultKind: "InputNumber",
  }),
  Upload: [],
  PlainText: [
    {
      name: "Markdown内容",
      code: ["editor", "config", "mdContent"],
      type: "string",
      description: "纯展示文本的内容",
      editor: {
        kind: "Textarea",
        config: {
          placeholder: "请输入Markdown内容",
        },
      },
    },
  ],
  InputWithCopy: [
    {
      name: "默认值",
      code: ["editor", "config", "defaultValue"],
      type: "any",
      description: "输入框的默认值",
      editor: {
        kind: "Textarea",
        config: {
          placeholder: "请输入默认值",
        },
      },
    },
    {
      name: "按钮文案",
      code: ["editor", "config", "btnText"],
      type: "string",
      description: "按钮文案",
      editor: {
        kind: "Input",
        config: {
          placeholder: "请输入按钮文案",
        },
      },
    },
  ],
  Select: DefaultSelectConfigSchema,
  Switch: [
    {
      name: "打开文案",
      code: ["editor", "config", "checkedChildren"],
      type: "string",
      description: "打开时的文案",
      editor: {
        kind: "Input",
        config: {
          placeholder: "请输入打开文案",
        },
      },
    },
    {
      name: "关闭文案",
      code: ["editor", "config", "unCheckedChildren"],
      type: "string",
      description: "关闭时的文案",
      editor: {
        kind: "Input",
        config: {
          placeholder: "请输入关闭文案",
        },
      },
    },
  ],
  DateTimePicker: [
    {
      name: "日期格式",
      code: ["editor", "config", "format"], // 先简单输入吧
      type: "string",
      description: "日期格式",
      editor: {
        kind: "Input",
        config: {
          placeholder: "请输入日期格式",
        },
      },
    },
  ],
  DatePicker: [
    {
      name: "日期格式",
      code: ["editor", "config", "format"], // 先简单输入吧
      type: "string",
      description: "日期格式",
      editor: {
        kind: "Input",
        config: {
          placeholder: "请输入日期格式",
        },
      },
    },
  ],
  TimePicker: [
    {
      name: "日期格式",
      code: ["editor", "config", "format"], // 先简单输入吧
      type: "string",
      description: "日期格式",
      editor: {
        kind: "Input",
        config: {
          placeholder: "请输入日期格式",
        },
      },
    },
  ],
  MultiList: [],
  MultiSelect: DefaultSelectConfigSchema,
  DynamicForm: [
    {
      name: "是否动态",
      code: ["editor", "config", "isDynamic"],
      type: "boolean",
      description: "是否动态加载数据",
      editor: {
        kind: "Switch",
        config: {
          checkedChildren: "是",
          unCheckedChildren: "否",
          defaultValue: false,
        },
      },
    },
    {
      name: "动态脚本",
      code: ["editor", "config", "dynamicScript"],
      type: "string",
      description: "动态加载数据的脚本",
      visibleRules: "editor.config && !!editor.config.isDynamic",
      editor: {
        kind: "Textarea",
        config: {
          placeholder: "请输入动态脚本",
        },
      },
    },
    {
      name: "静态子表单协议",
      code: ["editor", "config", "staticSubFields"],
      type: "list",
      description: "动态子表单协议数据",
      visibleRules: "!editor.config || !editor.config.isDynamic",
      editor: {
        kind: "Textarea", // TODO 先简单输入吧
      },
    },
  ],
};

export const EditFormSchema: IpaasFormSchema[] = [
  {
    name: "字段名称",
    code: "name",
    type: "string",
    description: "用户在入参表单中展示名称",
    required: true,
    editor: {
      kind: "Input",
      config: {
        placeholder: "请输入字段名称",
      },
    },
  },
  {
    name: "字段编码",
    code: "code",
    type: "string",
    required: true,
    description:
      "仅支持字母、数字、下划线，且不能以数字开头, 参数列表内不可重复",
    editor: {
      kind: "Input",
      config: {
        placeholder: "请输入字段编码",
      },
    },
    validateRules: `
    function main(value) {
      if (!value) {
        throw new Error('请输入字段编码');
      } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {
        throw new Error('仅支持字母、数字、下划线，且不能以数字开头');
      } else if (value.length > 50) {
        throw new Error('最多输入50个字符');
      }
    }
    `,
  },
  {
    name: "帮助说明",
    code: "description",
    type: "string",
    description:
      "字段的帮助说明,一段可帮助用户如何填写该字段的提示，如录入格式，如何获取等, 支持`markdown`",
    editor: {
      kind: "Textarea",
      config: {
        placeholder: "请输入帮助说明",
      },
    },
  },
  {
    name: "数据类型",
    code: "type",
    type: "string",
    description: "字段的数据类型",
    required: true,
    editor: {
      kind: "Select",
      config: {
        isDynamic: false,
        options: [
          {
            label: "🔤 字符串(string)",
            value: "string",
          },
          {
            label: "🔢 数字(number)",
            value: "number",
          },
          {
            label: "🔢 布尔(boolean)",
            value: "boolean",
          },
          {
            label: "⏰ 日期时间(datetime)",
            value: "datetime",
          },
          {
            label: "🔵 任意(any)",
            value: "any",
          },
          {
            label: "📋 列表(list)",
            value: "list",
          },
          {
            label: "📦 结构体(struct)",
            value: "struct",
          },
        ],
      } as EditotKindConfigMapping["Select"],
    },
  },
  {
    name: "组件类型",
    code: ["editor", "kind"],
    type: "string",
    description: "选择控件类型",
    required: true,
    editor: {
      kind: "Select",
      config: {
        isDynamic: true,
        dynamicScript: `
          function main() {
            const {type} = params;
            const TypeOptions = ${JSON.stringify(TypeOptions)};
            const EditorKindEnum = ${JSON.stringify(EditorKindEnum)};
            const kinds = TypeOptions[type] || [];
            return kinds.map(kind => ({
              value: kind,
              label: EditorKindEnum[kind]
            }));
          }
        `,
        depItems: ["type"],
      } as EditotKindConfigMapping["Select"],
    },
  },
  // {
  //   name: "组件配置",
  //   code: "editor",
  //   type: "struct",
  //   description: "组件配置",
  //   editor: {
  //     kind: "DynamicForm",
  //     config: {
  //       isDynamic: true,
  //       dynamicScript: `
  //         function main() {
  //           const {editor} = params;
  //           const { kind } = editor || {}
  //           const hashMap = ${JSON.stringify(EditorKindConfigSchemaMap)};
  //           console.log(kind, hashMap, params)
  //           if (!kind) return []
  //           return hashMap[kind]
  //         }
  //       `,
  //       depItems: ["editor.kind", "type"],
  //       staticSubFields: [],
  //     } as EditotKindConfigMapping["DynamicForm"],
  //   },
  // },
];

export const ExpertFormSchema: IpaasFormSchema[] = [
  {
    code: "group",
    name: "字段分组",
    type: "string",
    editor: {
      kind: "Input",
    },
  },
  {
    code: "visibleRules",
    name: "显示规则",
    type: "string",
    editor: {
      kind: "Input", // 书写表达式
    },
  },
  {
    code: "validateRules",
    name: "校验规则",
    type: "string",
    editor: {
      kind: "Textarea",
    },
  },
];
