import PageContainer from "@/components/PageContainer";
import useAction from "./useAction";
import { Tabs, TabsProps } from "antd";
import BaseActionInfo from "./BaseActionInfo";
import useRouter from "@/hooks/useRouter";
import ViewMetaInputs from "@/components/ViewMetaInputs";
import { ManagerModel } from "@/pages/manager/model";
import ExcuteConfig from "@/components/ExcuteConfig";
import ConnectorPreview from "@/pages/manager/components/ConnectorPreview";

const RouterQueryTabKey = "tabKey";

export default function ActionCode() {
  const actionData = useAction();
  const { navBySearchParam, searchParamsObj } = useRouter<{
    [RouterQueryTabKey]: string;
  }>();
  const { updateConnectorAction } = ManagerModel.useModel();

  const tabsList: TabsProps["items"] = [
    {
      label: "授权方式",
      key: "base",
      children: <BaseActionInfo />,
    },
    {
      label: "输入参数",
      key: "inputs",
      children: (
        <ViewMetaInputs
          viewMetaInputs={actionData.inputs || []}
          onSave={(e) => {
            return updateConnectorAction({
              code: actionData.code,
              inputs: e,
            });
          }}
        />
      ),
    },
    {
      label: "执行配置",
      key: "config",
      children: (
        <ExcuteConfig
          excuteProtocol={actionData.excuteProtocol}
          outputs={actionData.outputs}
          onConfirm={(data) => {
            return updateConnectorAction({
              code: actionData.code,
              ...data,
            });
          }}
        />
      ),
    },
  ];

  return (
    <PageContainer
      title={`执行操作(${actionData?.name})`}
      extra={<ConnectorPreview />}
    >
      <div className="mt-[-10px]">
        <Tabs
          destroyInactiveTabPane={true}
          activeKey={searchParamsObj[RouterQueryTabKey] || "base"}
          items={tabsList}
          onChange={(key) => {
            navBySearchParam(RouterQueryTabKey, key, {
              delOther: true,
            });
          }}
        />
      </div>
    </PageContainer>
  );
}
