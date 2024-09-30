/* eslint-disable @typescript-eslint/no-unused-vars */
import { Form, Select, SelectProps } from "antd";
import { useContext, useEffect, useState } from "react";
import { IPaasSchemaFormStore } from "../../store";
import { useBoolean, useDebounceFn } from "ahooks";
import useEditor from "../../hooks/useEditor";
import { IPaasCommonFormFieldProps } from "../../type";
import { FormContext } from "antd/es/form/context";

export default function CustomSelect(
  props: IPaasCommonFormFieldProps &
    EditotKindConfigMapping["Select"] &
    SelectProps
) {
  const {
    depItems = [],
    name,
    isDynamic,
    dynamicScript,
    schemaInfo,
    defaultValue,
    options,
    ...rest
  } = props;
  const { form } = useContext(FormContext);
  const { dynamicScriptExcuteWithOptions } = IPaasSchemaFormStore.useModel();
  const [selectOptions, setSelectOptions] = useState<SelectProps["options"]>(
    options || []
  );
  const [loading, loadingAction] = useBoolean(false);
  const SelectComp = useEditor("InnerSelect", Select);

  const { run, cancel } = useDebounceFn(
    (extParams: Record<string, any> = { [name]: "" }) => {
      if (!isDynamic) return;
      if (!dynamicScriptExcuteWithOptions) {
        return console.error("dynamicScriptExcuteWithOptions is not defined");
      }
      loadingAction.setTrue();
      // 清空当前
      dynamicScriptExcuteWithOptions({
        script: dynamicScript,
        extParams,
      })
        .then((list) => {
          if (!Array.isArray(list)) {
            return console.error(
              "dynamicScriptExcuteWithOptions return value is not an array"
            );
          }
          // 如果数据不存在当前值，则清空当前值
          if (!list.some((item) => item.value === props.value)) {
            // FIXME 这里有一个问题，多层嵌套问题
            form!.setFieldValue(props.name, undefined);
          }
          setSelectOptions(list);
        })
        .finally(() => {
          loadingAction.setFalse();
        });
    },
    {
      wait: 100,
    }
  );

  useEffect(() => {
    run();
  }, []);

  return (
    <Form.Item
      shouldUpdate={(prevValues: any, currentValues: any) => {
        if (!isDynamic) return false;
        if (!depItems) {
          return false;
        }
        const isUpdate = depItems.some((depItem) => {
          return prevValues[depItem] !== currentValues[depItem];
        });
        if (isUpdate) {
          cancel();
          run();
        }
        return isUpdate;
      }}
      noStyle
    >
      {() => {
        return (
          <SelectComp
            options={selectOptions}
            loading={loading}
            filterOption={false}
            allowClear
            onClear={() => {
              run();
            }}
            onSearch={(k: string) => {
              run({
                [name]: k,
              });
            }}
            name={name}
            {...rest}
            showSearch
          />
        );
      }}
    </Form.Item>
  );
}
