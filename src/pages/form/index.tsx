import CustomIPaasSchemaForm from "@/components/CustomIPaasSchemaForm";
import { FormInstance } from "antd";
import { useRef } from "react";

export default function FormPage() {
  const formRef = useRef<FormInstance>(null);
  return (
    <CustomIPaasSchemaForm
      ref={formRef}
      schema={[
        {
          code: "test",
          name: "test",
          description: "描述",
          type: "string",
          editor: {
            kind: "Input",
            config: {
              defaultValue: "123",
            },
          },
        },
      ]}
    />
  );
}
