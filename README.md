qiankun 微前端解决方案： https://qiankun.umijs.org/zh

https://github.com/tengmaoqing/vite-plugin-qiankun/blob/master/readme.md

## 问题 QA

Q:@vitejs/plugin-react 有什么用

快速重载：在开发环境中，它使得组件能够更快速地重新加载，特别是在你修改组件代码后。

代码转换：它处理 JSX 和 TypeScript 代码的转换，确保它们能够被浏览器正确解析。

模块热替换（HMR）：在开发环境中，它支持模块热替换，这意味着你可以在不刷新整个页面的情况下，看到组件的实时更新。

构建优化：在构建过程中，它能够优化 React 组件的代码，减少最终构建包的大小。

静态资源处理：它能够正确处理 CSS 和图片等静态资源的导入。

vite.config.js 里面需要在开发中注释掉 react() 否则会报错
plugins: [
isDevMode ? [] : react(),
qiankun("micro-ipaas", {
useDevMode: isDevMode, // 根据当前命令动态设置 useDevMode
}),
]
