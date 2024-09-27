import { request } from "@/api/request";
import { createCustomModel } from "@/common/createModel";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export const ManagerModel = createCustomModel(() => {
  const { code } = useParams<{ code: string }>();

  const { refetch, data, isFetching } = useQuery({
    queryKey: ["queryConnectorInfo", code],
    queryFn: async () => {
      return request<{
        id: number; // 连接器版本id
        code: string;
        logo: string;
        name: string;
        documentlink?: string;
        description: string;
      }>({
        url: "/ipaas/connector/" + code,
        method: "GET",
      });
    },
  });

  const { mutateAsync: updateConnector } = useMutation({
    mutationKey: ["updateConnectorInfo"],
    mutationFn: (updateData: any) => {
      return request({
        url: "/ipaas/connector/" + data?.id,
        method: "patch",
        data: updateData,
      }).then(refetch);
    },
  });

  return {
    queryConnector: refetch,
    connectorVersionInfo: data,
    connectorCode: code,
    connectorId: data?.id,
    isQueryConnectorLoading: isFetching,
    updateConnector,
  };
});
