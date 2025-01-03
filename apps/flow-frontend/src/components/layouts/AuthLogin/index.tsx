import { UserModel } from "@/model/UserModel";
import { PropsWithChildren, useEffect } from "react";

export const AuthLoginLayout = ({ children }: PropsWithChildren<any>) => {
  const { loginFlag, userLogout } = UserModel.useModel();

  useEffect(() => {
    if (!loginFlag) {
      userLogout();
    }
  }, [loginFlag, userLogout]);

  if (!loginFlag) {
    return null;
  }
  return children;
};
