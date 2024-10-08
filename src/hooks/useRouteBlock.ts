import { cloneDeep } from "@/utils";
import { createMessage } from "@/utils/customMessage";
import { createModal } from "@/utils/customModal";
import { useDebounceFn, useKeyPress, useLatest, useThrottleFn } from "ahooks";
import { FormInstance, ModalFuncProps } from "antd";
import { useEffect, useRef, useState } from "react";
import {
  NavigateOptions,
  Path,
  useBlocker,
  useNavigate,
} from "react-router-dom";

const isRouterBlockPassRef = {
  current: false,
};

// 清除obj 里面的空值先
const clearEmpty = (obj: any) => {
  for (const key in obj) {
    const v = obj[key];
    if (
      v === undefined ||
      v === null ||
      v === "" ||
      (typeof v === "object" && JSON.stringify(clearEmpty(v)) === "{}") // 空对象 比较
    ) {
      delete obj[key];
    } else {
      if (typeof v === "object" && v !== null) {
        clearEmpty(v);
      }
    }
  }
  return obj;
};

function objectSecurityCheck(obj1: any, obj2: any) {
  return isObj1ContainsObj2(
    clearEmpty(cloneDeep(obj1)),
    clearEmpty(cloneDeep(obj2))
  );
}

function isObj1ContainsObj2(obj1: any, obj2: any) {
  // 遍历 obj2 的每个键值对
  for (const key in obj2) {
    // 检查 obj1 是否有相同的键
    if (
      Object.prototype.hasOwnProperty.call(obj1, key) &&
      Object.prototype.hasOwnProperty.call(obj2, key)
    ) {
      // 如果值是对象，则递归检查
      if (typeof obj1[key] === "object" && typeof obj2[key] === "object") {
        if (obj1[key] !== null && obj2[key] !== null) {
          if (!isObj1ContainsObj2(obj1[key], obj2[key])) {
            return false;
          }
        } else if (obj1[key] !== obj2[key]) {
          // 如果一个为 null 且另一个不为 null，则不匹配
          return false;
        }
      } else if (obj1[key] !== obj2[key]) {
        // 如果不是对象，则直接比较值
        return false;
      }
    } else {
      // 如果 obj1 没有 obj2 的键，则不匹配
      return false;
    }
  }
  return true;
}

/**
 * 执行不受到 useRouteBlock影响
 * @param cb
 */
export function excuteWithoutBlock(cb: () => void) {
  isRouterBlockPassRef.current = true;
  cb();
  isRouterBlockPassRef.current = false;
}

function _queryFormData(formInstanceListRef: React.RefObject<FormInstance>[]) {
  return formInstanceListRef.reduce((res, cur) => {
    return {
      ...res,
      ...cur.current?.getFieldsValue(),
    };
  }, {});
}

// 定义一个beforeunload事件的处理函数
const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
  // 取消事件的默认行为和冒泡
  event.preventDefault();
  event.returnValue = "";
};

export default function useRouteBlock(config: {
  formInstanceListRef: React.RefObject<FormInstance>[]; // 表单实例列表
  originData?: any; // 原始数据
  queryFormData?: (formInstanceListRef: React.RefObject<FormInstance>[]) => any; // 获取表单数据
  onConfirm?: (data: any) => Promise<any>; // 离开页面前的回调
  onAfterConfirm?: () => void; // 关闭弹窗后的回调
  onOriginDataChange?: (data: any) => void; // 原始数据变化时的回调
}) {
  const [formDisabled, setDisabled] = useState(true);
  const [hasChanged, setHasChanged] = useState(false);
  const showPromptRef = useRef(false);
  // 是否是不需要检查的跳转
  const withOutCheckRef = useRef(false);
  const latestConfig = useLatest(config);
  const nav = useNavigate();
  const [formLoading, setFormLoading] = useState(false);

  const disabled = formDisabled || !hasChanged;

  const navWithOutCheck = (
    path: string | Partial<Path>,
    options?: NavigateOptions
  ) => {
    withOutCheckRef.current = true;
    nav(path, options);
    withOutCheckRef.current = false;
  };

  const getCurrFormData = () => {
    const queryFormData = latestConfig.current?.queryFormData || _queryFormData;
    return queryFormData(latestConfig.current.formInstanceListRef);
  };

  const { run: formChange } = useDebounceFn(
    () => {
      // 判断表单数据是否发生变化
      setHasChanged(
        !objectSecurityCheck(latestConfig.current.originData, getCurrFormData())
      );

      const proList = latestConfig.current.formInstanceListRef.map(
        (formInstance) => {
          return formInstance.current?.validateFields({ validateOnly: true });
        }
      );
      Promise.all(proList)
        .then(() => {
          setDisabled(false);
        })
        .catch(() => {
          setDisabled(true);
        });
    },
    {
      wait: 100,
    }
  );

  // 表单提交
  const { run: makeFormConfirm } = useThrottleFn(
    () => {
      setFormLoading(true);
      return latestConfig.current
        .onConfirm?.(getCurrFormData())
        .then(() => {
          formChange();
          latestConfig.current.onAfterConfirm?.();
          createMessage({
            type: "success",
            content: "保存成功",
          });
        })
        .finally(() => {
          setFormLoading(false);
        });
    },
    {
      wait: 500,
      trailing: false,
    }
  );

  const createCustomModal = async (config: ModalFuncProps) => {
    showPromptRef.current = true;
    await createModal(config);
    showPromptRef.current = false;
  };

  // 路由守卫
  useBlocker(({ nextLocation }) => {
    if (isRouterBlockPassRef.current) return false;
    if (withOutCheckRef.current) {
      return false;
    }
    if (showPromptRef.current) return true;
    if (hasChanged) {
      if (disabled) {
        createCustomModal({
          title: "当前改动未保存",
          content: "切换页面未保存内容较会丢失, 放弃编辑还是继续编辑?",
          okText: "继续编辑",
          cancelText: "不保存",
          onCancel() {
            navWithOutCheck(nextLocation);
          },
        });
      } else {
        createCustomModal({
          title: "是否保存已编辑内容",
          content: "如不保存，切换页面后已编辑内容将会丢失",
          okText: "保存",
          cancelText: "不保存",
          onOk() {
            return makeFormConfirm()?.then(() => {
              navWithOutCheck(nextLocation);
            });
          },
          onCancel() {
            navWithOutCheck(nextLocation);
          },
        });
      }
      return true;
    }
    return false;
  });

  useKeyPress(["meta.s"], (e) => {
    e.preventDefault();
    if (!disabled) {
      createModal({
        type: "info",
        title: "保存",
        content: "数据已修改，确定保存?",
        zIndex: 3000,
        onOk() {
          return makeFormConfirm();
        },
      });
    } else {
      createMessage({
        type: "warning",
        content: "当前配置数据不满足保存条件",
      });
    }
  });

  useEffect(() => {
    latestConfig.current?.onOriginDataChange?.(latestConfig.current.originData);
    formChange();
  }, [latestConfig.current.originData]);

  // 修改过才会触发
  useEffect(() => {
    const _window = window.rawWindow || window;
    if (hasChanged) {
      // 在组件挂载后，添加事件监听器
      _window.addEventListener("beforeunload", beforeUnloadHandler);
    } else {
      // 没有修改的话，移除事件监听器
      _window.removeEventListener("beforeunload", beforeUnloadHandler);
    }

    // 清理函数，在组件卸载时移除事件监听器
    return () => {
      _window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, [hasChanged]);

  return {
    disabled,
    hasChanged,
    formChange,
    navWithOutCheck,
    makeFormConfirm,
    createCustomModal,
    formLoading,
  };
}
