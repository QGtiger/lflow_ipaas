import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

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
      <img
        src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        // className="w-[145px] h-[100px]"
      />
      <span>{desc}</span>
      <Button type="primary" icon={<PlusOutlined />} onClick={btnClick}>
        {btnText}
      </Button>
    </div>
  );
}
