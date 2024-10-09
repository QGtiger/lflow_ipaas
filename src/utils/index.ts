export function cloneDeep<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// 生成一个基于当前时间戳和随机因子的8位十六进制字符串
export function generateShortId() {
  const timestamp = Date.now().toString(16);
  const randomPart = Math.random().toString(16).substring(2, 8);
  return timestamp + randomPart;
}
