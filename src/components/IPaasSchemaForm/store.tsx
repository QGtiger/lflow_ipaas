import { useMemo } from "react";
import { createCustomModel } from "./common/createModel";
import { Input, InputNumber, Switch } from "antd";
import useDefaultValue from "./hooks/useDefaultValue";
import Upload from "./components/Upload";
import CustomSelect from "./components/CustomSelect";
import DynamicForm from "./components/DynamicForm";
import MultiSelect from "./components/MultiSelect";

export interface IPaasSchemaFormStoreInfer {
  editorMap?: Record<string, (props: any) => React.ReactNode>;
  editorLayoutWithDesc?: (
    editor: React.ReactNode,
    desc: React.ReactNode
  ) => React.ReactNode;
  dynamicScriptExcuteWithOptions?: (config: {
    script: string;
    extParams: Record<string, any>;
  }) => Promise<{ value: any; label: any }[]>;
  dynamicScriptExcuteWithFormSchema?: (config: {
    script: string;
  }) => Promise<IpaasFormSchema[]>;
}

function ExcludeEditorSchemaPropsByComponent(
  Component: (props: any) => React.ReactNode
) {
  return function (props: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { schemaInfo, ...otherProps } = props;
    // eslint-disable-next-line react-hooks/rules-of-hooks -- 更新defaultValue
    useDefaultValue(props);
    return <Component {...otherProps} />;
  };
}

export const IPaasSchemaFormStore = createCustomModel(
  (props: IPaasSchemaFormStoreInfer) => {
    return useMemo(() => {
      const editorMap: Record<
        ExtractEditorKinds,
        (props: any) => React.ReactNode
      > = {
        Input: ExcludeEditorSchemaPropsByComponent(Input),
        InputNumber: ExcludeEditorSchemaPropsByComponent(InputNumber),
        Textarea: ExcludeEditorSchemaPropsByComponent(Input.TextArea),
        Upload,
        PlainText: () => <div>PlainText</div>,
        InputWithCopy: () => <div>InputWithCopy</div>,
        Select: CustomSelect,
        Switch: ExcludeEditorSchemaPropsByComponent(Switch),
        DateTimePicker: () => <div>DateTimePicker</div>,
        DatePicker: () => <div>DatePicker</div>,
        TimePicker: () => <div>TimePicker</div>,
        MultiSelect,
        MultiList: () => <div>MultiList</div>,
        DynamicForm,
        ...props.editorMap,
      };
      return {
        ...props,
        editorMap,
      };
    }, [props.editorMap]);
  }
);
