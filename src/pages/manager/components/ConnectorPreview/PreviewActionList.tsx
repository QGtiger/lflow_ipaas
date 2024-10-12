import { List } from "antd";
import { ManagerModel } from "../../model";
import { ConnectorPreviewModel } from "./context";
import Empty from "@/components/Empty";
import classNames from "classnames";

const Badge = () => {
  return (
    <div className="ipaas-badge">
      <span className="selected-icon">
        <svg
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          data-icon="ListCheckBoldOutlined"
        >
          <path
            d="M4 11.293a1 1 0 0 1 1.414 0l4.072 4.07 9.07-9.07a1 1 0 0 1 1.415 0l.706.707a1 1 0 0 1 0 1.414L10.193 18.9a1 1 0 0 1-1.415 0l-5.485-5.485a1 1 0 0 1 0-1.414L4 11.293Z"
            fill="currentColor"
          ></path>
        </svg>
      </span>
    </div>
  );
};

export default function PreviewActionList() {
  const {
    ConnectorPreviewData: { actions },
    flowNodeData,
    setFlowCode,
  } = ConnectorPreviewModel.useModel();
  const { addActionWithRedirect } = ManagerModel.useModel();

  return !actions?.length ? (
    <Empty
      desc="暂无执行操作，一个连接器需要至少一个执行操作"
      btnClick={addActionWithRedirect}
      btnText="新建执行操作"
    ></Empty>
  ) : (
    <List
      dataSource={actions}
      renderItem={(item) => {
        const selected = item.code === flowNodeData.actionCode;
        return (
          <div
            onClick={() => {
              setFlowCode({
                actionCode: item.code,
              });
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
              {item.name}
            </div>
            <div className="relative self-stretch  font-normal text-gray-500 text-xs tracking-[0] leading-[normal] line-clamp-2">
              {item.description}
            </div>
            {selected && <Badge />}
          </div>
        );
      }}
    />
  );
}
