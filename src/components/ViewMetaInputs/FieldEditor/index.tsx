import { IPaasSchemaForm } from "@/components/IPaasSchemaForm";
import { FIELDINDEX } from "@/constant";
import useRouteBlock from "@/hooks/useRouteBlock";
import useRouter from "@/hooks/useRouter";
import { LeftOutlined } from "@ant-design/icons";
import { Button, Tabs } from "antd";
import type { FormInstance, TabsProps } from "antd";
import { useMemo, useRef, useState } from "react";
import {
  EditFormSchema,
  EditorKindConfigSchemaMap,
  ExpertFormSchema,
} from "./schema";

const defaultFormField: Partial<IpaasFormSchema> = {
  // type: 'string',
  // editor: {
  //   kind: 'Input',
  //   config: {},
  // },
  // required: true,
  // visible: true,
};

// 表单有编辑的时候，会有提示
// 当表单有编辑并且表单验证通过的时候才可以 保存

export default function FieldEditor({
  initialFormField,
  onFinished,
  fields,
}: {
  initialFormField?: IpaasFormSchema;
  onFinished: (field: IpaasFormSchema, callback?: () => void) => Promise<any>;
  fields: IpaasFormSchema[];
}) {
  const { navByDelSearchParam, delSearchParam } = useRouter();
  const form1Ref = useRef<FormInstance>(null);
  const form2Ref = useRef<FormInstance>(null);
  const _initialFormField = initialFormField || defaultFormField;
  const [form1Value, setForm1Value] = useState<any>(_initialFormField);

  // 注意这里和默认值要对应上，否则会会有问题，会触发用户修改逻辑。从而导致跳转校验
  const {
    disabled,
    formChange,
    navWithOutCheck,
    makeFormConfirm,
    formLoading,
  } = useRouteBlock({
    formInstanceListRef: [form1Ref, form2Ref],
    originData: _initialFormField,
    async onConfirm(data) {
      return onFinished(data, () => {
        navWithOutCheck(delSearchParam(FIELDINDEX), { replace: true });
      });
    },
  });

  const baseSchema = useMemo(() => {
    const _schema = [...EditFormSchema];
    const _kind: ExtractEditorKinds = form1Value?.editor?.kind;
    if (!_kind) return _schema;
    const extra = [...(EditorKindConfigSchemaMap[_kind] || [])];
    if (["Select", "MultiSelect", "DynamicForm"].includes(_kind)) {
      extra.push({
        name: "依赖项",
        code: ["editor", "config", "depItems"],
        type: "list",
        description: "动态加载数据的依赖项",
        editor: {
          kind: "MultiSelect",
          config: {
            placeholder: "请选择依赖项",
            options: fields.map((it) => {
              return {
                value: it.code,
                label: it.name,
              };
            }),
          },
        },
        visibleRules: `editor.config && !!editor.config.isDynamic`,
      });
    }
    _schema.push({
      name: "组件配置",
      code: "editor",
      type: "struct",
      description: "组件配置",
      editor: {
        kind: "DynamicForm",
        config: {
          isDynamic: false,
          staticSubFields: extra,
        } as EditotKindConfigMapping["DynamicForm"],
      },
    });
    return _schema;
  }, [form1Value, fields]);

  const tabItems = [
    {
      label: "基本信息",
      key: "1",
      forceRender: true,
      children: (
        <div>
          <IPaasSchemaForm
            ref={form1Ref}
            initialValues={_initialFormField}
            layout="vertical"
            schema={baseSchema}
            onValuesChange={(_, v) => {
              setForm1Value(v);
              formChange();
            }}
            dynamicScriptExcuteWithOptions={async ({ script, extParams }) => {
              const formValues = form1Ref.current!.getFieldsValue();
              return new Function(
                "context",
                `
                try {
                  with(context) {
                    ${script}
                    return main()
                  }
                } catch (e) {
                  console.error('动态select error:', e)
                  return []
                }
              `
              )({
                params: {
                  ...formValues,
                  ...extParams,
                },
              });
            }}
            dynamicScriptExcuteWithFormSchema={async ({ script }) => {
              const formValues = form1Ref.current!.getFieldsValue();
              return new Function(
                "context",
                `
                try {
                  with(context) {
                    ${script}
                    return main()
                  }
                } catch (e) {
                  console.error('动态select error:', e)
                  return []
                }
              `
              )({
                params: {
                  ...formValues,
                },
              });
            }}
          />
        </div>
      ),
    },
    {
      label: "高级配置",
      key: "expert",
      forceRender: true,
      children: (
        <IPaasSchemaForm
          ref={form2Ref}
          onValuesChange={formChange}
          schema={ExpertFormSchema}
        />
      ),
    },
  ] as TabsProps["items"];

  return (
    <div className="fieldeditor">
      <div
        className="flex items-center gap-2 text-sm relative text-[#86909c] cursor-pointer"
        onClick={() => {
          navByDelSearchParam(FIELDINDEX, { replace: true });
        }}
      >
        <LeftOutlined />
        <div className="relative  tracking-[0] leading-[normal]">参数列表</div>
      </div>
      <div className=" px-[24px] pt-[12px] pb-[24px] bg-[#f6f8fb] mt-6">
        <Tabs defaultActiveKey="1" items={tabItems} />
        <Button
          type="primary"
          disabled={disabled}
          onClick={makeFormConfirm}
          loading={formLoading}
        >
          保存
        </Button>
      </div>
    </div>
  );
}
