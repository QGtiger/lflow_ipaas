/* eslint-disable @typescript-eslint/no-unused-vars */
import { IPaasSchemaForm } from "@/components/IPaasSchemaForm";
import { FIELDINDEX } from "@/constant";
import useRouteBlock from "@/hooks/useRouteBlock";
import useRouter from "@/hooks/useRouter";
import { LeftOutlined } from "@ant-design/icons";
import { Button, Tabs } from "antd";
import type { FormInstance, TabsProps } from "antd";
import { useMemo, useRef } from "react";
import { EditFormSchema } from "./schema";

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

  // 注意这里和默认值要对应上，否则会会有问题，会触发用户修改逻辑。从而导致跳转校验
  const { disabled, formChange, navWithOutCheck, makeFormConfirm } =
    useRouteBlock({
      formInstanceListRef: [form1Ref, form2Ref],
      originData: _initialFormField,
      async onConfirm(data) {
        console.log(data);
        // return onFinished(data, () => {
        //   navWithOutCheck(delSearchParam(FIELDINDEX), { replace: true });
        // });
      },
    });

  const tabItems = useMemo(() => {
    return [
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
              schema={EditFormSchema}
              onValuesChange={formChange}
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
    ] as TabsProps["items"];
  }, []);

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
        <Button type="primary" disabled={disabled} onClick={makeFormConfirm}>
          保存
        </Button>
      </div>
    </div>
  );
}
