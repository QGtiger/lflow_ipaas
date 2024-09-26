import { IPaasSchemaFormStore } from "../store";

export default function useEditor(
  type: string,
  defaultComponent?: (...props: any[]) => React.ReactNode
) {
  const { editorMap } = IPaasSchemaFormStore.useModel();

  //@ts-expect-error 类型推导错误
  return editorMap[type] || defaultComponent || editorMap["Input"];
}
