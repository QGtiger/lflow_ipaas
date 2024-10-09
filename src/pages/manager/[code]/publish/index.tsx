import { request } from "@/api/request";
import PageContainer from "@/components/PageContainer";
import { useQuery } from "@tanstack/react-query";
import { ManagerModel } from "../../model";
import { Button, Table, TableProps } from "antd";
import { createSchemaFormModal } from "@/utils/customModal";

const columns: TableProps<any>["columns"] = [
  {
    title: "发布时间",
    dataIndex: "pub_time",
    key: "publishTime",
    width: 300,
    ellipsis: true,
    render(t) {
      return new Date(t).toLocaleString();
    },
  },
  {
    title: "发布版本",
    dataIndex: "version",
  },
  {
    title: "发布说明",
    dataIndex: "pub_note",
    ellipsis: true,
  },
];

const publishConnectorSchema: IpaasFormSchema[] = [
  {
    code: "note",
    name: "发布说明",
    type: "string",
    required: true,
    editor: {
      kind: "Textarea",
    },
  },
];

export default function PublishPage() {
  const { connectorId } = ManagerModel.useModel();
  const { data, refetch } = useQuery({
    queryKey: ["publishList"],
    async queryFn() {
      return request({
        url: `/ipaas/connector/${connectorId}/publish`,
        method: "GET",
      });
    },
  });

  console.log(data);

  const publish = () => {
    createSchemaFormModal({
      title: "发布",
      schema: publishConnectorSchema,
      onFinished(values) {
        return request({
          url: `/ipaas/connector/${connectorId}/publish`,
          method: "POST",
          data: values,
        }).then(refetch);
      },
    });
  };

  return (
    <PageContainer
      title={`发布`}
      containerMenu={
        <div>
          <Button type="primary" onClick={publish}>
            发布
          </Button>
        </div>
      }
    >
      <Table
        pagination={false}
        dataSource={data}
        rowKey={"version"}
        columns={columns}
      />
    </PageContainer>
  );
}
