import Quill from "quill";
import ReactDOM from "react-dom/client";
import "./index.css";
// import Embed from 'quill/blots/embed';

const Embed: any = Quill.import("blots/embed");

export type TagBlotValue = {
  tagLabel: string | React.ReactElement;
  tagValue: string;
};

class CustomTagBlot extends Embed {
  static blotName: string;
  static tagName: string;
  static className: string;

  static create(value: TagBlotValue) {
    const node: HTMLSpanElement = super.create(value);
    node.setAttribute(
      "data-tag",
      JSON.stringify({
        tagValue: value.tagValue,
      })
    );

    node.setAttribute("contenteditable", "false");

    if (typeof value.tagLabel === "string") {
      node.innerText = value.tagLabel;
    } else {
      ReactDOM.createRoot(node).render(value.tagLabel);
    }

    return node;
  }

  static value(node: any): TagBlotValue {
    try {
      return JSON.parse(node.getAttribute("data-tag"));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return {
        tagLabel: "error",
        tagValue: "error",
      };
    }
  }
}

CustomTagBlot.blotName = "customTag";
CustomTagBlot.tagName = "SPAN";
CustomTagBlot.className = "ql-tag";

Quill.register(CustomTagBlot);
