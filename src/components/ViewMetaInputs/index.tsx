import DndTable from "./DndTable";
import { useMemo } from "react";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import FieldEditor from "./FieldEditor";
import useRouter from "@/hooks/useRouter";
import EmptyIcon from "@/assets/images/overview/empty.png";
import { FIELDINDEX } from "@/constant";

export default function ViewMetaInputs({
  viewMetaInputs,
  onSave,
}: {
  viewMetaInputs: IpaasFormSchema[];
  onSave: (sortedData: IpaasFormSchema[]) => Promise<any>;
}) {
  const { searchParams, navBySearchParam } = useRouter();
  const fieldIndex = searchParams[0].get(FIELDINDEX);
  const field: undefined | IpaasFormSchema =
    (fieldIndex && viewMetaInputs?.[+fieldIndex]) || undefined;

  const isEditMode = searchParams[0].has(FIELDINDEX) && !fieldIndex;

  if (fieldIndex && !field) {
    throw new Error("未找到当前字段");
  }

  const tData = useMemo(() => {
    return viewMetaInputs || [];
  }, [viewMetaInputs]);

  const onEditorFinished = (data: IpaasFormSchema, cb?: () => void) => {
    return new Promise<void>((resolve, reject) => {
      const index = tData.findIndex((item) => item.code === data.code);
      // 新增
      if (isEditMode) {
        if (index !== -1) {
          message.error("字段已存在");
          reject("字段已存在");
        } else {
          onSave([...tData, data]).then(resolve, reject);
        }
      } else {
        if (!fieldIndex) {
          message.error("字段不存在");
          reject("字段不存在");
        } else if (index !== -1 && index !== +fieldIndex) {
          message.error("字段已存在");
          reject("字段已存在");
        } else {
          tData.splice(+fieldIndex, 1, data);
          onSave(tData).then(resolve, reject);
        }
      }
    }).then(cb);
  };

  const editInputsParams = (index?: number) => {
    navBySearchParam(FIELDINDEX, index?.toString() ?? "", { replace: true });
  };

  return (
    <div>
      {field || isEditMode ? (
        <FieldEditor
          initialFormField={field}
          onFinished={onEditorFinished}
          fields={viewMetaInputs || []}
        />
      ) : (
        <div className="">
          <div className="h flex justify-between items-center">
            <div className="title">参数列表</div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                editInputsParams();
              }}
            >
              添加参数
            </Button>
          </div>
          <div className="view-meta-inputs mt-4">
            {tData.length ? (
              <DndTable
                filedTableData={tData}
                onSorted={onSave}
                onEdit={(_, index) => {
                  editInputsParams(index);
                }}
              />
            ) : (
              <div className="empty flex flex-col gap-[12px] justify-center items-center h-full mt-16">
                <img alt="" src={EmptyIcon} className="w-[145px] h-[100px]" />
                <span>暂无输入参数，点击添加参数</span>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    editInputsParams();
                  }}
                >
                  添加参数
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
