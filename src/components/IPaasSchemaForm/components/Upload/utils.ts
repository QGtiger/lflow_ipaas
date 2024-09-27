import OSS from "ali-oss";

const client = new OSS({
  region: "oss-cn-beijing",
  bucket: "lf-ipaas",
  accessKeyId: process.env.OSS_ACCESS_KEYID!,
  accessKeySecret: process.env.OSS_ACCESS_KEYSECRECT!,
});

export function upload(file: File) {
  return client
    .put(file.name, file, {
      headers: {
        "Content-Disposition": `attachment; filename="${file.name}"`,
      },
    })
    .then((result) => result.url);
}

export function cropImage(file: File) {
  return new Promise<File>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // 计算裁切后的正方形尺寸
        const squareSize = Math.min(img.width, img.height);

        canvas.width = squareSize;
        canvas.height = squareSize;

        // 在Canvas上绘制裁切后的正方形图片
        ctx?.drawImage(
          img,
          (img.width - squareSize) / 2, // 源图像裁切的起始x坐标
          (img.height - squareSize) / 2, // 源图像裁切的起始y坐标
          squareSize, // 源图像裁切的宽度
          squareSize, // 源图像裁切的高度
          0, // 目标Canvas的x坐标
          0, // 目标Canvas的y坐标
          squareSize, // 目标Canvas的宽度
          squareSize // 目标Canvas的高度
        );

        let dataUrl = canvas.toDataURL("image/png");
        // 图片质量
        let quality = 1;

        do {
          if (dataUrl.length < 30 * 1024) {
            break;
          }

          quality -= 0.1;
          dataUrl = canvas.toDataURL("image/png", quality);
        } while (quality > 0);

        resolve(
          new File([dataUrlToBlob(dataUrl)], file.name, { type: "image/png" })
        );
      };
    };
    reader.onerror = (error) => reject(error);
  });
}

// 辅助函数：将图片的DataURL转换为Blob对象，以便以二进制形式上传
function dataUrlToBlob(dataUrl: string) {
  const arr = dataUrl.split(","),
    mime = arr[0].match(/:(.*?);/)?.[1], // Add null check
    bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
