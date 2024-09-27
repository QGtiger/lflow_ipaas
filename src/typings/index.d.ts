interface Window {
  __POWERED_BY_QIANKUN__?: boolean;

  rawWindow: Window;
}

interface P {
  context: {
    params: Record<string, any>; // 输入参数键值对
    property: {
      auth: {
        inputs: Record<string, any>; // 授权配置中的输入参数键值对
        outputs: {
          token?: string; // 授权输出 token， 只有配置了 Session auth 或者 Oauth 才会有该字段
        };
        oauth2Config?: {
          // Oauth2.0 授权 应用字段
          clientId: string;
          clientSecret: string;
          authCode: string;
          redirectUrl: string;
          refreshToken: string;
        };
      };
    };
  };
}
