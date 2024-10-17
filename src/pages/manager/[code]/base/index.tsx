import PageContainer from "@/components/PageContainer";
import { Button, FormInstance } from "antd";
import { useMemo, useRef } from "react";
import { ManagerModel } from "../../model";
import { editorConnetorSchema } from "@/pages/schema";
import useRouteBlock from "@/hooks/useRouteBlock";
import CustomIPaasSchemaForm from "@/components/CustomIPaasSchemaForm";
import ConnectorPreview from "../../components/ConnectorPreview";
import { ConnectorPreviewModel } from "../../components/ConnectorPreview/context";

export default function Base() {
  const { connectorVersionInfo, updateConnector } = ManagerModel.useModel();
  const { setConnectorDraftData } = ConnectorPreviewModel.useModel();

  const baseInfo = useMemo(() => {
    if (!connectorVersionInfo) return {};
    return {
      logo: connectorVersionInfo.logo,
      name: connectorVersionInfo.name,
      description: connectorVersionInfo.description,
      documentLink: connectorVersionInfo.documentLink,
    };
  }, [connectorVersionInfo]);

  const formRef = useRef<FormInstance>(null);

  const { disabled, formChange, makeFormConfirm, formLoading } = useRouteBlock({
    formInstanceListRef: [formRef],
    originData: baseInfo,
    onConfirm: updateConnector,
    onValuesChange: (changedValues, allValues) => {
      setConnectorDraftData(allValues);
    },
  });

  return (
    <PageContainer title="基本信息" extra={<ConnectorPreview />}>
      <CustomIPaasSchemaForm
        ref={formRef}
        initialValues={baseInfo}
        layout="vertical"
        schema={editorConnetorSchema}
        onValuesChange={formChange}
      ></CustomIPaasSchemaForm>
      <Button
        loading={formLoading}
        type="primary"
        onClick={makeFormConfirm}
        disabled={disabled}
      >
        保存
      </Button>
    </PageContainer>
  );
}
