import PageContainer from "@/components/PageContainer";
import { Button, FormInstance } from "antd";
import { useMemo, useRef } from "react";
import { IPaasSchemaForm } from "@/components/IPaasSchemaForm";
import { ManagerModel } from "../../model";
import { editorConnetorSchema } from "@/pages/schema";
import useRouteBlock from "@/hooks/useRouteBlock";

export default function Base() {
  const { connectorVersionInfo, updateConnector } = ManagerModel.useModel();

  const baseInfo = useMemo(() => {
    if (!connectorVersionInfo) return {};
    return {
      logo: connectorVersionInfo.logo,
      name: connectorVersionInfo.name,
      description: connectorVersionInfo.description,
      documentlink: connectorVersionInfo.documentlink,
    };
  }, [connectorVersionInfo]);

  const formRef = useRef<FormInstance>(null);

  const { disabled, formChange, makeFormConfirm } = useRouteBlock({
    formInstanceListRef: [formRef],
    originData: baseInfo,
    onConfirm: updateConnector,
  });

  return (
    <PageContainer title="基本信息">
      <IPaasSchemaForm
        ref={formRef}
        initialValues={baseInfo}
        layout="vertical"
        schema={editorConnetorSchema}
        onValuesChange={formChange}
      ></IPaasSchemaForm>
      <Button type="primary" onClick={makeFormConfirm} disabled={disabled}>
        保存
      </Button>
    </PageContainer>
  );
}
