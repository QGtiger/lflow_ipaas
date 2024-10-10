import { Form, Select } from "antd";
import VarEditor from "@/pages/manager/components/VarEditor";

const OptionsMap: Record<HttpMethodEnum, string> = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
};

const Options = Object.entries(OptionsMap).map(([value, label]) => ({
  value,
  label,
}));

export default function MethodUrl() {
  const InputComponent = VarEditor;
  return (
    <div className="flex gap-2 items-center">
      <Form.Item name="method" noStyle>
        <Select className="!w-[120px]" placeholder="请选择" options={Options} />
      </Form.Item>
      <Form.Item
        name="url"
        noStyle
        rules={[
          {
            validator(rule, value, callback) {
              if (!value) {
                callback("接口地址不能为空");
              } else {
                callback();
              }
            },
          },
        ]}
      >
        <InputComponent placeholder="请输入接口地址 变量使用 {{$.property.auth.}}" />
      </Form.Item>
    </div>
  );
}
