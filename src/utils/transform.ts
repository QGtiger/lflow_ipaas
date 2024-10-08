interface OutputType {
  name: string;
  label: string;
  type: string;
  children?: OutputType[];
}

// 判断类型，string ,number, boolean object array
function getType(value: any): string {
  if (Array.isArray(value)) {
    return "array";
  }
  return typeof value;
}

export function transform(
  sample: Record<string, any>,
  result: OutputType[] = []
) {
  for (const key in sample) {
    const v = sample[key];
    if (typeof v === "object") {
      // 复杂类型
      if (Array.isArray(v) && v.length > 0) {
        result.push({
          name: key,
          label: key,
          type: "array",
          children: [
            {
              name: "0",
              label: "0",
              type: getType(v[0]),
              children: transform(v[0]),
            },
          ],
        });
      } else {
        const item = {
          name: key,
          label: key,
          type: "object",
          children: [],
        };
        result.push(item);
        transform(v, item.children);
      }
    } else {
      result.push({
        name: key,
        label: key,
        type: getType(v),
      });
    }
  }
  return result;
}
