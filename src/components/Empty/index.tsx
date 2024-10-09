import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import EmptyIcon from "@/assets/images/overview/empty.png";

export default function Empty({
  btnText,
  btnClick,
  desc,
}: {
  btnText: string;
  btnClick: React.MouseEventHandler<HTMLElement>;
  desc: string;
}) {
  return (
    <div className="empty flex flex-col gap-[12px] justify-center items-center">
      <img src={EmptyIcon} className="w-[145px] h-[100px]" />
      <span>{desc}</span>
      <Button type="primary" icon={<PlusOutlined />} onClick={btnClick}>
        {btnText}
      </Button>
    </div>
  );
}
