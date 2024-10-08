/* eslint-disable @typescript-eslint/no-unused-vars */
import { Form } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { IPaasSchemaFormStore } from "../../store";
import { useBoolean, useDebounceFn } from "ahooks";
import { IPaasCommonFormFieldProps } from "../../type";
import CreateSchemaFormItem from "../../RecursionFormItem/CreateSchemaFormItem";
import { FormContext } from "antd/es/form/context";
import { getValueFormObjectByExpression } from "../../utils";

export default function DaynamicForm(
  props: IPaasCommonFormFieldProps<Record<string, any>> &
    EditotKindConfigMapping["DynamicForm"]
) {
  const { depItems, dynamicScript, name, isDynamic, staticSubFields } = props;
  const { dynamicScriptExcuteWithFormSchema } = IPaasSchemaFormStore.useModel();
  const [_, loadingAction] = useBoolean(false);
  const [subSchema, setSubSchema] = useState<IpaasFormSchema[]>(
    staticSubFields || []
  );
  const { form } = useContext(FormContext);
  const formValue = form!.getFieldsValue();
  const previousValue = useRef<any>();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    staticSubFields && setSubSchema(staticSubFields);
  }, [staticSubFields]);

  const { run } = useDebounceFn(
    () => {
      if (!isDynamic) return;
      if (!dynamicScriptExcuteWithFormSchema) {
        return console.error(
          "dynamicScriptExcuteWithFormSchema is not defined"
        );
      }
      loadingAction.setTrue();
      // 清空当前
      dynamicScriptExcuteWithFormSchema({
        script: dynamicScript || "",
      })
        .then((list) => {
          if (!Array.isArray(list)) {
            return console.error(
              "dynamicScriptExcuteWithFormSchema return value is not an array"
            );
          }
          const _schema = list.map((it) => {
            // 添加默认值
            if (!it.editor) {
              it.editor = {
                kind: "Input",
                config: {},
              };
            }
            return {
              ...it,
              // code: Array.prototype.concat.call([], name, it.code),
            };
          });
          setSubSchema(_schema);
        })
        .finally(() => {
          loadingAction.setFalse();
        });
    },
    {
      wait: 100,
      trailing: true,
    }
  );

  useEffect(() => {
    if (!previousValue.current) {
      run();
    } else {
      if (!depItems) {
        return;
      }
      const prevValues = previousValue.current;
      const isUpdate = depItems.some((depItem) => {
        return (
          getValueFormObjectByExpression(prevValues, depItem) !==
          getValueFormObjectByExpression(formValue, depItem)
        );
      });
      if (isUpdate) {
        run();
      }
    }
    previousValue.current = formValue;
  });

  return (
    <div className="p-3 bg-white">
      {subSchema.length ? (
        <CreateSchemaFormItem schema={subSchema} />
      ) : (
        <div>暂无配置</div>
      )}
    </div>
  );
}
