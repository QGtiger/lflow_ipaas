import { useUnmount } from "ahooks";
import { ConnectorPreviewModel } from "./context";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Popover, Tabs, TabsProps } from "antd";
import GithubMarkdown from "@/components/GithubMarkdown";
import PreviewActionList from "./PreviewActionList";
import PreviewAuth from "./PreviewAuth";

import "./index.css";

export default function ConnectorPreview() {
  const { ConnectorPreviewData, disposePreview, flowNodeData } =
    ConnectorPreviewModel.useModel();

  // const pathname = location.pathname;
  const defaultActiveKey = "base";

  useUnmount(disposePreview);

  const tabsItem: TabsProps["items"] = [
    {
      key: "base",
      label: "操作",
      children: <PreviewActionList />,
    },
    {
      key: "auth",
      label: "授权",
      disabled: !flowNodeData.actionCode,
      children: <PreviewAuth />,
    },
    {
      key: "action",
      label: "配置",
      disabled: !flowNodeData.actionCode,
    },
  ];

  return (
    <div className="connector-preview w-[480px] border-l h-full p-4 flex flex-col">
      <div className="t">预览</div>
      <div className="card mt-4 shadow-lg p-4 rounded-md h-1 flex-1">
        <div className="flex items-start gap-1 h-15 pb-3 border-b">
          <div className="flex justify-center items-center w-12 flex-shrink-0 flex-grow-0">
            <img src={ConnectorPreviewData?.logo} alt="" />
          </div>
          <div className="flex flex-col justify-around h-full w-1 flex-1">
            <div className="flex">
              <div className="line-clamp-1 break-words w-1 flex-1">
                {ConnectorPreviewData?.name || "请输入连接器名称"}
              </div>
              <div className="ml-2">
                <Popover
                  content={
                    <GithubMarkdown className="text-xs">
                      {ConnectorPreviewData.description}
                    </GithubMarkdown>
                  }
                  placement="bottomRight"
                >
                  <QuestionCircleOutlined
                    style={{
                      color: "#888F9D",
                    }}
                    className=" cursor-pointer"
                  />
                </Popover>
              </div>
            </div>
            <div className="desc text-[#888f9d] text-xs line-clamp-1 break-words">
              {ConnectorPreviewData?.description}
            </div>
          </div>
        </div>

        <div className="tabs mt-2">
          <Tabs defaultActiveKey={defaultActiveKey} items={tabsItem} />
        </div>
      </div>
    </div>
  );
}
