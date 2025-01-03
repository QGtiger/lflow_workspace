import { request } from "../request";

export function refreshTokenAPI(params: { refreshToken: string }) {
  return request<Omit<UserLoginRes, "userInfo">>({
    url: "/user/refreshToken",
    method: "get",
    params,
  });
}
