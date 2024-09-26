import { IPaasSchemaForm } from "@/components/IPaasSchemaForm";
import { FormInstance } from "antd";
import { useRef } from "react";

export default function FormPage() {
  const formRef = useRef<FormInstance>(null);
  return (
    <IPaasSchemaForm
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
