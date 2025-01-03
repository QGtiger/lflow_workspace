import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, FormInstance } from "antd";
import { useRef } from "react";

import { SchemaForm } from "@/components/SchemaForm";
import { EmailCaptchaProps } from "@/components/SchemaForm/components/EmailCaptcha";
import { useMutation } from "@tanstack/react-query";
import { register, sendEmail } from "./api";
import {
  createNotification,
  createSucNotification,
} from "@/utils/customNotification";
import useNav from "@/hooks/useNav";
import { UserModel } from "@/model/UserModel";
import { composeValidator, requiredValidator } from "@/utils";

export default function Register() {
  const formRef = useRef<FormInstance>(null);
  const { nav, state } = useNav();
  const { userLogin } = UserModel.useModel();

  const { mutateAsync: registerMutateAsync, isPending } = useMutation({
    mutationKey: ["register"],
    mutationFn: (params: Parameters<typeof register>[0]) => {
      return register(params).then((res) => {
        userLogin({
          token: res.accessToken,
          refreshToken: res.refreshToken,
          redirectUrl: state?.from,
        });
        createSucNotification({
          message: "注册成功",
          description: "欢迎加入Flow",
        });
      });
    },
  });

  const { mutateAsync: sendEmailMutateAsync } = useMutation({
    mutationKey: ["sendEmail"],
    mutationFn: sendEmail,
  });

  const onFormConfirm = () => {
    return formRef.current?.validateFields().then((values) => {
      return registerMutateAsync(values);
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
              valadator: requiredValidator("用户名"),
            },
            {
              name: "password",
              type: "InputPassword",
              config: {
                placeholder: "请输入密码",
                prefix: <LockOutlined />,
              },
              valadator: composeValidator<string>(
                requiredValidator("密码"),
                (v) => {
                  if (v.length < 6) {
                    return "密码长度不能小于6位";
                  }
                }
              ),
            },
            {
              name: "email",
              type: "Input",
              config: {
                placeholder: "请输入邮箱",
                prefix: <MailOutlined />,
              },
              valadator: composeValidator<string>(
                requiredValidator("邮箱"),
                (v) => {
                  if (
                    !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(v)
                  ) {
                    return "请输入正确的邮箱";
                  }
                }
              ),
            },
            {
              name: "captcha",
              type: "EmailCaptcha",
              required: true,
              config: {
                placeholder: "请输入验证码",
                sendCaptcha: async () => {
                  await formRef.current?.validateFields(["email"]).then((v) => {
                    return sendEmailMutateAsync({
                      address: v.email,
                    }).then(() => {
                      createNotification({
                        type: "success",
                        message: "发送成功",
                        description: "验证码已发送到您的邮箱，请注意查收",
                      });
                    });
                  });
                },
              } as EmailCaptchaProps,
            },
          ]}
        />
        <Button
          loading={isPending}
          type="primary"
          size="large"
          block
          onClick={onFormConfirm}
        >
          注册
        </Button>
        <div className="flex justify-end mt-2">
          <Button
            type="link"
            className="p-0"
            onClick={() => {
              nav("/login", {
                replace: true,
                state,
              });
            }}
          >
            已有账户？去登陆
          </Button>
        </div>
      </div>
    </div>
  );
}
