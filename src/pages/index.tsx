import Empty from "@/components/Empty";
import { IpaasFormSchema } from "@/components/IPaasSchemaForm/type";
import PageContainer from "@/components/PageContainer";
// import { editorConnetorSchema } from '@/constant/schema';
import { createModal, createSchemaFormModal } from "@/utils/customModal";
import {
  ExclamationCircleFilled,
  MoreOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useReactive, useThrottleFn } from "ahooks";
import { Button, Dropdown, Pagination, Spin } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const editorConnetorSchema: IpaasFormSchema[] = [
  {
    code: "logo",
    name: "连接器图标",
    type: "string",
    required: true,
    editor: {
      kind: "Upload",
      config: {},
    },
  },
  {
    code: "name",
    name: "连接器名称",
    type: "string",
    description: "名称可以由数字、英文、下划线组成，最长 30个字符",
    required: true,
    validateRules: `function main(value) {
    if (!value) {
        return "请输入名称";
      } else if (value.length > 30) {
        return "最多输入30个字符";
      }
    }`,
    editor: {
      kind: "Input",
    },
  },
  {
    code: "description",
    name: "描述",
    type: "string",
    description: "名称可以由数字、英文、下划线组成，最长 150个字符",
    required: true,
    editor: {
      kind: "Textarea",
      config: {},
    },
  },
  {
    code: "documentLink",
    name: "帮助文档",
    type: "string",
    description: "请输入文档地址链接",
    editor: {
      kind: "Input",
    },
  },
];

async function addConnector() {}

async function deleteConnector(opt: any) {
  console.log(opt);
}

async function queryConnectorList(params: any): Promise<{
  list: any[];
  page: any;
}> {
  console.log(params);
  return {
    list: [],
    page: {},
  };
}

function isPublished(p: any) {
  console.log(p);
  // TODO: 未实现
  return false;
}

export default function Overview() {
  const queryParams = useReactive({
    page: 1,
    size: 10,
  });
  const viewModel = useReactive({
    total: 1,
  });
  const nav = useNavigate();

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["customConnectors", queryParams],
    queryFn: () => {
      return queryConnectorList(queryParams);
    },
  });

  useEffect(() => {
    if (data) {
      viewModel.total = data.page.total;
      // 没有数据的话，就请求最后一页数据
      if (!data.list?.length && data.page.pages > 0) {
        queryParams.page = data.page.pages;
      }
    }
  }, [data]);

  const { mutateAsync: deleteConnectorMutateAsync } = useMutation({
    mutationKey: ["deleteConnector"],
    mutationFn: deleteConnector,
  });

  const { mutateAsync: addConnectorMutateAsync } = useMutation({
    mutationKey: ["addConnector"],
    mutationFn: addConnector,
    onSuccess() {
      refetch();
    },
  });

  const { run: onAddConnector } = useThrottleFn(
    () => {
      createSchemaFormModal({
        title: "新建连接器",
        schema: editorConnetorSchema,
        async onFinished(values) {
          console.log(values);
          return addConnectorMutateAsync();
        },
      });
      // createMessage({
      //   type: "info",
      //   content: "新建连接器",
      // });
      // request({
      //   url: "/ipaas/connector",
      //   method: "post",
      // });
      // addConnectorMutateAsync();
    },
    {
      wait: 1000,
      trailing: false,
    }
  );

  return (
    <PageContainer
      title="自定义连接器"
      containerMenu={
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddConnector}>
          新建连接器
        </Button>
      }
    >
      {viewModel.total > 0 ? (
        <div className="flex flex-col gap-5 justify-between h-full">
          <div className="content flex-1 h-2 overflow-auto">
            <div className="grid grid-cols-4 gap-x-[16px] gap-y-[24px]">
              <div
                onClick={onAddConnector}
                className="flex shadow hover:shadow-lg cursor-pointer flex-col h-[143px] items-start gap-6 p-4 relative bg-white rounded-lg overflow-hidden border border-solid border-border"
              >
                <div className="flex flex-col items-center justify-center gap-2 relative flex-1 self-stretch w-full grow text-[#3170FA]">
                  <PlusOutlined className="text-[28px]" />
                  <div className="relative w-fit [font-family:'PingFang_SC-Regular',Helvetica] font-normal text-gj-0v-vz text-xs tracking-[0] leading-[normal]">
                    新建连接器
                  </div>
                </div>
              </div>
              {data?.list.map((item) => {
                return (
                  <div
                    key={item.code}
                    className={`h-[143px] flex shadow hover:shadow-lg cursor-pointer flex-col items-start justify-between gap-6 p-4 relative bg-white rounded-lg overflow-hidden border border-solid border-border`}
                    onClick={() => {
                      nav(`/manager/${item.code}/base`);
                    }}
                  >
                    <div className="flex items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
                      <img
                        className="relative w-10 h-10 p-1"
                        alt="logo"
                        src={item.logo}
                      />
                      <div className="flex flex-col items-start justify-center gap-[13px] relative flex-1 self-stretch grow w-1">
                        <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
                          <div className="w-fit text-ellipsis-1 text-primary-black text-sm relative ">
                            {item.name}
                          </div>
                          <div onClick={(e) => e.stopPropagation()}>
                            <Dropdown
                              menu={{
                                items: [
                                  {
                                    key: "delete",
                                    label: "删除连接器",
                                    disabled: isPublished(item.status),
                                    onClick: () => {
                                      createModal({
                                        title: `确认删除连接器: ${item.name}?`,
                                        content: "删除后不可恢复",
                                        icon: <ExclamationCircleFilled />,
                                        onOk: async () => {
                                          await deleteConnectorMutateAsync({
                                            code: item.code,
                                          });
                                          refetch();
                                        },
                                      });
                                    },
                                  },
                                ],
                              }}
                            >
                              <MoreOutlined className=" hover:bg-[#e4ebfd] rounded p-1" />
                            </Dropdown>
                          </div>
                        </div>
                        <div className="text-ellipsis-2 text-secondary-grey text-xs relative ">
                          {item.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start justify-between relative self-stretch w-full flex-[0_0_auto]">
                      <div className="flex items-start gap-1 relative flex-1 grow  text-secondary-grey">
                        <UserOutlined />
                        <div className="flex-1 text-secondary-grey text-xs relative font-normal tracking-[0] leading-[normal]">
                          {item.creatorName}
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
                        {isPublished(item.status) && (
                          <>
                            <div className="inline-flex items-start gap-1 relative flex-[0_0_auto]">
                              <div className="inline-flex items-center justify-center gap-2.5 pt-px pb-0.5 px-2.5 relative flex-[0_0_auto] mt-[-1.00px] mb-[-1.00px] ml-[-1.00px] mr-[-1.00px] bg-[#eefdfb] rounded-[10px] overflow-hidden">
                                <div className="w-fit  text-[#18a99e] text-xs relative font-normal tracking-[0] leading-[normal]">
                                  已发布
                                </div>
                              </div>
                            </div>
                            <div className="inline-flex items-start gap-1 relative flex-[0_0_auto]">
                              <div className="w-fit text-secondary-grey text-xs relative font-normal tracking-[0] leading-[normal]">
                                {item.publishTime}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="pagination flex justify-end">
            <Pagination
              current={queryParams.page}
              onChange={(p, s) => {
                queryParams.page = p;
                queryParams.size = s;
              }}
              total={viewModel.total}
              pageSize={queryParams.size}
            />
          </div>
        </div>
      ) : (
        <Empty
          desc="暂无连接器，点击新建连接器"
          btnClick={onAddConnector}
          btnText="新建连接器"
        ></Empty>
      )}
      <Spin spinning={isLoading} fullscreen />
    </PageContainer>
  );
}
