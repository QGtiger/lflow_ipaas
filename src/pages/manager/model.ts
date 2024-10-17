import { request } from "@/api/request";
import { createCustomModel } from "@/common/createModel";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ConnectorPreviewModel } from "./components/ConnectorPreview/context";
import { createSchemaFormModal } from "@/utils/customModal";
import { AddActionSchema } from "./[code]/action/schema";
import { generateShortId } from "@/utils";

export const ManagerModel = createCustomModel(() => {
  const { code } = useParams<{ code: string }>();
  const initRef = useRef(false);
  const { setConnectorFinalData } = ConnectorPreviewModel.useModel();
  const nav = useNavigate();

  const { refetch, data, isFetching } = useQuery({
    queryKey: ["queryConnectorInfo", code],
    queryFn: async () => {
      return request<IpaasConnectorVersion>({
        url: "/ipaas/connector/" + code,
        method: "GET",
      }).then((res) => {
        setConnectorFinalData(res);
        return res;
      });
    },
  });

  const { mutateAsync: updateConnector } = useMutation({
    mutationKey: ["updateConnectorInfo"],
    mutationFn: (updateData: Partial<IpaasConnectorVersion>) => {
      return request({
        url: "/ipaas/connector/" + data?.id,
        method: "patch",
        data: updateData,
      }).then(refetch);
    },
  });

  const { mutateAsync: updateConnectorAuth } = useMutation({
    mutationKey: ["updateConnectorAuth"],
    mutationFn: (authData: Partial<IpaasauthProtocol>) => {
      return updateConnector({
        authProtocol: {
          ...data!.authProtocol,
          ...authData,
        },
      });
    },
  });

  const { mutateAsync: addConnectorAction } = useMutation({
    mutationKey: ["addConnectorAction"],
    mutationFn: (actionData: Partial<IpaasAction>) => {
      return updateConnector({
        actions: ([] as any[]).concat(data!.actions || [], actionData),
      });
    },
  });

  const { mutateAsync: updateConnectorActionByList } = useMutation({
    mutationKey: ["updateConnectorActionByList"],
    mutationFn: (actionList: IpaasAction[]) => {
      return updateConnector({
        actions: actionList,
      });
    },
  });

  const addActionWithRedirect = () => {
    createSchemaFormModal({
      title: "新建执行操作",
      schema: AddActionSchema,
      async onFinished(values) {
        const actionCode = (values.code = `action_${generateShortId()}`);
        return addConnectorAction(values as any).then(() => {
          nav(`/manager/${code}/action/${actionCode}`);
        });
      },
    });
  };

  const { mutateAsync: updateConnectorAction } = useMutation({
    mutationKey: ["updateConnectorAction"],
    mutationFn: (actionData: Partial<IpaasAction>) => {
      const actionList = data!.actions!.map((action) => {
        if (action.code === actionData.code) {
          return {
            ...action,
            ...actionData,
          };
        }
        return action;
      });
      return updateConnector({
        actions: actionList,
      });
    },
  });

  if (!isFetching && !initRef.current) {
    initRef.current = true;
  }

  return {
    queryConnector: refetch,
    connectorVersionInfo: data!,
    connectorCode: code,
    connectorId: data?.id,
    isQueryConnectorLoading: isFetching,
    isInitLoading: !initRef.current,
    updateConnector,
    updateConnectorAuth,
    addConnectorAction,
    updateConnectorActionByList,
    updateConnectorAction,
    addActionWithRedirect,
  };
});
