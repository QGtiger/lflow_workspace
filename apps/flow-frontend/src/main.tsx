import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { initRoutes } from "./utils/pagerouter";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { useMount } from "ahooks";
import { Button, Result } from "antd";

import "./main.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CopilotKit } from "@copilotkit/react-core";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  useMount(() => {
    console.error(error);
    // 上传错误
  });

  return (
    <Result
      status="500"
      title="500"
      subTitle="抱歉，系统出现了一些问题，请稍后再试。"
      className="mt-20"
      extra={
        <div className="flex gap-4 justify-center">
          <Button type="primary" onClick={resetErrorBoundary}>
            刷新
          </Button>
          <Button
            type="primary"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            返回首页
          </Button>
        </div>
      }
    />
  );
}

const routes = initRoutes();
console.log(routes);
const router = createBrowserRouter(routes);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
createRoot(document.getElementById("root")!).render(
  <CopilotKit runtimeUrl="http://localhost:3001/copilotkit">
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  </CopilotKit>
);
