import { Alert } from "antd";
import { ConnectorPreviewModel } from "./context";

export default function PreviewAuth() {
  const {
    ConnectorPreviewData: { authprotocel },
  } = ConnectorPreviewModel.useModel();

  if (authprotocel.type === "none") {
    return <Alert message="无授权不需要配置" type="info" />;
  }

  return 11;
}
