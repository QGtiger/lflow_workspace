import { AxiosRequestConfig } from "axios";

import { client } from ".";

export const request = async <T = any>(
  options: AxiosRequestConfig
): Promise<T> => {
  return client(options);
};

export interface BaseResponse<T> {
  code: number;
  data: T;
  success: boolean;
  message?: string;
}
