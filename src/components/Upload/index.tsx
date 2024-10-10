import EmptyIcon from "@/assets/images/icons/empty_logo.png";
import CameraIcon from "@/assets/images/icons/camera.png";
import { useRef } from "react";
import { cropImage, upload } from "./utils";
import { message } from "antd";

export default function Upload(props: IPaasCommonFormFieldProps<string>) {
  const inputRef = useRef<HTMLInputElement>(null);

  const _src = props.value || EmptyIcon;

  const onUpload = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    inputRef.current?.click();
  };

  const _onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // 文件大小限制，不能大于2mb
    if (file.size > 1024 * 1024 * 2) {
      return message.error("图片大小不能超过2MB");
    }
    const url = await upload(await cropImage(file));
    props.onChange(url);
  };

  return (
    <div className="items-center justify-center gap-2 inline-flex relative flex-[0_0_auto]">
      <input
        type="file"
        ref={inputRef}
        className="!hidden"
        accept="image/png, image/jpeg, image/jpg"
        onChange={_onFileChange}
      />
      <div className=" relative w-12 h-12 border border-solid border-[#ecedef] rounded-[5.33px] overflow-hidden group">
        <img src={_src} className="w-full h-full object-center p-1" alt="" />
        <div
          className="absolute left-0 top-0 right-0 bottom-0 bg-[#09090b80] cursor-pointer hidden group-hover:block"
          onClick={onUpload}
        >
          <img
            src={CameraIcon}
            className="w-full h-full object-center p-3"
            alt=""
          />
        </div>
      </div>
      <div className="flex-col items-start gap-1 inline-flex relative flex-[0_0_auto]">
        <div
          className="relative font-normal text-[#3170fa] text-xs cursor-pointer"
          onClick={onUpload}
        >
          替换
        </div>
        <div className="relative w-fit [font-family:'PingFang_SC-Regular',Helvetica] font-normal text-secondary-grey text-xs tracking-[0] leading-[normal]">
          图片格式：png、jpeg、jpg、jfif、pjpeg、pjp
        </div>
      </div>
    </div>
  );
}
