export function getValueFromObjectByPath(
  obj: Record<string, any>,
  path: string[]
) {
  // for
  let result: any = obj;
  for (let i = 0; i < path.length; i++) {
    const key = path[i];
    if (!result[key]) {
      result = undefined;
      break;
    }
    result = result[key];
  }
  return result;
}

export function setValueToObjectByPath(
  obj: Record<string, any>,
  path: string[],
  value: any
) {
  const lastKey = path.pop();
  const target = path.reduce((acc, cur) => {
    if (!acc[cur]) {
      acc[cur] = {};
    }
    return acc[cur];
  }, obj);
  target[lastKey!] = value;
}

export function getValueFormObjectByExpression(
  obj: Record<string, any>,
  expression: string
) {
  const path = expression.split(".");
  return getValueFromObjectByPath(obj, path);
}
