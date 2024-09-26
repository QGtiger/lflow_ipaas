import { useEffect } from "react";
import { IPaasCommonFormFieldProps } from "../type";

// 判断是否是 真值
function isHasValue(value: any) {
  if (value === undefined || value === null || value === "") return false;
  return true;
}

export default function useDefaultValue(props: IPaasCommonFormFieldProps) {
  useEffect(() => {
    // 有数据不走默认值
    if (isHasValue(props.value)) return;
    // @ts-expect-error 类型推导错误
    const _defaultValue = props.defaultValue;
    if (isHasValue(_defaultValue)) {
      props.onChange(_defaultValue);
    }
  }, []);
}
