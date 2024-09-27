import { AxiosRequestConfig } from "axios";

import { client } from ".";

export const clientConfig = {
  ins: client,
};

export const request = async <T = any>(
  options: AxiosRequestConfig
): Promise<T> => {
  return clientConfig.ins(options);
};

export interface BaseResponse<T> {
  code: number;
  data: T;
  success: boolean;
  message?: string;
}

export interface PageResponse<T> {
  code: number;
  data: T[];
  page: {
    total: number;
    size: number;
    page: number;
    pages: number;
    offset: number;
    order: "desc" | "asc";
  };
  success: boolean;
  message?: string;
}
