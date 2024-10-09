import { ManagerModel } from "@/pages/manager/model";
import { useParams } from "react-router-dom";

export default function useAction() {
  const {
    connectorVersionInfo: { actions },
  } = ManagerModel.useModel();
  const actionCode = useParams().actionCode;

  return actions.find((action) => action.code === actionCode)!;
}
