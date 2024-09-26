import { Button, message, Modal, notification, Result } from "antd";
import { useEffect, useRef } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useLocation, useOutlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { ModalRef } from "../utils/customModal";
import { MessageRef } from "../utils/customMessage";
import { NotificationRef } from "../utils/customNotification";

// 定义错误发生时的备用 UI
const FallbackComponent = (props: any) => {
  console.log(props);
  return (
    <div className=" w-screen h-screen flex items-center justify-center">
      <div className="mt-[-200px]">
        <Result
          status="500"
          title="500"
          subTitle={props.error.message}
          extra={
            <Button
              type="primary"
              onClick={() => {
                window.location.reload();
              }}
            >
              刷新
            </Button>
          }
        />
      </div>
    </div>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {},
});

export default function Layout() {
  const holderRef = useRef<HTMLDivElement>(null);
  const [modal, contextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage({
    getContainer: () => holderRef.current || document.body,
  });
  const [notificationApi, notificationHolder] = notification.useNotification({
    getContainer: () => holderRef.current || document.body,
  });
  const outlet = useOutlet();
  const location = useLocation();

  useEffect(() => {
    while (ModalRef.modalInsList.length) {
      ModalRef.modalInsList.pop()?.destroy();
    }
  }, [location]);

  useEffect(() => {
    // 为了解决动态弹窗 全局样式问题
    ModalRef.current = modal;
    MessageRef.current = messageApi;
    NotificationRef.current = notificationApi;
  });

  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <QueryClientProvider client={queryClient}>
        {outlet}
        <ReactQueryDevtools />
        <div className="holder" ref={holderRef}>
          {contextHolder}
          {messageContextHolder}
          {notificationHolder}
        </div>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
