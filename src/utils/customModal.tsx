import { IPaasSchemaForm } from "@/components/IPaasSchemaForm";
import { IpaasFormSchema } from "@/components/IPaasSchemaForm/type";
import { FormInstance, ModalFuncProps } from "antd";
import { HookAPI } from "antd/es/modal/useModal";
import { createRef } from "react";

export const ModalRef = {
  current: undefined as unknown as HookAPI,
  modalInsList: [] as { destroy: () => void }[],
};

export function createModal(config: ModalFuncProps) {
  // 路由拦截，不让跳转
  const ins = ModalRef.current.confirm({
    ...config,
  });
  ModalRef.modalInsList.push(ins);
  return ins;
}

export const createSchemaFormModal = function <
  T extends Record<string, any>
>(config: {
  title: string;
  schema: IpaasFormSchema[];
  onFinished: (values: T) => Promise<any>;
  schemaFormProps?: Partial<Parameters<typeof IPaasSchemaForm>[0]>;
}) {
  const formRef = createRef<FormInstance>();
  const ins = ModalRef.current.confirm({
    title: config.title,
    closable: true,
    icon: null,
    width: 704,
    content: (
      <div className="mt-3">
        <IPaasSchemaForm
          layout="vertical"
          ref={formRef}
          schema={config.schema}
        ></IPaasSchemaForm>
      </div>
    ),
    onOk: () => {
      return new Promise((resolve, reject) => {
        formRef.current?.validateFields().then(async (v) => {
          resolve(await config.onFinished(v as T).catch(reject));
        }, reject);
      });
    },
  });
  ModalRef.modalInsList.push(ins);
  return ins;
};
