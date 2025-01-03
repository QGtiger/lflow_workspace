import { Button, ConfigProvider, Input, message, Space } from 'antd';
import { CommonFormFieldProps } from '../../typings';

function copyText(text: string) {
  const input = document.createElement('input');
  // input 隐藏到视窗外面
  input.style.position = 'fixed';
  input.style.left = '-9999px';

  document.body.appendChild(input);
  input.value = text;
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);

  message.success('复制成功');
}

export default function InputWithCopy(props: CommonFormFieldProps<string>) {
  return (
    <Space.Compact className="w-full">
      <Input disabled value={props.value} readOnly />
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#000000',
          },
        }}
      >
        <Button
          type="primary"
          className="shadow-none"
          onClick={() => {
            copyText(props.value);
            message.success('复制成功');
          }}
        >
          复制
        </Button>
      </ConfigProvider>
    </Space.Compact>
  );
}
