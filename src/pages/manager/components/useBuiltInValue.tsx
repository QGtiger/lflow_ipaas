import { useMemo } from "react";
import { ManagerModel } from "../model";

export type CustomTreeData = {
  title: string;
  key: string;
  leaf?: boolean;
  children?: CustomTreeData[];
};

export default function useBuiltInValue() {
  // react-router-dom 只能有一个上下文
  const pathname = location.pathname;
  const { connectorVersionInfo } = ManagerModel.useModel();

  return useMemo(() => {
    let inputs: IpaasFormSchema[] | undefined;
    // 是否是授权页面
    let isAuth: boolean = false; // 授权
    const {
      inputs: authInputs,
      type: authType,
      outputs: authOutputs,
    } = connectorVersionInfo.authprotocel;
    const isNoAuth = authType === "none";

    if (pathname.includes("auth")) {
      inputs = authInputs;
      isAuth = true;
    } else if (pathname.includes("action")) {
      const actionCode = pathname.split("/").pop();
      inputs = connectorVersionInfo.actions?.find(
        (it) => it.code === actionCode
      )?.inputs;
    }

    const authPropertyItem: CustomTreeData = {
      title: "授权配置",
      key: "property.auth",
      children: [] as any[],
    };

    const propertyItem = {
      title: "连接器属性",
      key: "property",
      children: [] as any[],
    };

    if (!isAuth && !isNoAuth) {
      propertyItem.children.push(authPropertyItem);
      authPropertyItem.children?.push({
        title: "授权输入参数",
        key: "property.auth.inputs",
        children: connectorVersionInfo.authprotocel.inputs?.map((it) => {
          return {
            title: it.name,
            key: `property.auth.inputs.${it.code}`,
            leaf: true,
          };
        }),
      });

      if (authOutputs) {
        function convert(
          o: OutputStrcut[],
          parentKey: string = ""
        ): CustomTreeData[] {
          return o.map((it) => {
            const pk = parentKey ? `${parentKey}.${it.name}` : it.name;

            return {
              title: it.label,
              key: pk,
              leaf: !it.children?.length,
              children:
                it.type === "array" ? [] : convert(it.children || [], pk),
            };
          });
        }
        authPropertyItem.children?.push({
          title: "授权输出参数",
          key: "property.auth.outputs",
          children: convert(authOutputs, "property.auth.outputs"),
        });
      }
    }

    const data = [
      {
        title: "输入参数",
        key: "params",
        children: inputs?.map((it) => {
          return {
            title: it.name,
            key: `params.${it.code}`,
            leaf: true,
          };
        }),
      },
    ] as CustomTreeData[];

    data?.push(propertyItem);

    return data;
  }, [pathname, connectorVersionInfo]);
}
