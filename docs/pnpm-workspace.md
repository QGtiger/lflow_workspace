这节我们用 pnpm workspace + changeset 实现了 monorepo 形式的 npm 包的开发、构建、发布、版本变更。

pnpm workspace 在 pnpm-workspace.yaml 下配置 packages

然后我们用到了这些命令：

安装本地的其他包为依赖：

pnpm --filter cli add core --workspace
--workspace 指定从本地查找包，--filter 指定哪些包下执行命令。

在某些包下安装依赖：

pnpm --filter cli add chalk
在根目录安装依赖：

pnpm add typescript -w --save-dev
在某些包下执行命令：

pnpm --filter cli exec npx tsc --init
在全部包下执行命令

pnpm -r exec npx tsc
还可以通过 --sort 指定拓扑顺序执行命令，这个是 yarn workspace 不支持的

然后用 @changesets/cli 来管理版本变更和发布：

初始化：

npx changeset init
创建一次变更：

npx changeset add
改动版本号并生成 CHANGELOG.md

npx changeset version
发布到 npm 仓库并自动打 tag：

npx changeset publish
我们这节用 pnpm changeset + workspace 来实现了一遍上节的 cli。

整体功能都差不多，就像前面说的，monorepo 的核心就是三点：

本地包的自动 link
在某些包下执行命令，最好支持拓扑顺序
版本变更、发布到 npm
用 pnpm workspace + changeset 能够完美实现这三点功能，相比 pnpm workspace 来说，更好一点。
