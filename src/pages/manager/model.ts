import { request } from "@/api/request";
import { createCustomModel } from "@/common/createModel";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useParams } from "react-router-dom";

export const ManagerModel = createCustomModel(() => {
  const { code } = useParams<{ code: string }>();
  const initRef = useRef(false);

  const { refetch, data, isFetching } = useQuery({
    queryKey: ["queryConnectorInfo", code],
    queryFn: async () => {
      return request<IpaasConnectorVersion>({
        url: "/ipaas/connector/" + code,
        method: "GET",
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
    mutationFn: (authData: Partial<IpaasAuthProtocel>) => {
      return updateConnector({
        authprotocel: {
          ...data!.authprotocel,
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
  };
});
