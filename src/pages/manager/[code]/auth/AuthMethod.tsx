import { Alert, Button, FormInstance } from "antd";
import { useRef } from "react";
import AuthType from "./AuthType";
import useRouteBlock from "@/hooks/useRouteBlock";
import { ManagerModel } from "../../model";
import CustomIPaasSchemaForm from "@/components/CustomIPaasSchemaForm";

const _editorMap = {
  AuthType,
};

export default function AuthMethod() {
  const formRef = useRef<FormInstance>(null);
  const { connectorVersionInfo, updateConnectorAuth } = ManagerModel.useModel();
  const { authProtocol } = connectorVersionInfo || {};

  const {
    disabled,
    formChange,
    makeFormConfirm,
    createCustomModal,
    formLoading,
  } = useRouteBlock({
    formInstanceListRef: [formRef],
    originData: authProtocol,
    async onConfirm(data) {
      return updateConnectorAuth(data);
    },
    // onOriginDataChange(data) {
    //   formRef.current?.setFieldsValue(data);
    // },
  });

  const reConfirm = (key: string, value: string) => {
    createCustomModal({
      title: "确定切换授权类型？",
      content:
        "切换授权类型将清空当前授权下的所有参数和配置信息，且可能会对已配置的触发事件和执行操作产生影响",
      onOk() {
        formRef.current?.setFieldValue(key, value);
        makeFormConfirm();
      },
      okText: "切换",
      onCancel() {
        formRef.current?.setFieldValue(
          key,
          authProtocol[key as keyof typeof authProtocol]
        );
        formChange();
      },
    });
  };

  const AuthMethodSchema: IpaasFormSchema[] = [
    {
      code: "type",
      name: "授权方式",
      type: "string",
      required: true,
      editor: {
        // @ts-expect-error 自己注入控件
        kind: "AuthType",
        config: {
          onChange(v: string) {
            reConfirm("type", v);
          },
        },
      },
    },
    {
      code: "doc",
      name: "帮助说明文档",
      type: "string",
      editor: {
        kind: "Textarea",
      },
      visibleRules: `type !== 'none'`,
    },
  ];

  return (
    <div>
      <Alert
        message="请在此处配置您的连接器授权方式，用户填写授权信息后，将用户的身份信息授权给 workflow 运行时。"
        type="info"
        showIcon
      />
      <div className="mt-4">
        <CustomIPaasSchemaForm
          ref={formRef}
          initialValues={authProtocol}
          schema={AuthMethodSchema}
          editorMap={_editorMap}
          onValuesChange={formChange}
        />
        <Button
          type="primary"
          loading={formLoading}
          disabled={disabled}
          onClick={makeFormConfirm}
        >
          保存
        </Button>
      </div>
    </div>
  );
}
