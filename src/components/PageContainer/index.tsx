import classNames from "classnames";
import { PropsWithChildren } from "react";

export default function PageContainer({
  title,
  children,
  containerMenu,
  withBorder = true,
  extra,
}: PropsWithChildren<{
  title: string;
  containerMenu?: React.ReactNode;
  withBorder?: boolean;
  extra?: React.ReactNode;
}>) {
  return (
    <div className="page-container bg-white rounded-[4px] h-full flex flex-col">
      <div
        className={classNames(
          "page-header items-center flex justify-between px-[24px] py-[16px]",
          {
            "border-b [border-bottom-style:solid] border-border border-[#dddfe3]":
              withBorder,
          }
        )}
      >
        <div className="left text-[16px] font-semibold">{title}</div>
        <div className="right">{containerMenu}</div>
      </div>
      <div className="flex flex-1 overflow-auto">
        <div className="page-content p-[24px] flex-1 overflow-auto">
          {children}
        </div>
        <div className="extra-container">{extra}</div>
      </div>
    </div>
  );
}
