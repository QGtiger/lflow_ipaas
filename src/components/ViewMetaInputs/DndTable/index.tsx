import React, { useContext, useEffect, useMemo } from "react";
import { HolderOutlined } from "@ant-design/icons";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Popconfirm, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditorKindEnum } from "../FieldEditor/schema";

export type DataType = IpaasFormSchema & {
  code: string;
};

interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
}

const RowContext = React.createContext<RowContextProps>({});

const DragHandle: React.FC = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: "move" }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

const Row: React.FC<RowProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  };

  const contextValue = useMemo<RowContextProps>(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners]
  );

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

const DndTable: React.FC<{
  filedTableData: DataType[];
  onSorted?: (sortedData: DataType[]) => void;
  onEdit?: (record: DataType, index: number) => void;
}> = ({ filedTableData, onSorted, onEdit }) => {
  const [dataSource, setDataSource] = React.useState<DataType[]>(
    filedTableData || []
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((prevState) => {
        const activeIndex = prevState.findIndex(
          (record) => record.code === active?.id
        );
        const overIndex = prevState.findIndex(
          (record) => record.code === over?.id
        );
        const newArray = arrayMove(prevState, activeIndex, overIndex);
        return newArray;
      });
    }
  };

  const columns: ColumnsType<DataType> = [
    { key: "sort", align: "center", width: 80, render: () => <DragHandle /> },
    { title: "展示名称", dataIndex: "name" },
    { title: "是否必填", render: (record) => (record.required ? "是" : "否") },
    { title: "字段编码", dataIndex: "code" },
    { title: "字段分组", dataIndex: "group" },
    {
      title: "控件类型",
      render(record: DataType) {
        const k = record.editor?.kind;
        return EditorKindEnum[k] || "未知控件类型";
      },
    },
    {
      title: "操作",
      render: (record, _, index) => {
        return (
          <span>
            <Typography.Link
              style={{ marginRight: 8 }}
              onClick={() => {
                onEdit?.(record, index);
              }}
            >
              编辑
            </Typography.Link>
            <Popconfirm
              title="确认删除?"
              onConfirm={() => {
                setDataSource(dataSource.filter((i) => i.code !== record.code));
              }}
            >
              <Typography.Link style={{ marginRight: 8 }}>删除</Typography.Link>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  useEffect(() => {
    if (Object.is(filedTableData, dataSource)) return;
    onSorted?.(dataSource);
  }, [dataSource]);

  return (
    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
      <SortableContext
        items={dataSource.map((i) => i.code)}
        strategy={verticalListSortingStrategy}
      >
        <Table
          rowKey="code"
          components={{ body: { row: Row } }}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
      </SortableContext>
    </DndContext>
  );
};

export default DndTable;
