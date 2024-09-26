import RecursionFormItem from ".";
import { useContext, useMemo } from "react";
import classNames from "classnames";
import { useBoolean } from "ahooks";
import { DownOutlined } from "@ant-design/icons";
import { IpaasFormSchema } from "../type";
import { findCusrorItem } from "../utils/findCursorItem";
import { FormContext } from "antd/es/form/context";

function GroupItem({
  subSchema,
  groupName,
}: {
  subSchema: IpaasFormSchema[];
  groupName: string;
}) {
  const { form } = useContext(FormContext);
  const value = form?.getFieldsValue();
  const [open, openAction] = useBoolean(true);
  const cursorFormItem = findCusrorItem(subSchema, value, 0);

  return (
    <div className="flex flex-col">
      {groupName && (
        <div
          onClick={openAction.toggle}
          className={classNames(
            "text-[14px] font-semibold flex justify-between cursor-pointer",
            open && "mb-3"
          )}
        >
          {groupName}

          <DownOutlined
            className={classNames(" transition-all duration-300", {
              "transform rotate-180": open,
            })}
          />
        </div>
      )}
      <div
        className={classNames("overflow-hidden ", {
          "max-h-0": !open,
        })}
      >
        {cursorFormItem && <RecursionFormItem formItemState={cursorFormItem} />}
      </div>
    </div>
  );
}

export default function CreateSchemaFormItem({
  schema,
}: {
  schema: IpaasFormSchema[];
}) {
  const listByGroup = useMemo(() => {
    const groupMap = new Map<string, IpaasFormSchema[]>();
    const list: Array<{
      groupName: string;
      subSchema: IpaasFormSchema[];
    }> = [];
    schema.forEach((action) => {
      const group = action.group || "";
      if (!groupMap.has(group)) {
        const v: IpaasFormSchema[] = [];
        groupMap.set(group, v);
        list.push({
          groupName: group,
          subSchema: v,
        });
      }
      groupMap.get(group)?.push(action);
    });
    return list;
  }, [schema]);

  return listByGroup.map((group) => {
    const { groupName, subSchema } = group;
    return (
      <GroupItem key={groupName} subSchema={subSchema} groupName={groupName} />
    );
  });
}
