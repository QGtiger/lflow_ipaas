import { request } from "@/api/request";
import Empty from "@/components/Empty";
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
import { useThrottleFn } from "ahooks";
import { Button, Dropdown, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";
import { editorConnetorSchema } from "./schema";

async function addConnector(data: any) {
  return request({
    url: "/ipaas/connector",
    method: "post",
    data,
  });
}

async function deleteConnector(opt: { id: number }) {
  return request({
    url: `/ipaas/connector/${opt.id}`,
    method: "delete",
  });
}

async function queryConnectorList(): Promise<
  {
    id: number;
    code: string;
    creator: string;
    name: string;
    description: string;
    logo: string;
    isPublished: boolean;
  }[]
> {
  return request({
    url: "/ipaas/connector",
    method: "get",
  });
}

export default function Overview() {
  const nav = useNavigate();

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["customConnectors"],
    queryFn: () => {
      return queryConnectorList();
    },
  });

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
          return addConnectorMutateAsync(values).then(() => {
            // TODO 跳转到编辑页面
          });
        },
      });
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
      {isLoading ? (
        <Skeleton active />
      ) : (
        <>
          {data?.length && data.length > 0 && !isLoading ? (
            <div className="flex flex-col gap-5 justify-between h-full">
              <div className="content flex-1 h-2 ">
                <div className="grid grid-cols-4 gap-x-[16px] gap-y-[24px]">
                  <div
                    onClick={onAddConnector}
                    className="flex shadow hover:shadow-lg border border-solid cursor-pointer flex-col h-[186px] items-start gap-6 p-4 relative  rounded-lg overflow-hidden  border-border transition-shadow"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 relative flex-1 self-stretch w-full grow text-[#3170FA]">
                      <PlusOutlined className="text-[28px]" />
                      <div className="relative w-fit [font-family:'PingFang_SC-Regular',Helvetica] font-normal text-gj-0v-vz text-sm tracking-[0] leading-[normal]">
                        新建连接器
                      </div>
                    </div>
                  </div>
                  {data.map((item) => {
                    return (
                      <div
                        key={item.code}
                        className={`h-[186px] flex hover:shadow-lg border border-solid cursor-pointer flex-col items-start justify-between gap-6 p-4 relative rounded-lg overflow-hidden  border-border transition-shadow`}
                        onClick={() => {
                          nav(`/manager/${item.code}/base`);
                        }}
                      >
                        <div className="w-full">
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
                                          disabled: item.isPublished,
                                          onClick: () => {
                                            createModal({
                                              title: `确认删除连接器: ${item.name}?`,
                                              content: "删除后不可恢复",
                                              icon: <ExclamationCircleFilled />,
                                              onOk: async () => {
                                                await deleteConnectorMutateAsync(
                                                  {
                                                    id: item.id,
                                                  }
                                                );
                                                refetch();
                                              },
                                            });
                                          },
                                        },
                                      ],
                                    }}
                                  >
                                    <MoreOutlined
                                      className=" hover:bg-[#e4ebfd] rounded p-1"
                                      rotate={90}
                                    />
                                  </Dropdown>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="text-ellipsis-4 text-gray-500 text-xs relative mt-2">
                            {item.description}
                          </div>
                        </div>
                        <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
                          <div className="flex items-center gap-1 relative flex-1 grow  text-gray-500">
                            <UserOutlined />
                            <div className="flex-1 text-gray-500 text-xs relative font-normal tracking-[0] leading-[normal]">
                              {item.creator}
                            </div>
                          </div>
                          <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
                            {item.isPublished && (
                              <>
                                <div className="inline-flex items-start gap-1 relative flex-[0_0_auto]">
                                  <div className="inline-flex items-center justify-center gap-2.5 pt-px pb-0.5 px-2.5 relative flex-[0_0_auto] mt-[-1.00px] mb-[-1.00px] ml-[-1.00px] mr-[-1.00px] bg-[#eefdfb] rounded-[10px] overflow-hidden">
                                    <div className="w-fit  text-[#18a99e] text-xs relative font-normal tracking-[0] leading-[normal]">
                                      已发布
                                    </div>
                                  </div>
                                </div>
                                <div className="inline-flex items-start gap-1 relative flex-[0_0_auto]">
                                  <div className="w-fit text-gray-500 text-xs relative font-normal tracking-[0] leading-[normal]"></div>
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
            </div>
          ) : (
            <Empty
              desc="暂无连接器，点击新建连接器"
              btnClick={onAddConnector}
              btnText="新建连接器"
            ></Empty>
          )}
        </>
      )}
    </PageContainer>
  );
}
