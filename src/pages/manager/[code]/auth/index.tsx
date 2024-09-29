import PageContainer from "@/components/PageContainer";
import useRouter from "@/hooks/useRouter";
import { Tabs, TabsProps } from "antd";

const RouterQueryTabKey = "tabKey";

export default function AuthPage() {
  const { navBySearchParam, searchParamsObj } = useRouter<{
    [RouterQueryTabKey]: string;
  }>();

  const tabsList: TabsProps["items"] = [
    {
      label: "授权方式",
      key: "base",
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
