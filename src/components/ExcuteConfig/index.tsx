import { Button, Segmented, Tabs, TabsProps } from "antd";
import { IPaasSchemaForm } from "../IPaasSchemaForm";
import { useMemo } from "react";
import MethodUrl from "./MethodUrl";
import HttpConfig from "./HttpConfig";
import TableEditor from "./TableEditor";

function Excute() {
  const formSchema = useMemo(() => {
    return [
      {
        code: "url",
        name: "设置接口地址",
        type: "any",
        required: true,
        description: `设置接口地址`,
        editor: {
          kind: "MethodUrl",
        },
      },
      {
        code: "params",
        name: "设置请求参数",
        type: "any",
        description: "设置请求参数",
        editor: {
          kind: "HttpConfig",
        },
      },
      {
        code: ["hooks", "pre"],
        name: "请求前预处理",
        type: "string",
        description:
          "发送接口请求前，先对请求参数进行预处理（如加密、格式拼接等）",
        editor: {
          kind: "CodeEditor",
        },
      },
      {
        code: ["hooks", "post"],
        name: "请求后再调整",
        type: "string",
        description:
          "发送接口请求后，对请求返回的参数进行处理（如解密、参数转换等）",
        editor: {
          kind: "CodeEditor",
        },
      },
    ] as unknown as IpaasFormSchema[];
  }, []);

  return (
    <div className="excute-config relative">
      <Segmented
        className=" absolute top-0 right-0 z-10"
        options={[
          {
            label: "基础模式",
            value: "base",
          },
          {
            label: "专家模式",
            value: "expert",
          },
        ]}
      />
      <IPaasSchemaForm
        schema={formSchema}
        editorMap={{
          MethodUrl,
          HttpConfig,
        }}
      />
    </div>
  );
}

export default function ExcuteConfig() {
  const tabItems: TabsProps["items"] = [
    {
      label: "执行配置",
      key: "excute",
      children: <Excute />,
    },
    {
      label: "定义输出",
      key: "defination",
      children: (
        <IPaasSchemaForm
          schema={[
            {
              code: "outputs",
              name: "输出结构",
              type: "any",
              description: "预设样本数据",
              editor: {
                kind: "TableEditor" as any,
              },
            },
          ]}
          editorMap={{
            TableEditor,
          }}
        />
      ),
    },
  ];

  return (
    <div className=" px-[24px] pt-[12px] pb-[24px] bg-[#f6f8fb]">
      <Tabs defaultActiveKey="1" items={tabItems} />
      <Button type="primary">保存</Button>
    </div>
  );
}
