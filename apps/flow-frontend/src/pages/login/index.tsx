import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, FormInstance } from "antd";
import { useRef } from "react";

import { SchemaForm } from "@/components/SchemaForm";
import { login } from "./api";
import { useMutation } from "@tanstack/react-query";
import useNav from "@/hooks/useNav";
import { UserModel } from "@/model/UserModel";
import { createSucNotification } from "@/utils/customNotification";

export default function Login() {
  const formRef = useRef<FormInstance>(null);
  const { nav, state } = useNav();
  const { userLogin } = UserModel.useModel();

  const { mutateAsync: loginMutateAsync, isPending } = useMutation({
    mutationFn: login,
  });

  const onFormConfirm = () => {
    return formRef.current?.validateFields().then(async (values) => {
      const loginRes = await loginMutateAsync(values);
      userLogin({
        token: loginRes.accessToken,
        refreshToken: loginRes.refreshToken,
        redirectUrl: state?.from,
      });
      createSucNotification({
        message: "登陆成功",
        description: "欢迎回来," + loginRes.userInfo.username,
      });
    });
  };

  return (
    <div className="flex h-[100vh] items-center justify-center">
      <div className="w-[500px] mt-[-200px]">
        <SchemaForm
          ref={formRef}
          size="large"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onFormConfirm();
            }
          }}
          schema={[
            {
              name: "username",
              type: "Input",
              config: {
                placeholder: "请输入用户名",
                prefix: <UserOutlined />,
              },
              required: true,
            },
            {
              name: "password",
              type: "InputPassword",
              required: true,
              config: {
                placeholder: "请输入密码",
                prefix: <LockOutlined />,
              },
            },
          ]}
        />
        <Button
          loading={isPending}
          type="primary"
          block
          size="large"
          onClick={onFormConfirm}
        >
          登陆
        </Button>
        <div className="flex justify-end mt-2">
          <Button
            type="link"
            className="p-0"
            onClick={() => {
              nav("/register", { replace: true, state });
            }}
          >
            还没有账户？去注册
          </Button>
        </div>
      </div>
    </div>
  );
}
