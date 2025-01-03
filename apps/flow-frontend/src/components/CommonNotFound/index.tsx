import useNav from "@/hooks/useNav";
import { Button, Result } from "antd";
import { useEffect } from "react";

export default function CommonNotFound() {
  const { navEntry } = useNav();
  useEffect(() => {
    document.title = "404";
  }, []);
  return (
    <Result
      status={404}
      className="mt-20"
      title="404"
      subTitle="抱歉，您访问的页面不存在。"
      extra={
        <Button
          onClick={() => {
            navEntry();
          }}
        >
          返回首页
        </Button>
      }
    ></Result>
  );
}
