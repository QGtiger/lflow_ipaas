import { useMemo, useRef, useState } from "react";
import RichEditor from "../RichEditor";
import { useEventListener } from "ahooks";
import { Popover, Tree } from "antd";
import useBuiltInValue, { CustomTreeData } from "../useBuiltInValue";
import { CaretDownOutlined } from "@ant-design/icons";

type EditorRef = React.ComponentPropsWithRef<typeof RichEditor>["ref"];

function ContextTree({
  treeItemClick,
}: {
  treeItemClick: (p: { key: string }) => void;
}) {
  const treeData = useBuiltInValue();
  return (
    <Tree
      rootStyle={{
        background: "transparent",
      }}
      defaultExpandAll
      showLine
      switcherIcon={
        <CaretDownOutlined
          style={{
            transform: "translateY(-3px)",
          }}
        />
      }
      treeData={treeData}
      selectedKeys={[]}
      onSelect={(e, o) => {
        const node = o.node as CustomTreeData;
        treeItemClick(node);
      }}
    />
  );
}

export default function VarEditor(props: any) {
  const [open, setOpen] = useState(false);
  const editorRef: EditorRef = useRef(null);
  const wrapperId = useMemo(() => {
    return `wrapper-${Date.now()}`;
  }, []);

  useEventListener(
    "click",
    (e) => {
      if (!document.getElementById(wrapperId)?.contains(e.target as Node)) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    },
    {
      capture: true,
    }
  );

  return (
    <Popover
      overlayInnerStyle={{
        backgroundImage: `linear-gradient(180deg, #108ee930 0%, #ffffff 100%)`,
      }}
      autoAdjustOverflow={false}
      content={
        <ContextTree
          treeItemClick={(item) => {
            console.log("添加", item.key);
            editorRef.current?.insetTemplateStr(`{{${item.key}}}`);
          }}
        />
      }
      arrow={false}
      placement="bottomLeft"
      overlayStyle={{
        width: "680px",
      }}
      open={open}
      getPopupContainer={() =>
        document.getElementById(wrapperId) as HTMLElement
      }
    >
      <div className="w-full">
        <RichEditor ref={editorRef} {...props} wrapperId={wrapperId} />
      </div>
    </Popover>
  );
}
