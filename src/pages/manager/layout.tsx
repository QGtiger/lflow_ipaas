import { useOutlet } from "react-router-dom";
import { ManagerModel } from "./model";
import { Skeleton } from "antd";

// eslint-disable-next-line react-refresh/only-export-components
function ManagerLayout() {
  const outlet = useOutlet();
  const { isQueryConnectorLoading } = ManagerModel.useModel();

  if (isQueryConnectorLoading) {
    return <Skeleton active />;
  }

  return <div>{outlet}</div>;
}

// eslint-disable-next-line react-refresh/only-export-components
export default () => {
  return (
    <ManagerModel.Provider>
      <ManagerLayout />
    </ManagerModel.Provider>
  );
};
