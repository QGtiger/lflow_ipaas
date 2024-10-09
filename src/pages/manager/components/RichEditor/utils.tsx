import { CustomTreeData } from "../useBuiltInValue";
import { TagBlotValue } from "./embed/CustomTag";
import { Variable } from "./Variable";

type ContentValue = (
  | {
      insert: string;
    }
  | {
      insert: {
        customTag: TagBlotValue;
      };
    }
)[];

export function convertStrToQuillDelta(
  str: string,
  buildInValue: CustomTreeData[]
): ContentValue {
  const ops = [];
  /**
   * 添加前置字符串
   * @param startIndex
   * @param endIndex
   */
  function addPreStrByIndex(startIndex: number, endIndex: number) {
    const preStr = str.substring(startIndex, endIndex);
    if (preStr) {
      ops.push({
        insert: preStr,
      });
    }
  }
  const re = new RegExp("{{\\s*([^\\s}}]+)\\s*}}", "g");
  // 前一次的结束位置
  let preStartIndex = 0;
  while (true) {
    const match = re.exec(str);
    if (!match) {
      addPreStrByIndex(preStartIndex, str.length);
      break;
    }
    const matchItem = match[0];
    const tagValue = match[1];
    addPreStrByIndex(preStartIndex, match.index);
    ops.push({
      insert: {
        customTag: {
          tagLabel: (
            <Variable expression={tagValue} buildInValue={buildInValue} />
          ),
          tagValue,
        },
      },
    });

    preStartIndex = match.index + matchItem.length;
  }

  return ops;
}

export function convertOpsToString(ops: ContentValue) {
  return ops.reduce((res, curr) => {
    let result = res;
    const insert = curr.insert;
    if (typeof insert === "string") {
      return (result += insert);
    } else if (typeof insert === "object") {
      if (insert.customTag) {
        return (result += `{{${insert.customTag.tagValue}}}`);
      }
    }
    return result;
  }, "");
}
