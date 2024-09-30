// http 请求 method
enum HttpMethodEnum {
  Post = "Post",
  Get = "Get",
  Delete = "Delete",
  Put = "Put",
}

// 执行接口
interface ExcuteInfer {
  mode: "http" | "code";
  httpModeConfig: {
    method: HttpMethodEnum;
    url: string;
    params: Record<string, string>;
    headers: Record<string, string>;
    body: Record<string, string>;
    hooks: {
      pre: string; // 请求前 request解析
      post: string; // 请求后 response 解析 不解析，默认返回原始数据
    };
  };
  codeModeConfig: {
    script: string; // 脚本执行
  };
}

type IpaasAuthProtocel = {
  type: "session_auth" | "app_key" | "none";
  doc?: string;
  inputs: Array<IpaasFormSchema>;
  // 授权本身就是对外部云计算服务，进行数据通信处理，获取三方 token
  excuteProtocol: ExcuteInfer;

  tokenConfig: {
    isAutoRefresh: true; //是否在token 失效的时候，自动刷新token
    // 是否失效的判断
    isTokenInvalid: string; // 判断token 是否失效的脚本 () => boolean
  };

  outputs: OutputStrcut[];
};

interface IpaasConnectorVersion {
  id: number;
  name: string;
  description: string;
  documentlink?: string; // 连接器帮组文档链接
  logo: string; // 连接器logo
  version: number; // 当前连接器版本
  ispublished: boolean;

  authprotocel: IpaasAuthProtocel;
  actions: string; // 动作列表 JSON.stringify(IpaasAction[])

  created_at: number;
  updated_at: number;
}
