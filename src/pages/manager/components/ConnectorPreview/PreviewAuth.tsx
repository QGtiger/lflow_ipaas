import { Alert, Button, List } from "antd";
import { ConnectorPreviewModel } from "./context";
import Empty from "@/components/Empty";
import classNames from "classnames";
import Badge from "./Badge";

export default function PreviewAuth() {
  const {
    ConnectorPreviewData: { authProtocol, name },
    authList,
    authIndex,
    PreviewModel,
    addAuthRecord,
  } = ConnectorPreviewModel.useModel();

  if (authProtocol.type === "none") {
    return <Alert message="无授权不需要配置" type="info" />;
  }

  return !authList?.length ? (
    <Empty
      desc="暂无授权信息，请配置"
      btnClick={addAuthRecord}
      btnText="添加授权"
    ></Empty>
  ) : (
    <div>
      <List
        dataSource={authList}
        renderItem={(item, index) => {
          const selected = authIndex === index;
          return (
            <div
              onClick={() => {
                PreviewModel.authIndex = index;
              }}
              className={classNames(
                `
             cursor-pointer
             transition-colors duration-150 ease-out hover:bg-[#F6F8FB]
          flex flex-col items-start gap-2 px-4 py-3 relative bg-white rounded-lg overflow-hidden border border-solid border-border mb-2`,
                selected && "border-[#3170FA] !bg-[#EFF4FF]"
              )}
            >
              <div className="relative w-fit  font-normal text-primary-black text-sm tracking-[0] leading-[normal] line-clamp-1">
                {name} #{index + 1}
              </div>
              <div className=" text-sm">
                <p>授权输入</p>
                <div className=" whitespace-break-spaces">
                  {Object.entries(item.inputs).map(([key, value]) => {
                    return `${key}: ${value} \n`;
                  })}
                </div>
              </div>
              <div className=" text-sm">
                <p>授权输出</p>
                <div className=" whitespace-break-spaces">
                  {Object.entries(item.outputs).map(([key, value]) => {
                    return `${key}: ${value}\n`;
                  })}
                </div>
              </div>
              {selected && <Badge />}
            </div>
          );
        }}
      />
      <Button
        type="primary"
        className="mt-1"
        size="large"
        block
        onClick={addAuthRecord}
      >
        添加授权
      </Button>
    </div>
  );
}
