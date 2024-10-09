import PageContainer from "@/components/PageContainer";
import { HolderOutlined, PlusOutlined } from "@ant-design/icons";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Button, Popconfirm, Table, TableColumnsType, Typography } from "antd";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ManagerModel } from "../../model";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createSchemaFormModal } from "@/utils/customModal";
import { AddActionSchema } from "./schema";
import { useNavigate } from "react-router-dom";
import { generateShortId } from "@/utils";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import Empty from "@/components/Empty";

type DataType = IpaasAction;

interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
}

const RowContext = createContext<RowContextProps>({});

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
  } = useSortable({ id: props["data-row-key"] });

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

// eslint-disable-next-line react-refresh/only-export-components
export default () => {
  const {
    connectorVersionInfo: { actions },
    addConnectorAction,
    connectorCode,
    updateConnectorActionByList,
  } = ManagerModel.useModel();
  const [dataSource, setDataSource] = useState<DataType[]>(actions);
  const nav = useNavigate();

  useEffect(() => {
    setDataSource(actions);
  }, [actions]);

  useEffect(() => {
    updateConnectorActionByList(dataSource);
  }, [dataSource]);

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((prevState) => {
        const activeIndex = prevState.findIndex(
          (record) => record.code === active?.id
        );
        const overIndex = prevState.findIndex(
          (record) => record.code === over?.id
        );
        return arrayMove(prevState, activeIndex, overIndex);
      });
    }
  };

  const addActionWithRedirect = () => {
    createSchemaFormModal({
      title: "新建执行操作",
      schema: AddActionSchema,
      async onFinished(values) {
        const actionCode = (values.code = `action_${generateShortId()}`);
        return addConnectorAction(values as any).then(() => {
          nav(`/manager/${connectorCode}/action/${actionCode}`);
        });
      },
    });
  };

  const columns: TableColumnsType<DataType> = [
    { key: "sort", align: "center", width: 80, render: () => <DragHandle /> },
    { title: "执行操作名称", dataIndex: "name" },
    { title: "执行操作描述", dataIndex: "description" },
    { title: "唯一标识", dataIndex: "code" },
    { title: "分组管理", dataIndex: "group" },
    {
      title: "操作",
      render: (record: DataType) => {
        return (
          <span>
            <Typography.Link
              style={{ marginRight: 8 }}
              onClick={() => {
                nav(`/manager/${connectorCode}/action/${record.code}`);
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

  return (
    <PageContainer
      title="执行操作"
      containerMenu={
        <div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={addActionWithRedirect}
          >
            添加执行操作
          </Button>
        </div>
      }
    >
      {dataSource.length ? (
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <SortableContext
            items={dataSource.map((i) => i.code)}
            strategy={verticalListSortingStrategy}
          >
            <Table<DataType>
              rowKey="code"
              components={{ body: { row: Row } }}
              columns={columns}
              dataSource={dataSource}
            />
          </SortableContext>
        </DndContext>
      ) : (
        <Empty
          desc="暂无执行操作，一个连接器需要至少一个触发事件或执行操作"
          btnClick={addActionWithRedirect}
          btnText="新建执行操作"
        ></Empty>
      )}
    </PageContainer>
  );
};
