export const AddActionSchema: IpaasFormSchema[] = [
  {
    code: "name",
    name: "执行操作展示名称",
    type: "string",
    required: true,
    editor: {
      kind: "Input",
    },
  },
  {
    code: "description",
    name: "执行操作描述",
    type: "string",
    required: true,
    editor: {
      kind: "Textarea",
    },
  },
];
