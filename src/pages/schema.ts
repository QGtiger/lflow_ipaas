import { IpaasFormSchema } from "@/components/IPaasSchemaForm/type";

export const editorConnetorSchema: IpaasFormSchema[] = [
  {
    code: "logo",
    name: "连接器图标",
    type: "string",
    required: true,
    editor: {
      kind: "Upload",
      config: {},
    },
  },
  {
    code: "name",
    name: "连接器名称",
    type: "string",
    description: "名称可以由数字、英文、下划线组成，最长 30个字符",
    required: true,
    validateRules: `function main(value) {
    if (!value) {
        throw new Error("请输入连接器名称");
      } else if (value.length > 30) {
        throw new Error("连接器名称最长 30 个字符");
      }
    }`,
    editor: {
      kind: "Input",
    },
  },
  {
    code: "description",
    name: "描述",
    type: "string",
    description: "名称可以由数字、英文、下划线组成，最长 150个字符",
    required: true,
    editor: {
      kind: "Textarea",
      config: {},
    },
  },
  {
    code: "documentlink",
    name: "帮助文档",
    type: "string",
    description: "请输入文档地址链接",
    editor: {
      kind: "Input",
    },
  },
];
