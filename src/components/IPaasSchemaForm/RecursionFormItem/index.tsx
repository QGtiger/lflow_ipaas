import { Form } from "antd";
import { ReactNode, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import useEditor from "../hooks/useEditor";
import { excuteScriptByValidateRules } from "../utils/excuteScript";
import { IPaasSchemaFormStore } from "../store";
import { replaceHtmlATagsWithMarkdown } from "./utils";
import { IPaasDynamicFormItem } from "../type";

const customLinkRenderer = ({ href, children }: any) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

const DefaultConfig = {
  placeholder: "请输入",
};

function CommonLayout(node1: ReactNode, node2: ReactNode) {
  return (
    <>
      {node2}
      {node1}
    </>
  );
}

function WrapperFieldComponent(props: {
  formItemState: IPaasDynamicFormItem;
  [x: string]: any;
}) {
  const { formItemState, ...otherProps } = props;
  const { type, payload } = formItemState;
  const FieldComponent = useEditor(type);
  const _config = Object.assign({}, DefaultConfig, payload.editor.config);
  const { editorLayoutWithDesc } = IPaasSchemaFormStore.useModel();

  const _editorLayoutWithDesc = editorLayoutWithDesc || CommonLayout;
  return (
    <div className="relative">
      {_editorLayoutWithDesc(
        <div className="">
          <FieldComponent
            name={payload.code}
            schemaInfo={payload}
            {...otherProps}
            {..._config}
          />
        </div>,
        payload.description && (
          <div className="desc text-[#888f9d] mb-2">
            <ReactMarkdown
              components={{
                a: customLinkRenderer,
              }}
            >
              {replaceHtmlATagsWithMarkdown(payload.description)}
            </ReactMarkdown>
          </div>
        )
      )}
    </div>
  );
}

export default function RecursionFormItem({
  formItemState,
}: {
  formItemState: IPaasDynamicFormItem;
}) {
  const { payload, next } = formItemState;

  const nextFieldItem = useMemo(() => {
    let current: IPaasDynamicFormItem | null = formItemState;
    if (!next || !current) return null;

    // 获取所有祖先节点
    const acients: IPaasDynamicFormItem[] = [];
    acients.unshift(current);
    while ((current = current.parent)) {
      acients.unshift(current);
    }

    // 递归渲染
    const item = next(formItemState, acients);
    if (!item) return null;
    return <RecursionFormItem formItemState={item} />;
  }, [formItemState]);

  return (
    <>
      <Form.Item
        key={payload.code.toString()}
        label={payload.name}
        name={payload.code}
        required={payload.required}
        rules={[
          {
            validator(_, value) {
              return new Promise<void>((r, j) => {
                // 必填校验
                if (payload.required) {
                  if (value === undefined || value === null || value === "") {
                    j(new Error("请输入"));
                  }
                }

                if (payload.validateRules) {
                  const [suc, errorMsg] = excuteScriptByValidateRules(
                    payload.validateRules,
                    value
                  );
                  if (!suc) {
                    j(new Error(errorMsg));
                  }
                  r();
                }
                r();
              });
            },
          },
        ]}
      >
        <WrapperFieldComponent formItemState={formItemState} />
      </Form.Item>
      {nextFieldItem}
    </>
  );
}
