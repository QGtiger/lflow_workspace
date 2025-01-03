import {
  getAccessToken,
  userLoginBySetToken,
  userLogoutByRemoveToken,
} from "@/api/utils";
import { createCustomModel } from "@/common/createModel";
import { useBoolean, useReactive } from "ahooks";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const UserModel = createCustomModel(() => {
  const userViewModel = useReactive<UserInfo>({} as UserInfo);
  const [loginFlag, loginFlagAction] = useBoolean(!!getAccessToken());
  const nav = useNavigate();
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (!loginFlag) {
      userLogoutByRemoveToken();
      return;
    }
    alert("获取用户信息");
    // request({
    //   url: '/api/v1/user/info/rich',
    //   method: 'get',
    // }).then((res) => {
    //   Object.assign(userViewModel, res.data);
    // });
  }, [loginFlag]);

  return {
    userInfo: userViewModel,
    userLogin: (opt: {
      token: string;
      refreshToken: string;
      redirectUrl?: string;
    }) => {
      const { token, redirectUrl = "/" } = opt;
      loginFlagAction.setTrue();
      userLoginBySetToken({
        accessToken: token,
        refreshToken: opt.refreshToken,
      });
      nav(redirectUrl);
    },
    loginFlag,
    userLogout() {
      loginFlagAction.setFalse();
      nav("/login", {
        state: { from: pathname + search },
      });
    },
  };
});
