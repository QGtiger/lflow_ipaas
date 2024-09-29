import { useOutlet } from "react-router-dom";
import { ManagerModel } from "./model";
import { Skeleton } from "antd";
import Menu from "./components/Menu";

// eslint-disable-next-line react-refresh/only-export-components
function ManagerLayout() {
  const outlet = useOutlet();
  const { isInitLoading } = ManagerModel.useModel();

  if (isInitLoading) {
    return <Skeleton active />;
  }

  return (
    <div className=" bg-[#f2f3f5] h-full w-full flex flex-col">
      <Menu />
      <div className="right-content p-[16px] flex-1">{outlet}</div>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default () => {
  return (
    <ManagerModel.Provider>
      <ManagerLayout />
    </ManagerModel.Provider>
  );
};
