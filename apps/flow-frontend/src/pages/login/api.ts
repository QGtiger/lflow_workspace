import { request } from "@/api/request";

export function register(params: {
  username: string;
  password: string;
  email: string;
  captcha: string;
}) {
  return request<UserLoginRes>({
    url: "/user/register",
    method: "post",
    data: params,
  });
}

export function login(params: { username: string; password: string }) {
  return request<UserLoginRes>({
    url: "/user/login",
    method: "post",
    data: params,
  });
}
