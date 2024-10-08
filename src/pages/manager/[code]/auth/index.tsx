import PageContainer from "@/components/PageContainer";
import useRouter from "@/hooks/useRouter";
import { Tabs, TabsProps } from "antd";
import AuthMethod from "./AuthMethod";
import ViewMetaInputs from "@/components/ViewMetaInputs";
import { ManagerModel } from "../../model";
import ExcuteConfig from "@/pages/manager/components/ExcuteConfig";

const RouterQueryTabKey = "tabKey";

export default function AuthPage() {
  const {
    connectorVersionInfo: { authprotocel },
    updateConnectorAuth,
  } = ManagerModel.useModel();
  const { navBySearchParam, searchParamsObj } = useRouter<{
    [RouterQueryTabKey]: string;
  }>();

  const tabsList: TabsProps["items"] = [
    {
      label: "授权方式",
      key: "base",
      children: <AuthMethod />,
    },
    {
      label: "输入参数",
      key: "inputs",
      children: (
        <ViewMetaInputs
          viewMetaInputs={authprotocel.inputs}
          onSave={(e) => {
            return updateConnectorAuth({
              inputs: e,
            });
          }}
        />
      ),
      disabled: !authprotocel.type || authprotocel.type === "none",
    },
    {
      label: "授权配置",
      key: "config",
      children: <ExcuteConfig />,
      disabled: authprotocel.type !== "session_auth",
    },
  ];

  return (
    <PageContainer title={`授权配置`}>
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
