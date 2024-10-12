export const editorConnetorSchema: IpaasFormSchema[] = [
  {
    code: "logo",
    name: "连接器图标",
    type: "string",
    required: true,
    editor: {
      kind: "Upload",
    },
  },
  {
    code: "name",
    name: "连接器名称",
    type: "string",
    description: "名称可以由数字、英文、下划线组成，最长 30个字符",
    required: true,
    editor: {
      kind: "Input",
    },
    validateRules: `function main(value) {
      if (!value) {
        throw new Error('请输入名称');
      } else if (value.length > 30) {
        throw new Error('最多输入30个字符');
      }
    }`,
  },
  {
    code: "description",
    name: "描述",
    type: "string",
    description:
      "> 名称可以由`数字`、英文、下划线组成，最长 150个字符。 支持 `markdown` 语法",
    required: true,
    editor: {
      kind: "Textarea",
    },
    validateRules: `function main(value) {
    if (!value) {
        throw new Error('请输入描述');
      } else if (value.length > 150) {
        throw new Error('最多输入150个字符');
      }
    }`,
  },
  {
    code: "documentlink",
    name: "帮助文档",
    type: "string",
    description: "请输入文档地址链接",
    validateRules: `function main(value) {
      if (value && !/^https?:/.test(value)) {
        throw new Error('请输入正确的链接地址');
      }
    }`,
    editor: {
      kind: "Input",
    },
  },
];
