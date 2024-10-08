import MonacoEditor, { OnMount } from "@monaco-editor/react";
import { FullscreenOutlined } from "@ant-design/icons";
import { Button, Drawer, Space } from "antd";
import { useReactive } from "ahooks";
import { createModal } from "@/utils/customModal";
import { IPaasCommonFormFieldProps } from "../../type";

// 在你的构建脚本或配置中
// const productionPath = process.env.NODE_ENV === 'production' ? '/static/xybot-front-micro-ipaas/dev/41' : '';
// loader.config({
//   paths: {
//     // FIXME: 运行时 注入问题，这里先用 41版本的 cdn吧
//     vs: productionPath + '/npm/monaco-editor/min/vs',
//   },
// });

export type CodeEditorProps = IPaasCommonFormFieldProps & {
  language?: string;
  width?: number;
};

export default function CodeEditor(props: CodeEditorProps) {
  const { value, onChange, language = "javascript", width = 700 } = props;
  const viewModel = useReactive({
    open: false,
    draftCode: "",
  });

  const handleEditorMount: OnMount = (editor, monaco) => {
    // editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
    //   editor.getAction('editor.action.formatDocument')?.run();
    // });
    // editor.createDecorationsCollection
    // monaco.languages.typescript.javascriptDefaults.addExtraLib(`
    //   declare function main2(config: {
    //     context: {
    //       params: Record<string, any>;
    //       a: number
    //     }
    //   }): any
    // `);
    console.log(editor, monaco);
  };

  const openDrawer = () => {
    viewModel.open = true;
    viewModel.draftCode = value;
  };

  const closeDrawer = (isConfirm: boolean) => {
    if (isConfirm || viewModel.draftCode === value) {
      onChange(viewModel.draftCode);
      viewModel.open = false;
    } else {
      createModal({
        title: "提示",
        content: "是否放弃修改？",
        onOk() {
          viewModel.open = false;
        },
      });
    }
  };

  return (
    <div
      className=" relative group"
      style={{
        width: width || "100%",
      }}
    >
      <MonacoEditor
        value={value}
        onChange={(code) => {
          onChange(code || "");
        }}
        height={400}
        language={language}
        theme="vs-dark"
        className="pt-4 bg-[#1e1e1e]"
        options={{
          fontSize: 12,
          scrollBeyondLastLine: false,
          minimap: { enabled: false },
          tabSize: 2,
          lineNumbersMinChars: 3,
        }}
        onMount={handleEditorMount}
      />
      <div
        onClick={openDrawer}
        className=" transition-all opacity-0 group-hover:opacity-100 absolute cursor-pointer bottom-1 right-1 flex items-center justify-center w-[25px] h-[25px] bg-white rounded-sm"
      >
        <FullscreenOutlined />
      </div>
      <Drawer
        title="代码编辑器"
        open={viewModel.open}
        width={"calc(100% - 400px)"}
        maskClosable={false}
        closable={false}
        zIndex={3000}
        extra={
          <Space>
            <Button
              onClick={() => {
                closeDrawer(false);
              }}
            >
              取消
            </Button>
            <Button
              onClick={() => {
                closeDrawer(true);
              }}
              type="primary"
            >
              确认
            </Button>
          </Space>
        }
      >
        <MonacoEditor
          value={viewModel.draftCode}
          onChange={(code) => {
            viewModel.draftCode = code || "";
          }}
          height={"100%"}
          language={language}
          theme="vs-dark"
          className="pt-4 bg-[#1e1e1e]"
          options={{
            fontSize: 12,
            scrollBeyondLastLine: false,
            tabSize: 2,
            lineNumbersMinChars: 3,
          }}
          onMount={handleEditorMount}
        />
      </Drawer>
    </div>
  );
}
