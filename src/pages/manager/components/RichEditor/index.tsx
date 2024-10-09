import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Quill from "quill";
import { useEventListener, useLatest } from "ahooks";

import "quill/dist/quill.snow.css";
import "./index.css";
import { convertOpsToString, convertStrToQuillDelta } from "./utils";
import "./embed/CustomTag";
import { IPaasCommonFormFieldProps } from "../../../../components/IPaasSchemaForm/type";
import useBuiltInValue from "../useBuiltInValue";

const handleCustomMatcher = (node: any, delta: any) => {
  const opsList: { insert: string }[] = [];
  delta.ops.forEach((op: any) => {
    if (op.insert && typeof op.insert === "string") {
      opsList.push({
        insert: op.insert,
      });
    }
  });
  delta.ops = opsList;
  return delta;
};

const RichEditor = forwardRef<
  {
    getQuillIns: () => Quill | null;
    insetTemplateStr: (str: string) => void;
  },
  IPaasCommonFormFieldProps & {
    wrapperId?: string;
  }
>((props, ref) => {
  const { value, placeholder, onChange, wrapperId } = props;
  const quillWrapperRef = useRef<HTMLDivElement>(null);
  const quillEle = useRef<HTMLDivElement>(null);
  const [quillIns, setQuillIns] = useState<Quill | null>(null);
  const cacheStrRef = useRef<string>("");
  const latestChange = useLatest(onChange);
  const data = useBuiltInValue();

  useImperativeHandle(
    ref,
    () => ({
      getQuillIns: () => {
        return quillIns;
      },
      insetTemplateStr: (str: string) => {
        if (!quillIns) return;
        quillIns.focus();
        const selection = quillIns.getSelection();
        const pos = selection?.index || 0;
        const opsDataList = convertStrToQuillDelta(str, data);

        let posOffset = 0;
        opsDataList.forEach((opsData) => {
          const t = opsData.insert;
          if (typeof t === "string") {
            quillIns.insertText(pos, t);
            posOffset += t.length;
          } else {
            quillIns.insertEmbed(pos, "customTag", t.customTag);
            posOffset++;
          }
          quillIns.setSelection(pos + posOffset, 0);
        });
      },
    }),
    [quillIns]
  );

  useEffect(() => {
    const _ele = quillEle.current;
    if (!_ele) return;
    const _quillIns = new Quill(_ele, {
      modules: {
        clipboard: {
          // 粘贴板，处理粘贴时候的自带样式
          matchers: [[Node.ELEMENT_NODE, handleCustomMatcher]],
        },
        toolbar: false,
      },
      placeholder,
    });

    _quillIns.on("text-change", (delta, oldDelta, source) => {
      if (source === "user") {
        const selection = _quillIns.getSelection();
        if (selection) {
          _quillIns.removeFormat(selection.index, selection.length);
        }
      }

      const str = convertOpsToString(
        _quillIns.getContents().ops as any
      ).replace(/\n/g, "");
      cacheStrRef.current = str;
      latestChange.current(str);
    });

    setQuillIns(_quillIns);
  }, []);

  useEffect(() => {
    if (!value) return;
    if (cacheStrRef.current === value) return;

    quillIns?.setContents(convertStrToQuillDelta(value, data) as any);
  }, [value, quillIns]);

  useEventListener(
    "keydown",
    (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
      }
    },
    {
      target: quillEle.current,
      capture: true,
    }
  );

  useEventListener(
    "click",
    (e) => {
      const _wrapper = quillWrapperRef.current;
      const _ele = quillEle.current;
      if (!_wrapper?.contains(e.target as Node)) {
        _ele?.classList.remove("focused");
      } else {
        _ele?.classList.add("focused");
      }
    },
    {
      capture: true,
    }
  );

  return (
    <div className="wrapper w-full" id={wrapperId} ref={quillWrapperRef}>
      <div
        ref={quillEle}
        className="rich-editor w-full"
        onInput={() => {
          quillEle.current
            ?.querySelector(".ql-editor")
            ?.classList.remove("ql-blank");
        }}
      ></div>
    </div>
  );
});

export default RichEditor;
