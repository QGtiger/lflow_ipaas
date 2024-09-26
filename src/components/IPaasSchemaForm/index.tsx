import { Form, FormInstance, FormProps } from "antd";
import { forwardRef, useImperativeHandle } from "react";
import { IpaasFormSchema } from "./type";

import { IPaasSchemaFormStore, type IPaasSchemaFormStoreInfer } from "./store";
import CreateSchemaFormItem from "./RecursionFormItem/CreateSchemaFormItem";
import { useUpdate } from "ahooks";

function FormItemGenerate({ schema }: { schema: IpaasFormSchema[] }) {
  return <CreateSchemaFormItem schema={schema} />;
}

type IPaasSchemaFormProps = {
  schema: IpaasFormSchema[];
} & IPaasSchemaFormStoreInfer &
  FormProps;

export const IPaasSchemaForm = forwardRef<FormInstance, IPaasSchemaFormProps>(
  (props, ref) => {
    const [form] = Form.useForm();
    const { schema } = props;
    const update = useUpdate();

    useImperativeHandle(ref, () => form, [form]);

    return (
      <IPaasSchemaFormStore.Provider value={props}>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          onValuesChange={(c, v) => {
            props.onValuesChange?.(c, v);
            // 子表单change 不会导致父组件更新
            update();
          }}
        >
          <FormItemGenerate schema={schema} />
        </Form>
      </IPaasSchemaFormStore.Provider>
    );
  }
);
