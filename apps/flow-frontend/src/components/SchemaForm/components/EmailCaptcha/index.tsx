import { useReactive, useUnmount } from "ahooks";
import { Button, Input, Space } from "antd";
import { useRef } from "react";

const DefaultCountDown = 60;

export interface EmailCaptchaProps {
  sendCaptcha: () => Promise<any>;
  countDown?: number;
}

export default function EmailCaptcha(
  props: {
    [x: string]: any;
  } & EmailCaptchaProps
) {
  const { countDown = DefaultCountDown, sendCaptcha, ...rest } = props;
  const viewModel = useReactive({
    isCountDown: false,
    countDownNum: countDown,
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startCountDown = async () => {
    try {
      viewModel.isCountDown = true;
      viewModel.countDownNum = countDown;
      await sendCaptcha();
      timerRef.current = setInterval(() => {
        viewModel.countDownNum -= 1;
        if (viewModel.countDownNum <= 0) {
          clearInterval(timerRef.current!);
          viewModel.isCountDown = false;
        }
      }, 1000);
    } catch (error) {
      console.error(error);
      viewModel.isCountDown = false;
    }
  };

  useUnmount(() => {
    clearInterval(timerRef.current!);
  });

  return (
    <Space.Compact className="w-full">
      <Input {...rest} />
      <Button
        type="primary"
        className="w-[200px]"
        onClick={startCountDown}
        disabled={viewModel.isCountDown}
      >
        {viewModel.isCountDown && viewModel.countDownNum !== countDown
          ? `${viewModel.countDownNum}s重新获取`
          : "获取验证码"}
      </Button>
    </Space.Compact>
  );
}
