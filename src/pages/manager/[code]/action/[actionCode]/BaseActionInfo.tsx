import useRouteBlock from "@/hooks/useRouteBlock";
import { Button, FormInstance } from "antd";
import { useRef } from "react";
import useAction from "./useAction";
import { ManagerModel } from "@/pages/manager/model";
import { AddActionSchema } from "../schema";
import CustomIPaasSchemaForm from "@/components/CustomIPaasSchemaForm";

export default function BaseActionInfo() {
  const formRef = useRef<FormInstance>(null);
  const actionDetail = useAction();
  const { updateConnectorAction } = ManagerModel.useModel();

  const { disabled, formChange, makeFormConfirm, formLoading } = useRouteBlock({
    formInstanceListRef: [formRef],
    originData: actionDetail,
    onConfirm(data) {
      return updateConnectorAction({
        code: actionDetail.code,
        ...data,
      });
    },
    onOriginDataChange(data) {
      formRef.current?.setFieldsValue(data);
    },
  });

  return (
    <div>
      <CustomIPaasSchemaForm
        onValuesChange={formChange}
        ref={formRef}
        initialValues={actionDetail}
        schema={AddActionSchema}
      ></CustomIPaasSchemaForm>
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
