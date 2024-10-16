import { useOutlet } from "react-router-dom";
import { ManagerModel } from "./model";
import { Skeleton } from "antd";
import Menu from "./components/Menu";
import { ConnectorPreviewModel } from "./components/ConnectorPreview/context";

// eslint-disable-next-line react-refresh/only-export-components
function ManagerLayout() {
  const outlet = useOutlet();
  const { isInitLoading } = ManagerModel.useModel();

  if (isInitLoading) {
    return (
      <div className="p-4">
        <Skeleton active />
      </div>
    );
  }

  return (
    <div className=" bg-[#f2f3f5] h-full w-full flex flex-col">
      <Menu />
      <div className="right-content p-[16px] flex-1 overflow-auto">
        {outlet}
      </div>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default () => {
  return (
    <ConnectorPreviewModel.Provider>
      <ManagerModel.Provider>
        <ManagerLayout />
      </ManagerModel.Provider>
    </ConnectorPreviewModel.Provider>
  );
};
