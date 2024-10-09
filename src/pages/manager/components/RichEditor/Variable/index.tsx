import { Popover, Tag } from "antd";
import { useMemo } from "react";
import type { CustomTreeData } from "../../useBuiltInValue";

export function Variable({
  expression,
  buildInValue,
}: {
  expression: string;
  buildInValue: CustomTreeData[];
}) {
  const data = buildInValue;
  const res = useMemo(() => {
    const splt = expression.split(".");

    const result: string[] = [];
    let children: CustomTreeData[] | undefined = data;
    let i = 0;
    let error = false;
    while (i < splt.length) {
      const _key = splt.slice(0, i + 1).join(".");
      if (!children) {
        result.push(`not find children from ${_key}`);
        error = true;
        break;
      }
      const item: CustomTreeData | undefined = children.find(
        (it) => it.key === _key
      );
      if (!item) {
        result.push("not find " + _key);
        error = true;
        break;
      }
      result.push(item.title);
      children = item.children;
      i++;
    }

    return {
      simpleText: result[result.length - 1],
      text: result.join(" -> "),
      error,
    };
  }, [expression, data]);
  return (
    <Popover
      content={res.text}
      title="参数路径"
      overlayInnerStyle={{
        backgroundImage: `linear-gradient(180deg, #108ee930 0%, #ffffff 100%)`,
      }}
    >
      <Tag color={res.error ? "red" : "blue"} className="mx-1">
        {res.simpleText}
      </Tag>
      {/* <Tag color="magenta">{res.simpleText}</Tag> */}
      {/* <div className="bg-[#d16d6d] leading-[24px] px-3 text-[#fff] rounded-md">{res.simpleText}</div> */}
    </Popover>
  );
}
