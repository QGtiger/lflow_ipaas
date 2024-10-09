import { Button, Segmented, Tabs, TabsProps } from "antd";
import { IPaasSchemaForm } from "../IPaasSchemaForm";
import { useMemo, useRef } from "react";
import MethodUrl from "./MethodUrl";
import HttpConfig from "./HttpConfig";
import TableEditor from "./TableEditor";
import { useReactive } from "ahooks";
import { createModal } from "@/utils/customModal";
import { FormInstance } from "antd/lib";
import useRouteBlock from "@/hooks/useRouteBlock";
import useRouter from "@/hooks/useRouter";

import VarEditor from "@/pages/manager/components/VarEditor";

type UpdateConfirm = (
  data: Partial<{
    excuteProtocol: ExcuteInfer;
    outputs: OutputStrcut[];
    tokenConfig: IpaasAuthProtocel["tokenConfig"];
  }>
) => Promise<any>;

function Excute(props: {
  excuteProtocol: ExcuteInfer;
  onConfirm: UpdateConfirm;
}) {
  const form1Ref = useRef<FormInstance>(null);
  const { excuteProtocol, onConfirm } = props;
  const viewModel = useReactive<{
    mode: ExcuteInfer["mode"];
  }>({
    mode: excuteProtocol?.mode || "http",
  });
  const { mode } = viewModel;
  const isHttp = mode === "http";

  const _initialValue = useMemo(() => {
    return (
      (isHttp
        ? excuteProtocol?.httpModeConfig || {
            method: "GET",
          }
        : excuteProtocol?.codeModeConfig) || {}
    );
  }, [isHttp, excuteProtocol]);

  const { formLoading, makeFormConfirm, formChange, disabled } = useRouteBlock({
    formInstanceListRef: [form1Ref],
    originData: _initialValue,
    async onConfirm(data) {
      const o = isHttp
        ? {
            httpModeConfig: data,
          }
        : {
            codeModeConfig: data,
          };
      await onConfirm({
        excuteProtocol: {
          ...excuteProtocol,
          ...o,
        },
      });
    },
  });

  const formSchema = useMemo(() => {
    if (!isHttp) {
      return [
        {
          code: "script",
          name: "执行脚本",
          type: "string",
          description: "书写完整脚本",
          editor: {
            kind: "CodeEditor",
          },
        },
      ] as IpaasFormSchema[];
    }
    return [
      {
        code: "url",
        name: "设置接口地址",
        type: "any",
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
        name: "请求后数据调整",
        type: "string",
        description:
          "发送接口请求后，对请求返回的参数进行处理（如解密、参数转换等）",
        editor: {
          kind: "CodeEditor",
        },
      },
    ] as unknown as IpaasFormSchema[];
  }, [isHttp]);

  return (
    <div className="excute-config relative">
      <Segmented
        className=" absolute top-0 right-0 z-10"
        value={mode}
        options={[
          {
            label: "HTTP模式",
            value: "http",
          },
          {
            label: "代码模式",
            value: "code",
          },
        ]}
        onChange={(value: any) => {
          createModal({
            title: "切换模式",
            content: "切换模式后，当前配置将会失效，是否继续？",
            onOk() {
              return onConfirm({
                excuteProtocol: {
                  ...excuteProtocol,
                  mode: value,
                },
              }).then(() => {
                viewModel.mode = value;
              });
            },
          });
        }}
      />
      <IPaasSchemaForm
        ref={form1Ref}
        schema={formSchema}
        editorMap={{
          MethodUrl,
          HttpConfig,
          VarEditor,
        }}
        initialValues={_initialValue}
        onValuesChange={formChange}
      />
      <Button
        type="primary"
        disabled={disabled}
        onClick={makeFormConfirm}
        loading={formLoading}
      >
        保存
      </Button>
    </div>
  );
}

const outputsSchema = [
  {
    code: "outputs",
    name: "输出结构",
    type: "any",
    description:
      "预设样本数据，需要和执行配置中 `请求后数据调整` 脚本执行返回数据结构一致",
    editor: {
      kind: "TableEditor" as any,
    },
    required: true,
    validateRules: `
      function main(value) {
      console.log(value)
        function trace(data, callback) {
          if (Array.isArray(data)) {
            data.forEach((item) => {
              trace(item, callback);
            });
          } else {
            callback(data);
            if (data.children) {
              trace(data.children, callback);
            }
          }
        }

       
        trace(value, (item) => {
          if (!item.name) {
            throw new Error('字段编码不能为空');
          }
          if (!item.label) {
            throw new Error('展示名称不能为空');
          }
        });
      }
    `,
  },
] as IpaasFormSchema[];

function Defination(props: {
  outputs: OutputStrcut[];
  onConfirm: UpdateConfirm;
}) {
  const { outputs, onConfirm } = props;
  const form2Ref = useRef<FormInstance>(null);

  const _initialValue = {
    outputs,
  };

  const { formLoading, makeFormConfirm, formChange, disabled } = useRouteBlock({
    formInstanceListRef: [form2Ref],
    originData: _initialValue,
    async onConfirm(data) {
      await onConfirm(data);
    },
  });

  return (
    <div>
      <IPaasSchemaForm
        ref={form2Ref}
        initialValues={_initialValue}
        schema={outputsSchema}
        editorMap={{
          TableEditor,
        }}
        onValuesChange={formChange}
      />
      <Button
        type="primary"
        disabled={disabled}
        onClick={makeFormConfirm}
        loading={formLoading}
      >
        保存
      </Button>
    </div>
  );
}

const tokenConfigSchema: IpaasFormSchema[] = [
  {
    code: "isAutoRefresh",
    name: "是否自动刷新",
    type: "boolean",
    description: "开启后，将在Token失效时自动获取新的Token",
    editor: {
      kind: "Switch",
    },
  },
  {
    code: "isTokenInvalid",
    name: "Token 校验",
    description: "判断Token失效的方式/判断请求成功的方式",
    type: "string",
    editor: {
      kind: "CodeEditor",
    },
  },
];

function TokenConfig({
  tokenConfig,
  onConfirm,
}: {
  tokenConfig: IpaasAuthProtocel["tokenConfig"];
  onConfirm: UpdateConfirm;
}) {
  const formRef = useRef<FormInstance>(null);

  const { formLoading, makeFormConfirm, formChange, disabled } = useRouteBlock({
    formInstanceListRef: [formRef],
    originData: tokenConfig,
    async onConfirm(data) {
      await onConfirm({
        tokenConfig: data,
      });
    },
  });

  return (
    <div>
      <IPaasSchemaForm
        ref={formRef}
        initialValues={tokenConfig}
        schema={tokenConfigSchema}
        onValuesChange={formChange}
      />
      <Button
        type="primary"
        disabled={disabled}
        onClick={makeFormConfirm}
        loading={formLoading}
      >
        保存
      </Button>
    </div>
  );
}

type P = "excute" | "defination";

export default function ExcuteConfig(props: {
  excuteProtocol: ExcuteInfer;
  outputs: OutputStrcut[];
  tokenConfig?: IpaasAuthProtocel["tokenConfig"];
  onConfirm: UpdateConfirm;
}) {
  const { excuteProtocol, onConfirm, outputs, tokenConfig } = props;
  const {
    navBySearchParam,
    searchParamsObj: { et },
  } = useRouter<{
    et: P;
  }>();

  const tabItems: TabsProps["items"] = [
    {
      label: "执行配置",
      key: "excute" as P,
      children: (
        <Excute excuteProtocol={excuteProtocol} onConfirm={onConfirm} />
      ),
    },
    {
      label: "定义输出",
      key: "defination" as P,
      children: <Defination outputs={outputs} onConfirm={onConfirm} />,
    },
  ];
  if (tokenConfig) {
    tabItems.push({
      label: "token配置",
      key: "tokenconfig" as P,
      children: <TokenConfig tokenConfig={tokenConfig} onConfirm={onConfirm} />,
    });
  }

  return (
    <div className=" px-[24px] pt-[12px] pb-[24px] bg-[#f6f8fb]">
      <Tabs
        destroyInactiveTabPane={true}
        activeKey={et || "excute"}
        items={tabItems}
        onChange={(key) => {
          navBySearchParam("et", key);
        }}
      />
    </div>
  );
}
