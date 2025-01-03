import { Input } from 'antd';

export default function InputNoSpace(props: any) {
  return (
    <Input
      {...props}
      onChange={(e) => {
        props.onChange(e.target.value.replace(/\s/g, ''));
      }}
    />
  );
}
