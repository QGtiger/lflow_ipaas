/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Dropdown,
  FormInstance,
  Input,
  Select,
  Button,
  Form,
  Table,
} from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { v4 as uuidV4 } from "uuid";
import { createSchemaFormModal } from "@/utils/customModal";
import { transform } from "@/utils/transform";

const InputNoSpace = Input;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  label: string;
  name: string;
  type: string;
  disabled?: boolean;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  editType?: "select" | "input";
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  editType,
  ...restProps
}) => {
  const inputRef = useRef<any>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (inputRef.current) {
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    }
  }, [inputRef]);
  const save = async () => {
    try {
      const values = await form.validateFields();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  const defaultOptions = [
    {
      value: "string",
      label: "字符串",
    },
    {
      value: "number",
      label: "数字",
    },
    {
      value: "boolean",
      label: "布尔",
    },
    {
      value: "object",
      label: "对象",
    },
    {
      value: "array",
      label: "数组",
    },
  ];

  if (editable) {
    childNode = Array.isArray(children) ? (
      <div className="relative flex items-center" ref={inputRef}>
        <div className="">{children[0]}</div>
        <div className="editable-cell-value-wrap w-1 flex-1">
          <Form.Item style={{ margin: 0 }} name={dataIndex}>
            {editType === "select" ? (
              <Select options={defaultOptions} onSelect={save} onBlur={save} />
            ) : (
              <InputNoSpace disabled={record.disabled} onChange={save} />
            )}
          </Form.Item>
        </div>
      </div>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  label: string;
  name: string;
  type: string;
  disabled?: boolean;
  children?: DataType[];
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

function findParent(
  data: DataType[],
  key: string,
  callback: (parent: DataType[], data: DataType, index: number) => void
) {
  data.forEach((item, index) => {
    if (item.key === key) {
      callback(data, item, index);
    } else if (item.children) {
      findParent(item.children, key, callback);
    }
  });
}

export default function TableEditor(
  props: IPaasCommonFormFieldProps<
    {
      label: string;
      name: string;
      type: string;
      children?: DataType[];
    }[]
  >
) {
  const { value, onChange } = props;
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  const dataSource = useMemo(() => {
    if (!value) return [];
    const cl = ["object", "array"];
    const loop = (list: any[]) => {
      list.forEach((item) => {
        if (!cl.includes(item.type)) {
          delete item.children;
        }
        if (item.type === "array") {
          // if (!item.children) {
          //   item.children = [
          //     {
          //       key: uuidV4(),
          //       name: 'array[index]',
          //       label: 'array[index]',
          //       disabled: true,
          //       type: 'string',
          //     },
          //   ];
          // }
          // // 数组类型不允许编辑
          // item.children[0].disabled = true;
          // item.children[0].name = 'array[index]';
          // item.children[0].label = 'array[index]';
          const firstItem = item.children?.[0];
          // 原来就是数组就不要替换 key
          const _key = firstItem?.disabled ? firstItem?.key : uuidV4();
          item.children = [
            {
              ...firstItem,
              disabled: true,
              name: "array[index]",
              label: "array[index]",
              key: _key || uuidV4(),
              type: firstItem?.type || "string",
            },
          ];
        }

        if (item.type === "object" && item.children) {
          const isOriginArray = item.children.some((i: any) => i.disabled);
          if (isOriginArray) {
            delete item.children;
          }
        }

        if (item.children && item.children.length > 0) {
          loop(item.children);
        } else {
          delete item.children;
        }

        item.key = item.key || uuidV4();
      });
    };
    loop(value);
    return value as DataType[];
  }, [value]);

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
    editType?: string;
  })[] = [
    {
      title: "展示名称",
      dataIndex: "label",
      width: "30%",
      editable: true,
    },
    {
      title: "字段编码",
      dataIndex: "name",
      editable: true,
      width: "30%",
    },
    {
      title: "变量类型",
      dataIndex: "type",
      editable: true,
      width: "30%",
      editType: "select",
    },
    {
      title: "操作",
      dataIndex: "operation",
      render: (_, record: any) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "add",
                label: "添加子级",
                onClick() {
                  handleAddChild(record);
                },
                disabled: record.type !== "object",
              },
              {
                key: "addSlibing",
                label: "添加同级",
                onClick() {
                  handleAddSlibing(record);
                },
                disabled: record.disabled,
              },
              {
                key: "delete",
                label: "删除",
                onClick() {
                  handleDelete(record);
                },
                disabled: record.disabled,
              },
            ],
          }}
        >
          <MoreOutlined
            rotate={90}
            className=" hover:bg-[#e4ebfd] rounded p-1"
          />
        </Dropdown>
      ),
    },
  ];

  const handleDelete = (row: DataType) => {
    const newData = [...dataSource];
    findParent(newData, row.key as string, (parent, _, index) => {
      parent.splice(index, 1);
    });
    onChange(newData);
  };

  const getNewItem = () => ({
    key: uuidV4(),
    name: "",
    label: "",
    type: "string",
  });

  const handleAddSlibing = (row: DataType) => {
    const newData = getNewItem();
    const newDataList = [...dataSource];
    findParent(newDataList, row.key as string, (parent, item, index) => {
      parent.splice(index + 1, 0, newData);
    });
    onChange(newDataList);
  };

  const handleAddTrail = () => {
    const newData = getNewItem();
    const newDataList = [...dataSource];
    newDataList.push(newData);
    onChange(newDataList);
  };

  const handleAddChild = (row: DataType) => {
    const newData = getNewItem();
    const newDataList = [...dataSource];
    findParent(newDataList, row.key as string, (_, item) => {
      if (!item.children) {
        item.children = [];
      }
      item.children.push(newData);
      setExpandedRowKeys((origin) => [...origin, item.key]);
    });
    onChange(newDataList);
  };

  // 保存
  const handleSave = (row: DataType) => {
    const newData = [...dataSource];

    findParent(newData, row.key as string, (parent, item, index) => {
      parent.splice(index, 1, {
        ...item,
        ...row,
      });
    });
    onChange(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        editType: col.editType,
        handleSave,
      }),
    };
  });

  return (
    <div>
      <Button
        className="absolute right-0 top-[-30px]"
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => {
          createSchemaFormModal({
            title: "导入JSON",
            schema: [
              {
                code: "json",
                name: "JSON",
                type: "string",
                description:
                  "请填写正确的JSON， 导入成功后，原有的数据将被覆盖",
                required: true,
                editor: {
                  kind: "CodeEditor",
                  config: {
                    language: "json",
                    width: "100%",
                  },
                },
                validateRules: `
                    function main(v) {
                      try {
                        JSON.parse(v);
                        return '';
                      } catch (error) {
                        throw new Error('JSON 格式不正确')
                      }
                    }
                  `,
              },
            ],
            async onFinished(data) {
              // @ts-expect-error 类型错误 问题不大
              props.onChange(transform(JSON.parse(data.json)));
              // formRef.current?.setFieldValue('outputs', transform(JSON.parse(data.json)));
              // formChange();
            },
            schemaFormProps: {
              validateTrigger: [],
            },
          });
        }}
      >
        导入JSON
      </Button>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        pagination={false}
        onExpandedRowsChange={(k) => {
          setExpandedRowKeys(k);
        }}
        expandedRowKeys={expandedRowKeys}
      />
      <Button
        className="mt-4"
        onClick={handleAddTrail}
        type="dashed"
        style={{ marginBottom: 16 }}
      >
        添加字段
      </Button>
    </div>
  );
}
